/*
 * ============================================================
 *  ESP32 Air Mouse — Full Firmware  (codebase-aligned v2)
 *  Extends: BLE Mouse + MPU6500 motion algorithm
 *  Adds   : WiFi, ESPAsyncWebServer, REST API for dashboard
 * ============================================================
 *
 *  Required Libraries (install via Arduino Library Manager):
 *    - BleMouse           by T-vK
 *    - Adafruit MPU6050
 *    - Adafruit Unified Sensor
 *    - ESPAsyncWebServer  by me-no-dev
 *    - AsyncTCP           by me-no-dev
 *    - ArduinoJson        by Benoit Blanchon  (v6 or v7)
 *
 *  Endpoints matched to backend/services/esp32Service.js:
 *    GET  /status        ← esp32Service.checkConnection()
 *    GET  /stats         ← esp32Service.getStats()
 *    POST /stats/reset   ← esp32Service.resetStats()
 *    GET  /settings      ← esp32Service.getSettings()
 *    POST /settings      ← esp32Service.updateSettings()
 *    GET  /info          ← esp32Service.getDeviceInfo()
 *    GET  /motion        ← dashboard live feed (extra)
 *    POST /calibrate     ← dashboard button (extra)
 *
 *  Field names match backend/models/Settings.js:
 *    baseSensitivity, threshold, dynamicScaling, invertX, invertY
 *
 *  ESP32 IP is already set in backend/services/esp32Service.js:
 *    const ESP32_IP = 'http://172.20.220.228';
 *    → Set WIFI_SSID/WIFI_PASSWORD so the device gets that IP,
 *      OR update ESP32_IP after flashing with the printed IP.
 * ============================================================
 */

// ─────────────────────────────────────────────────────────────
//  INCLUDES
// ─────────────────────────────────────────────────────────────
#include <BleMouse.h>
#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>
#include <Wire.h>
#include <WiFi.h>
#include <ESPAsyncWebServer.h>
#include <ArduinoJson.h>

// ─────────────────────────────────────────────────────────────
//  CONFIGURATION  ← Change these before flashing
// ─────────────────────────────────────────────────────────────
const char* WIFI_SSID     = "YOUR_WIFI_SSID";      // ← your WiFi name
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";  // ← your WiFi password

// ─────────────────────────────────────────────────────────────
//  HARDWARE PINS  (match server.js /api/components pinout)
//    GPIO 19 → Left Click  (server.js line 156: "Button_Right": "GPIO 19")
//    GPIO 14 → Right Click (server.js line 158: "Button_ScrollUp": "GPIO 14")
//    GPIO 18 → Scroll Up   (server.js line 155: "Button_Left": "GPIO 18")
//    GPIO 27 → Scroll Down (server.js line 159: "Button_ScrollDown": "GPIO 27")
// ─────────────────────────────────────────────────────────────
#define LEFT_CLICK_PIN   19
#define RIGHT_CLICK_PIN  14
#define SCROLL_UP_PIN    18
#define SCROLL_DOWN_PIN  27

// ─────────────────────────────────────────────────────────────
//  OBJECTS
// ─────────────────────────────────────────────────────────────
BleMouse         bleMouse("ESP32 Air Mouse");
Adafruit_MPU6050 mpu;
AsyncWebServer   server(80);

// ─────────────────────────────────────────────────────────────
//  MOTION SETTINGS — names match backend/models/Settings.js
//    baseSensitivity : Number  default 10.0  min 1  max 50
//    threshold       : Number  default 0.01  min 0.001  max 0.1
//    dynamicScaling  : Boolean default true
//    invertX         : Boolean default true
//    invertY         : Boolean default false
// ─────────────────────────────────────────────────────────────
volatile float   baseSensitivity = 10.0f;
volatile float   threshold       = 0.01f;
volatile bool    dynamicScaling  = true;
volatile bool    invertX         = true;
volatile bool    invertY         = false;

// ─────────────────────────────────────────────────────────────
//  CALIBRATION  (baseline offsets subtracted from raw gyro)
// ─────────────────────────────────────────────────────────────
float baseGX    = 0.0f;
float baseGY    = 0.0f;
bool  calibrated = false;

// ─────────────────────────────────────────────────────────────
//  SMOOTHING  (exponential moving average — kept from original)
// ─────────────────────────────────────────────────────────────
#define SMOOTH_ALPHA 0.4f
float smoothX = 0.0f;
float smoothY = 0.0f;

