#include <Wire.h>
#include <MPU6500_WE.h>
#include <BleMouse.h>
#include <WiFi.h>
#include <ESPAsyncWebServer.h>
#include <ArduinoJson.h>

// ───── CONFIG ─────
const char* ssid = "OPPO";
const char* pass = "87654321";

#define MPU_ADDR 0x68

MPU6500_WE mpu(MPU_ADDR);
BleMouse bleMouse("AirMouse Stable");
AsyncWebServer server(80);

// Buttons
#define BTN_LEFT 25
#define BTN_RIGHT 26
#define BTN_UP 33
#define BTN_DOWN 32

// ───── SETTINGS (TUNED FOR STABILITY) ─────
float baseSensitivity = 0.6;
float threshold = 0.04;
float alpha = 0.9;
bool invertX = false;
bool invertY = false;

// ───── STATE ─────
float smoothX = 0, smoothY = 0;
float liveGX = 0, liveGY = 0, liveGZ = 0;
float liveAX = 0, liveAY = 0, liveAZ = 0;

// stats
unsigned long clicks=0, scrolls=0, moves=0, connections=0;

// ───── SETUP ─────
void setup() {
  Serial.begin(115200);
  Wire.begin(21,22);

  if(!mpu.init()){
    Serial.println("MPU ERROR");
    while(1);
  }

  delay(1000);
  Serial.println("Calibrating...");
  mpu.autoOffsets();

  pinMode(BTN_LEFT, INPUT_PULLUP);
  pinMode(BTN_RIGHT, INPUT_PULLUP);
  pinMode(BTN_UP, INPUT_PULLUP);
  pinMode(BTN_DOWN, INPUT_PULLUP);

  bleMouse.begin();

  // WiFi
  WiFi.begin(ssid, pass);
  while(WiFi.status()!=WL_CONNECTED){
    delay(300); Serial.print(".");
  }
  Serial.println("\nIP:");
  Serial.println(WiFi.localIP());

  setupServer();
}

// ───── LOOP ─────
void loop() {

  static bool prevConn=false;
  bool now=bleMouse.isConnected();

  if(now && !prevConn) connections++;
  prevConn=now;

  xyzFloat g = mpu.getGyrValues();
  xyzFloat a = mpu.getAccValues();

  float rawX = g.y;
  float rawY = -g.x;

  liveGX = rawX;
  liveGY = rawY;
  liveGZ = g.z;

  liveAX = a.x;
  liveAY = a.y;
  liveAZ = a.z;

  // deadzone
  if(abs(rawX) < threshold) rawX = 0;
  if(abs(rawY) < threshold) rawY = 0;

  // smoothing (EMA)
  smoothX = alpha*smoothX + (1-alpha)*rawX;
  smoothY = alpha*smoothY + (1-alpha)*rawY;

  float fx = invertX ? -smoothX : smoothX;
  float fy = invertY ? -smoothY : smoothY;

  // 🔥 STABLE DYNAMIC SCALING
  float speed = sqrt(smoothX*smoothX + smoothY*smoothY);
  float dynamic = 1.0 + (speed * 0.1);

  float mx = fx * baseSensitivity * dynamic;
  float my = fy * baseSensitivity * dynamic;

  // soft limiting (prevents jumps)
  mx = mx / (1 + abs(mx) * 0.1);
  my = my / (1 + abs(my) * 0.1);

  int dx = (int)mx;
  int dy = (int)my;

  // jitter removal
  if(abs(dx) < 2) dx = 0;
  if(abs(dy) < 2) dy = 0;

  if(now){
    if(dx || dy){
      bleMouse.move(dx, dy);
      moves++;
    }

    handleButtons();
  }

  delay(10); // slower = smoother
}

// ───── BUTTON HANDLING ─────
void handleButtons(){

  static bool lPrev=0, rPrev=0;

  bool lNow = digitalRead(BTN_LEFT)==LOW;
  if(lNow && !lPrev){
    bleMouse.click(MOUSE_LEFT);
    clicks++;
  }
  lPrev = lNow;

  bool rNow = digitalRead(BTN_RIGHT)==LOW;
  if(rNow && !rPrev){
    bleMouse.click(MOUSE_RIGHT);
    clicks++;
  }
  rPrev = rNow;

  static unsigned long lastScroll=0;

  if(millis() - lastScroll > 120){
    if(digitalRead(BTN_UP)==LOW){
      bleMouse.move(0,0,1);
      scrolls++;
      lastScroll = millis();
    }
    if(digitalRead(BTN_DOWN)==LOW){
      bleMouse.move(0,0,-1);
      scrolls++;
      lastScroll = millis();
    }
  }
}

// ───── DASHBOARD SERVER ─────
void setupServer(){

  server.on("/status", HTTP_GET, [](AsyncWebServerRequest *req){
    StaticJsonDocument<128> doc;
    doc["ble"]=bleMouse.isConnected();
    doc["ip"]=WiFi.localIP().toString();
    String res; serializeJson(doc,res);
    req->send(200,"application/json",res);
  });

  server.on("/motion", HTTP_GET, [](AsyncWebServerRequest *req){
    StaticJsonDocument<256> doc;
    doc["ax"]=liveAX;
    doc["ay"]=liveAY;
    doc["az"]=liveAZ;
    doc["gx"]=liveGX;
    doc["gy"]=liveGY;
    doc["gz"]=liveGZ;
    String res; serializeJson(doc,res);
    req->send(200,"application/json",res);
  });

  server.on("/stats", HTTP_GET, [](AsyncWebServerRequest *req){
    StaticJsonDocument<128> doc;
    doc["clicks"]=clicks;
    doc["scrolls"]=scrolls;
    doc["moves"]=moves;
    doc["connections"]=connections;
    String res; serializeJson(doc,res);
    req->send(200,"application/json",res);
  });

  server.on("/settings", HTTP_GET, [](AsyncWebServerRequest *req){
    StaticJsonDocument<128> doc;
    doc["sens"] = baseSensitivity;
    doc["th"] = threshold;
    doc["invX"] = invertX;
    doc["invY"] = invertY;
    String res; serializeJson(doc,res);
    req->send(200,"application/json",res);
  });

  server.on("/settings", HTTP_POST, [](AsyncWebServerRequest *req){},NULL,
  [](AsyncWebServerRequest *req,uint8_t *data,size_t len,size_t,size_t){


    StaticJsonDocument<128> doc;
    deserializeJson(doc,data);

    if(doc["sens"]) baseSensitivity = doc["sens"];
    if(doc["th"]) threshold = doc["th"];
    if(doc["invX"]) invertX = doc["invX"];
    if(doc["invY"]) invertY = doc["invY"];

    req->send(200,"application/json","{\"ok\":true}");
  });

  server.on("/calibrate", HTTP_POST, [](AsyncWebServerRequest *req){
    mpu.autoOffsets();
    req->send(200,"application/json","{\"status\":\"calibrated\"}");
  });

  server.begin();
}