#include <Wire.h>
#include <MPU6500_WE.h>
#include <BleMouse.h>
#include <WiFi.h>
#include <ESPAsyncWebServer.h>
#include <ArduinoJson.h>

// ───── CONFIG ─────
// AP Mode: ESP32 creates its own WiFi network
const char* ap_ssid = "AirMouse-WiFi";
const char* ap_pass = "airmouse123";

#define MPU_ADDR 0x68

MPU6500_WE mpu(MPU_ADDR);
BleMouse bleMouse("AirMouse", "ESP32", 100);
AsyncWebServer server(80);

// Buttons
#define BTN_LEFT 25
#define BTN_RIGHT 26
#define BTN_UP 33
#define BTN_DOWN 32

// SETTINGS
float sensitivity = 2.0;
bool recordMode = false;
float offsetX = 0;
float offsetY = 0;

// STATE
float liveGX = 0, liveGY = 0, liveGZ = 0;
float liveAX = 0, liveAY = 0, liveAZ = 0;

// 🔥 smoothing must be global
float smoothX = 0;
float smoothY = 0;

unsigned long lastSampleTime = 0;

// ───── FUNCTION DECLARATIONS ─────
void setupServer();
void readSensor();
void processMotion();
void handleButtons();

// ───── SETUP ─────
void setup() {
  Serial.begin(115200);
  delay(1000);

  Serial.println("Starting...");
  Wire.begin(21, 22);

  // MPU INIT
  bool ok = false;
  for(int i=0;i<5;i++){
    if(mpu.init()){
      ok = true;
      break;
    }
    Serial.println("Retry MPU...");
    delay(500);
  }

  if(!ok){
    Serial.println("❌ MPU FAILED");
    while(1);
  }

  delay(1000);
  mpu.autoOffsets();
  Serial.println("MPU Ready");

  // DRIFT CALIBRATION
  Serial.println("Calibrating drift... KEEP STILL");

  float sumX = 0, sumY = 0;
  for(int i=0;i<200;i++){
    xyzFloat g = mpu.getGyrValues();   // ✅ FIXED
    sumX += g.y;
    sumY += -g.x;
    delay(5);
  }

  offsetX = sumX / 200.0;
  offsetY = sumY / 200.0;

  Serial.println("Drift calibrated");

  // Buttons
  pinMode(BTN_LEFT, INPUT_PULLUP);
  pinMode(BTN_RIGHT, INPUT_PULLUP);
  pinMode(BTN_UP, INPUT_PULLUP);
  pinMode(BTN_DOWN, INPUT_PULLUP);

  // BLE FIRST
  Serial.println("Starting BLE...");
  delay(2000);
  bleMouse.begin();
  Serial.println("BLE Started");

  // WiFi Access Point Mode
  Serial.println("Starting WiFi AP...");
  WiFi.mode(WIFI_AP);
  WiFi.softAP(ap_ssid, ap_pass);
  delay(100);

  Serial.println("✅ WiFi AP Started!");
  Serial.print("Network: "); Serial.println(ap_ssid);
  Serial.print("Password: "); Serial.println(ap_pass);
  Serial.print("IP: "); Serial.println(WiFi.softAPIP());

  setupServer();
}

// ───── LOOP ─────
void loop() {

  if (millis() - lastSampleTime >= 20) {
    lastSampleTime = millis();
    readSensor();

    if(recordMode){
      Serial.printf("%.3f,%.3f,%.3f,%.3f,%.3f,%.3f\n",
        liveAX, liveAY, liveAZ,
        liveGX, liveGY, liveGZ);
    }
  }

  // BLE reconnect logic
  if(!bleMouse.isConnected()){
    static bool wasConnected = false;

    if(wasConnected){
      Serial.println("BLE Disconnected → restarting...");
      delay(1000);
      ESP.restart();
    }

    wasConnected = false;
    delay(100);
    return;
  }

  static bool wasConnected = true;

  processMotion();
  handleButtons();

  delay(10);
}