// ─────────────────────────────────────────────────────────────
//  LIVE MOTION DATA  (updated every loop, served by GET /motion)
// ─────────────────────────────────────────────────────────────
volatile float liveGX = 0.0f;
volatile float liveGY = 0.0f;

// ─────────────────────────────────────────────────────────────
//  TIMING — non-blocking scroll debounce
// ─────────────────────────────────────────────────────────────
#define SCROLL_INTERVAL_MS 150UL
unsigned long lastScrollTime = 0;

// ─────────────────────────────────────────────────────────────
//  STATISTICS — served by GET /stats, reset by POST /stats/reset
//  Field names match usageController.js action filters:
//    "click", "scroll", "move", "connect"
// ─────────────────────────────────────────────────────────────
unsigned long totalActions   = 0;
unsigned long totalClicks    = 0;
unsigned long totalScrolls   = 0;
unsigned long totalMoves     = 0;
unsigned long bleConnections = 0;
unsigned long sessionStart   = 0;

// ═════════════════════════════════════════════════════════════
//  SECTION 1 — CALIBRATION
// ═════════════════════════════════════════════════════════════
void calibrate() {
  const int SAMPLES = 100;
  float sumX = 0.0f, sumY = 0.0f;

  Serial.println("[CAL] Calibrating... hold the device still.");
  for (int i = 0; i < SAMPLES; i++) {
    sensors_event_t a, g, temp;
    mpu.getEvent(&a, &g, &temp);
    sumX += g.gyro.z;   // z-axis → horizontal cursor movement
    sumY += g.gyro.y;   // y-axis → vertical cursor movement
    delay(5);           // only used during calibration startup
  }

  baseGX    = sumX / SAMPLES;
  baseGY    = sumY / SAMPLES;
  smoothX   = 0.0f;
  smoothY   = 0.0f;
  calibrated = true;

  Serial.printf("[CAL] Done. baseGX=%.4f  baseGY=%.4f\n", baseGX, baseGY);
}

// ═════════════════════════════════════════════════════════════
//  SECTION 2 — MOTION READING
// ═════════════════════════════════════════════════════════════
void readMotion(int &outX, int &outY) {
  sensors_event_t a, g, temp;
  mpu.getEvent(&a, &g, &temp);

  // Calibration offset
  float rawX = g.gyro.z - baseGX;
  float rawY = g.gyro.y - baseGY;

  // Live data for /motion endpoint
  liveGX = rawX;
  liveGY = rawY;

  // Deadzone
  if (fabs(rawX) < threshold) rawX = 0.0f;
  if (fabs(rawY) < threshold) rawY = 0.0f;

  // Smoothing (EMA)
  smoothX = SMOOTH_ALPHA * rawX + (1.0f - SMOOTH_ALPHA) * smoothX;
  smoothY = SMOOTH_ALPHA * rawY + (1.0f - SMOOTH_ALPHA) * smoothY;

  // Dynamic vs fixed sensitivity
  float sens = baseSensitivity;
  if (dynamicScaling) {
    float speed = sqrtf(smoothX * smoothX + smoothY * smoothY);
    sens = baseSensitivity * (1.0f + speed * 0.2f);
  }

  // Apply invert flags (match invertX default=true, invertY default=false)
  float fx = invertX ? -(smoothX * sens)      : (smoothX * sens);
  float fy = invertY ? -(smoothY * (sens+2))  : (smoothY * (sens+2));

  outX = (int)fx;
  outY = (int)fy;
}

// ═════════════════════════════════════════════════════════════
//  SECTION 3 — BUTTON HANDLING  (non-blocking)
// ═════════════════════════════════════════════════════════════
void handleButtons() {
  // Left click
  static bool leftWasPressed = false;
  bool leftNow = (digitalRead(LEFT_CLICK_PIN) == LOW);
  if (leftNow && !leftWasPressed) {
    bleMouse.press(MOUSE_LEFT);
    totalClicks++;
    totalActions++;
  } else if (!leftNow && leftWasPressed) {
    bleMouse.release(MOUSE_LEFT);
  }
  leftWasPressed = leftNow;

  // Right click
  static bool rightWasPressed = false;
  bool rightNow = (digitalRead(RIGHT_CLICK_PIN) == LOW);
  if (rightNow && !rightWasPressed) {
    bleMouse.press(MOUSE_RIGHT);
    totalClicks++;
    totalActions++;
  } else if (!rightNow && rightWasPressed) {
    bleMouse.release(MOUSE_RIGHT);
  }
  rightWasPressed = rightNow;

  // Scroll — non-blocking millis debounce (replaces original delay(150))
  unsigned long now = millis();
  if (now - lastScrollTime >= SCROLL_INTERVAL_MS) {
    if (digitalRead(SCROLL_UP_PIN) == LOW) {
      bleMouse.move(0, 0, 1);
      totalScrolls++;
      totalActions++;
      lastScrollTime = now;
    } else if (digitalRead(SCROLL_DOWN_PIN) == LOW) {
      bleMouse.move(0, 0, -1);
      totalScrolls++;
      totalActions++;
      lastScrollTime = now;
    }
  }
}

// ═════════════════════════════════════════════════════════════
//  SECTION 4 — WIFI SETUP
// ═════════════════════════════════════════════════════════════
void setupWiFi() {
  Serial.print("[WiFi] Connecting to: ");
  Serial.println(WIFI_SSID);

  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }

  Serial.println();
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("[WiFi] Connected!");
    Serial.print("[WiFi] IP Address: ");
    Serial.println(WiFi.localIP());
    Serial.println("[WiFi] >>> Update ESP32_IP in backend/services/esp32Service.js if different <<<");
  } else {
    Serial.println("[WiFi] FAILED — check SSID/password. HTTP API will be unavailable.");
  }
}

// ═════════════════════════════════════════════════════════════
//  SECTION 5 — HTTP SERVER SETUP
//  All endpoints match those called in esp32Service.js
// ═════════════════════════════════════════════════════════════
void setupServer() {
  // CORS — allow the React frontend at localhost:3000
  DefaultHeaders::Instance().addHeader("Access-Control-Allow-Origin",  "*");
  DefaultHeaders::Instance().addHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  DefaultHeaders::Instance().addHeader("Access-Control-Allow-Headers", "Content-Type");

  // ──────────────────────────────────────────────────────────
  //  GET /status
  //  Called by: esp32Service.checkConnection()
  //  Returns:   { connected, bleConnected, wifi, ip, rssi }
  //  Used by:   server.js GET /api/esp32/status
  // ──────────────────────────────────────────────────────────
  server.on("/status", HTTP_GET, [](AsyncWebServerRequest *request) {
    StaticJsonDocument<192> doc;
    doc["connected"]    = true;                          // ESP32 is reachable
    doc["bleConnected"] = bleMouse.isConnected();
    doc["wifi"]         = (WiFi.status() == WL_CONNECTED);
    doc["ip"]           = WiFi.localIP().toString();
    doc["rssi"]         = WiFi.RSSI();

    String body;
    serializeJson(doc, body);
    request->send(200, "application/json", body);
  });

  // ──────────────────────────────────────────────────────────
  //  GET /stats
  //  Called by: esp32Service.getStats()
  //  Returns:   { totalActions, clicks, scrolls, moves,
  //               connections, sessionDuration, uptime }
  //  Used by:   server.js GET /api/esp32/stats
  // ──────────────────────────────────────────────────────────
  server.on("/stats", HTTP_GET, [](AsyncWebServerRequest *request) {
    StaticJsonDocument<256> doc;
    doc["totalActions"]     = totalActions;
    doc["clicks"]           = totalClicks;
    doc["scrolls"]          = totalScrolls;
    doc["moves"]            = totalMoves;
    doc["connections"]      = bleConnections;
    doc["sessionDuration"]  = (millis() - sessionStart) / 1000UL;
    doc["uptime"]           = millis() / 1000UL;

    String body;
    serializeJson(doc, body);
    request->send(200, "application/json", body);
  });

  // ──────────────────────────────────────────────────────────
  //  POST /stats/reset
  //  Called by: esp32Service.resetStats()
  //  Returns:   { success: true }
  //  Used by:   server.js POST /api/esp32/stats/reset
  // ──────────────────────────────────────────────────────────
  server.on(
    "/stats/reset",
    HTTP_POST,
    [](AsyncWebServerRequest *request) {},
    NULL,
    [](AsyncWebServerRequest *request, uint8_t *data, size_t len,
       size_t index, size_t total) {
      totalActions   = 0;
      totalClicks    = 0;
      totalScrolls   = 0;
      totalMoves     = 0;
      bleConnections = 0;
      sessionStart   = millis();
      Serial.println("[STATS] Statistics reset.");
      request->send(200, "application/json", "{\"success\":true}");
    }
  );

  // ──────────────────────────────────────────────────────────
  //  GET /settings
  //  Called by: esp32Service.getSettings()
  //  Returns:   { baseSensitivity, threshold, dynamicScaling,
  //               invertX, invertY }
  //  Field names match backend/models/Settings.js exactly
  //  Used by:   server.js GET /api/esp32/settings
  // ──────────────────────────────────────────────────────────
  server.on("/settings", HTTP_GET, [](AsyncWebServerRequest *request) {
    StaticJsonDocument<128> doc;
    doc["baseSensitivity"] = (float)baseSensitivity;
    doc["threshold"]       = (float)threshold;
    doc["dynamicScaling"]  = (bool)dynamicScaling;
    doc["invertX"]         = (bool)invertX;
    doc["invertY"]         = (bool)invertY;

    String body;
    serializeJson(doc, body);
    request->send(200, "application/json", body);
  });

  // ──────────────────────────────────────────────────────────
  //  POST /settings
  //  Called by: esp32Service.updateSettings(req.body)
  //  Accepts:   any subset of Settings.js fields
  //  Validates: ranges match Settings.js schema (min/max)
  //  Returns:   { success, baseSensitivity, threshold,
  //               dynamicScaling, invertX, invertY }
  //  Used by:   server.js POST /api/esp32/settings
  // ──────────────────────────────────────────────────────────
  server.on(
    "/settings",
    HTTP_POST,
    [](AsyncWebServerRequest *request) {},
    NULL,
    [](AsyncWebServerRequest *request, uint8_t *data, size_t len,
       size_t index, size_t total) {

      StaticJsonDocument<256> doc;
      DeserializationError err = deserializeJson(doc, data, len);
      if (err) {
        request->send(400, "application/json", "{\"error\":\"Invalid JSON\"}");
        return;
      }

      // baseSensitivity — min 1, max 50 (matches Settings.js schema)
      if (doc.containsKey("baseSensitivity")) {
        float val = doc["baseSensitivity"].as<float>();
        if (val >= 1.0f && val <= 50.0f) {
          baseSensitivity = val;
          Serial.printf("[CFG] baseSensitivity → %.2f\n", baseSensitivity);
        } else {
          request->send(400, "application/json",
                        "{\"error\":\"baseSensitivity must be 1–50\"}");
          return;
        }
      }

      // threshold — min 0.001, max 0.1 (matches Settings.js schema)
      if (doc.containsKey("threshold")) {
        float val = doc["threshold"].as<float>();
        if (val >= 0.001f && val <= 0.1f) {
          threshold = val;
          Serial.printf("[CFG] threshold → %.4f\n", threshold);
        } else {
          request->send(400, "application/json",
                        "{\"error\":\"threshold must be 0.001–0.1\"}");
          return;
        }
      }

      // Boolean flags — no range check needed
      if (doc.containsKey("dynamicScaling")) {
        dynamicScaling = doc["dynamicScaling"].as<bool>();
        Serial.printf("[CFG] dynamicScaling → %s\n", dynamicScaling ? "true" : "false");
      }
      if (doc.containsKey("invertX")) {
        invertX = doc["invertX"].as<bool>();
        Serial.printf("[CFG] invertX → %s\n", invertX ? "true" : "false");
      }
      if (doc.containsKey("invertY")) {
        invertY = doc["invertY"].as<bool>();
        Serial.printf("[CFG] invertY → %s\n", invertY ? "true" : "false");
      }

      // Return current state (mirrors GET /settings)
      StaticJsonDocument<128> res;
      res["success"]         = true;
      res["baseSensitivity"] = (float)baseSensitivity;
      res["threshold"]       = (float)threshold;
      res["dynamicScaling"]  = (bool)dynamicScaling;
      res["invertX"]         = (bool)invertX;
      res["invertY"]         = (bool)invertY;

      String body;
      serializeJson(res, body);
      request->send(200, "application/json", body);
    }
  );

  // ──────────────────────────────────────────────────────────
  //  GET /info
  //  Called by: esp32Service.getDeviceInfo()
  //  Returns:   device identity + firmware metadata
  //  Used by:   server.js GET /api/esp32/info
  // ──────────────────────────────────────────────────────────
  server.on("/info", HTTP_GET, [](AsyncWebServerRequest *request) {
    StaticJsonDocument<256> doc;
    doc["device"]      = "ESP32 Air Mouse";
    doc["firmware"]    = "v2.0.0";
    doc["sensor"]      = "MPU6050/MPU6500";
    doc["bleUUID"]     = "HID Mouse (1812)";
    doc["ip"]          = WiFi.localIP().toString();
    doc["mac"]         = WiFi.macAddress();
    doc["uptime"]      = millis() / 1000UL;
    doc["calibrated"]  = calibrated;

    String body;
    serializeJson(doc, body);
    request->send(200, "application/json", body);
  });

  // ──────────────────────────────────────────────────────────
  //  GET /motion  (extra — for live dashboard feed)
  //  Returns: { gx, gy }  — calibrated gyro values
  // ──────────────────────────────────────────────────────────
  server.on("/motion", HTTP_GET, [](AsyncWebServerRequest *request) {
    StaticJsonDocument<64> doc;
    doc["gx"] = (float)liveGX;
    doc["gy"] = (float)liveGY;

    String body;
    serializeJson(doc, body);
    request->send(200, "application/json", body);
  });

  // ──────────────────────────────────────────────────────────
  //  POST /calibrate  (extra — triggered from dashboard UI)
  //  Returns: { status: "calibrated", baseGX, baseGY }
  // ──────────────────────────────────────────────────────────
  server.on(
    "/calibrate",
    HTTP_POST,
    [](AsyncWebServerRequest *request) {},
    NULL,
    [](AsyncWebServerRequest *request, uint8_t *data, size_t len,
       size_t index, size_t total) {
      calibrate();

      StaticJsonDocument<96> doc;
      doc["status"] = "calibrated";
      doc["baseGX"] = baseGX;
      doc["baseGY"] = baseGY;

      String body;
      serializeJson(doc, body);
      request->send(200, "application/json", body);
    }
  );

  // ── CORS pre-flight + 404 fallback ──
  server.onNotFound([](AsyncWebServerRequest *request) {
    if (request->method() == HTTP_OPTIONS) {
      request->send(200);
    } else {
      request->send(404, "application/json", "{\"error\":\"Not found\"}");
    }
  });

  server.begin();
  Serial.println("[HTTP] Web server started on port 80");
  Serial.println("[HTTP] Endpoints: /status /stats /stats/reset /settings /info /motion /calibrate");
}