// ───── SENSOR ─────
void readSensor() {
  xyzFloat g = mpu.getGyrValues();   // ✅ FIXED
  xyzFloat a = mpu.getGValues();

  liveGX = g.y;
  liveGY = -g.x;
  liveGZ = g.z;

  liveAX = a.x;
  liveAY = a.y;
  liveAZ = a.z;
}

// ───── MOTION ─────
void processMotion() {

  float gx = liveGX - offsetX;
  float gy = liveGY - offsetY;

  if(abs(gx) < 0.05) gx = 0;
  if(abs(gy) < 0.05) gy = 0;

  smoothX = 0.85 * smoothX + 0.15 * gx;
  smoothY = 0.85 * smoothY + 0.15 * gy;

  float speed = sqrt(smoothX*smoothX + smoothY*smoothY);
  float scale = 1.0 + speed * 1.2;

  float dx = smoothX * scale * sensitivity;
  float dy= smoothY * scale * sensitivity;

  if(abs(gx) < 0.08) gx = 0;
  if(abs(gy) < 0.08) gy = 0;

  bleMouse.move(dx, dy);
}

// ───── BUTTONS ─────
void handleButtons() {

  static bool lPrev = false, rPrev = false;

  bool lNow = digitalRead(BTN_LEFT) == LOW;
  if(lNow && !lPrev){
    bleMouse.click(MOUSE_LEFT);
  }
  lPrev = lNow;

  bool rNow = digitalRead(BTN_RIGHT) == LOW;
  if(rNow && !rPrev){
    bleMouse.click(MOUSE_RIGHT);
  }
  rPrev = rNow;

  if(digitalRead(BTN_UP) == LOW){
    bleMouse.move(0,0,1);
    delay(100);
  }

  if(digitalRead(BTN_DOWN) == LOW){
    bleMouse.move(0,0,-1);
    delay(100);
  }
}

// ───── SERVER ─────
void setupServer() {

  server.on("/motion", HTTP_GET, [](AsyncWebServerRequest *req){
    StaticJsonDocument<256> doc;
    doc["ax"] = liveAX;
    doc["ay"] = liveAY;
    doc["az"] = liveAZ;
    doc["gx"] = liveGX;
    doc["gy"] = liveGY;
    doc["gz"] = liveGZ;

    String res;
    serializeJson(doc, res);
    req->send(200, "application/json", res);
  });

  server.on("/record", HTTP_POST, [](AsyncWebServerRequest *req){
    recordMode = !recordMode;
    req->send(200, "text/plain", recordMode ? "ON" : "OFF");
  });

  // 🔥 ADDED STATUS API
  server.on("/status", HTTP_GET, [](AsyncWebServerRequest *req){
    StaticJsonDocument<128> doc;
    doc["ble"] = bleMouse.isConnected();
    doc["ip"] = WiFi.softAPIP().toString();

    String res;
    serializeJson(doc, res);
    req->send(200, "application/json", res);
  });

  // Dashboard Stats Compatibility
  server.on("/stats", HTTP_GET, [](AsyncWebServerRequest *req){
    StaticJsonDocument<128> doc;
    doc["clicks"] = 0; doc["scrolls"] = 0; doc["moves"] = 0; doc["connections"] = bleMouse.isConnected() ? 1 : 0;
    String res; serializeJson(doc, res); req->send(200, "application/json", res);
  });

  // Dashboard Settings Compatibility
  server.on("/settings", HTTP_GET, [](AsyncWebServerRequest *req){
    StaticJsonDocument<128> doc;
    doc["sens"] = sensitivity;
    doc["th"] = 0.05;
    doc["invX"] = false;
    doc["invY"] = false;
    doc["recordMode"] = recordMode;
    String res; serializeJson(doc, res); req->send(200, "application/json", res);
  });

  server.on("/settings", HTTP_POST, [](AsyncWebServerRequest *req){}, NULL,
  [](AsyncWebServerRequest *req, uint8_t *data, size_t len, size_t, size_t){
    StaticJsonDocument<256> doc;
    deserializeJson(doc, data);

    if(doc.containsKey("sens")) sensitivity = doc["sens"];
    if(doc.containsKey("recordMode")) recordMode = doc["recordMode"];

    req->send(200, "application/json", "{\"ok\":true}");
  });

  server.begin();
}