// ═════════════════════════════════════════════════════════════
//  SETUP
// ═════════════════════════════════════════════════════════════
void setup() {
  Serial.begin(115200);
  delay(1000);

  Serial.println("\n=================================");
  Serial.println(" ESP32 Air Mouse — v2.0.0");
  Serial.println("=================================\n");

  // MPU sensor
  if (!mpu.begin()) {
    Serial.println("[ERR] MPU sensor not found — check I2C wiring (SDA=21, SCL=22)!");
    while (1) delay(10);
  }
  mpu.setAccelerometerRange(MPU6050_RANGE_4_G);
  mpu.setGyroRange(MPU6050_RANGE_500_DEG);
  mpu.setFilterBandwidth(MPU6050_BAND_21_HZ);
  Serial.println("[OK] MPU sensor ready");

  // Buttons
  pinMode(LEFT_CLICK_PIN,   INPUT_PULLUP);
  pinMode(RIGHT_CLICK_PIN,  INPUT_PULLUP);
  pinMode(SCROLL_UP_PIN,    INPUT_PULLUP);
  pinMode(SCROLL_DOWN_PIN,  INPUT_PULLUP);
  Serial.println("[OK] Buttons configured");

  // BLE Mouse
  bleMouse.begin();
  Serial.println("[OK] BLE mouse advertising as 'ESP32 Air Mouse'");

  // WiFi
  setupWiFi();

  // HTTP server (only if WiFi connected)
  if (WiFi.status() == WL_CONNECTED) {
    setupServer();
  }

  // Initial calibration
  calibrate();

  sessionStart = millis();

  Serial.println("\n=================================");
  Serial.println(" Setup complete — entering loop");
  Serial.println("=================================\n");
}

// ═════════════════════════════════════════════════════════════
//  LOOP  — target: ~5 ms/iteration, zero blocking waits
// ═════════════════════════════════════════════════════════════
void loop() {
  // BLE connection edge detection
  static bool bleWasConnected = false;
  bool bleNow = bleMouse.isConnected();

  if (bleNow && !bleWasConnected) {
    bleConnections++;
    Serial.println("[BLE] Connected!");
  } else if (!bleNow && bleWasConnected) {
    Serial.println("[BLE] Disconnected.");
  }
  bleWasConnected = bleNow;

  // Always read motion so /motion endpoint stays fresh
  int dx, dy;
  readMotion(dx, dy);

  // Only move cursor + handle buttons when BLE is alive
  if (bleNow) {
    if (dx != 0 || dy != 0) {
      bleMouse.move((int8_t)dx, (int8_t)dy);
      totalMoves++;
      totalActions++;
    }
    handleButtons();
  }

  // ESPAsyncWebServer runs on its own FreeRTOS task,
  // no polling needed here. 5 ms yield prevents WDT reset.
  delay(5);
}
