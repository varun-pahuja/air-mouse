<h1 align="center">🖱️ AirMouse AI</h1>

<p align="center">
  <b>Turn an ESP32 into a wireless gesture-controlled mouse — with a full-stack dashboard and ML recognition.</b><br/>
  Point. Flick. Click. No surface needed.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-Next.js%2015-black?logo=next.js" />
  <img src="https://img.shields.io/badge/Backend-Node.js%2020-green?logo=node.js" />
  <img src="https://img.shields.io/badge/ML-scikit--learn-orange?logo=python" />
  <img src="https://img.shields.io/badge/Database-MongoDB-brightgreen?logo=mongodb" />
  <img src="https://img.shields.io/badge/Device-ESP32%20+%20MPU6050-red?logo=espressif" />
  <img src="https://img.shields.io/badge/BLE-NimBLE--Arduino-blue" />
</p>

---

## 📖 Table of Contents

1. [What It Does](#-what-it-does)
2. [Architecture](#-architecture)
3. [Hardware Requirements](#-hardware-requirements)
4. [Wiring Guide](#-wiring-guide)
5. [Software Prerequisites](#-software-prerequisites)
6. [Complete Setup Guide](#-complete-setup-guide)
   - [Step 1 — Flash the Firmware](#step-1--flash-the-firmware)
   - [Step 2 — Start the Backend](#step-2--start-the-backend)
   - [Step 3 — Start the Frontend](#step-3--start-the-frontend)
   - [Step 4 — Pair via Bluetooth](#step-4--pair-via-bluetooth)
   - [Step 5 — Connect the Dashboard](#step-5--connect-the-dashboard)
7. [ML Gesture Recognition](#-ml-gesture-recognition)
8. [Dashboard Guide](#-dashboard-guide)
9. [Troubleshooting](#-troubleshooting)
10. [API Reference](#-api-reference)
11. [Project Structure](#-project-structure)

---

## 🎯 What It Does

AirMouse AI converts an **ESP32 + MPU6050** IMU into a fully functional wireless mouse that you hold in the air:

| Feature | Details |
|---|---|
| **Cursor control** | Gyroscope-based — tilt/rotate to move |
| **Physical buttons** | Left click, right click, scroll up/down (GPIO) |
| **BLE HID** | Pairs with Windows/Mac/Linux as a standard Bluetooth mouse |
| **WiFi Dashboard** | Real-time sensor monitoring, gesture mapping, analytics |
| **Gesture Actions** | Map gestures to Volume Up/Down, Next Slide, Scroll, Clicks |
| **ML Recognition** | Train a RandomForest+MLP model on your own gestures |

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                        YOUR PC                               │
│                                                              │
│  ┌──────────────┐   HTTP    ┌──────────────┐                │
│  │   Next.js    │ ────────▶ │  Node.js     │                │
│  │   Frontend   │ ◀──────── │  Backend     │                │
│  │  :4000       │           │  :5000       │                │
│  └──────────────┘           └──────┬───────┘                │
│                                    │ HTTP proxy              │
│  ┌──────────────┐                  ▼                        │
│  │  Flask ML    │ ◀────────  localhost:5001                  │
│  │  :5001       │            /predict                        │
│  └──────────────┘                  │ HTTP                    │
│                                    ▼                        │
│                           ┌──────────────┐                  │
│                           │   MongoDB    │                  │
│                           │   (local)    │                  │
│                           └──────────────┘                  │
└──────────────────────┬───────────────────────────────────────┘
                       │
              WiFi (same network)
                       │
┌──────────────────────▼───────────────────────────────────────┐
│                    ESP32                                     │
│                                                              │
│  ┌────────────┐   I2C   ┌────────────┐                      │
│  │  MPU6050   │ ──────▶ │  ESP32     │──── BLE HID ────▶ PC │
│  │  (IMU)     │         │  WROOM-32  │                      │
│  └────────────┘         │            │◀─── HTTP GET ─── PC  │
│                         │  HTTP :80  │──── /motion ──── PC  │
│                         └────────────┘                      │
│                         GPIO 25/26/33/32 ◀── Buttons        │
└──────────────────────────────────────────────────────────────┘
```

**Data flows:**
- ESP32 → BLE → PC: cursor movement and physical button clicks
- ESP32 → WiFi HTTP → Node.js → Next.js: live sensor data for dashboard
- Next.js → Node.js → Flask → sklearn model: gesture prediction
- Dashboard → Node.js → PowerShell: gesture-mapped system actions

---

## 🔧 Hardware Requirements

| Component | Quantity | Notes |
|---|---|---|
| **ESP32 WROOM-32** | 1 | Any 38-pin or 30-pin variant |
| **MPU6050** | 1 | GY-521 breakout board recommended |
| **Tactile push buttons** | 4 | Left click, Right click, Scroll Up, Scroll Down |
| **10kΩ resistors** | 4 | Pull-downs (or use ESP32 internal pull-ups — already in code) |
| **Jumper wires** | ~20 | Male-to-male and male-to-female |
| **Breadboard** | 1 | Half-size is fine |
| **USB cable** | 1 | Micro-USB or USB-C (for flashing) |

**Optional:**
- 3D printed enclosure
- LiPo battery + TP4056 charger (for wireless use)
- Push-button switches (panel mount, for a cleaner build)

---

## 🔌 Wiring Guide

### MPU6050 → ESP32

| MPU6050 Pin | ESP32 Pin | Notes |
|---|---|---|
| VCC | 3.3V | Do NOT use 5V |
| GND | GND | |
| SDA | GPIO 21 | I2C Data |
| SCL | GPIO 22 | I2C Clock |
| AD0 | GND | Sets I2C address to 0x68 |
| INT | Not connected | |

### Buttons → ESP32

| Button | ESP32 GPIO | Wiring |
|---|---|---|
| Left Click | **GPIO 25** | Button to GND (internal pull-up enabled) |
| Right Click | **GPIO 26** | Button to GND |
| Scroll Up | **GPIO 33** | Button to GND |
| Scroll Down | **GPIO 32** | Button to GND |

> **Wiring tip:** Connect one leg of each button to the GPIO pin and the other leg to GND. The firmware uses `INPUT_PULLUP` so no external resistors are needed.

---

## 💻 Software Prerequisites

### PC Requirements
| Software | Version | Install |
|---|---|---|
| **Node.js** | ≥ 20.x | [nodejs.org](https://nodejs.org) |
| **Python** | ≥ 3.11 | [python.org](https://python.org) |
| **MongoDB** | Local or Atlas | [mongodb.com](https://mongodb.com) |
| **Arduino IDE** | ≥ 2.x | [arduino.cc](https://arduino.cc) |

### Arduino Libraries (install via Library Manager)
| Library | Author | Purpose |
|---|---|---|
| `NimBLE-Arduino` | h2zero | BLE HID (stable, low memory) |
| `ESP32_BLE_Mouse` | wakwak-koba | BLE mouse HID profile |
| `MPU6050_light` | rfetick | IMU sensor driver |

> ⚠️ **Important:** After installing `ESP32_BLE_Mouse`, open  
> `Documents/Arduino/libraries/ESP32_BLE_Mouse/src/BleMouse.h`  
> and add `#include <functional>` on line 9 (before the class definition).  
> Without this fix, compilation will fail with a `std::function` error.

---

## 🚀 Complete Setup Guide

### Step 1 — Flash the Firmware

1. Open **Arduino IDE 2.x**

2. Add ESP32 board support:
   - File → Preferences → Additional Board Manager URLs:
     ```
     https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json
     ```
   - Tools → Board → Board Manager → install **esp32 by Espressif Systems**

3. Select board: **Tools → Board → ESP32 Arduino → ESP32 Dev Module**

4. Set partition scheme: **Tools → Partition Scheme → Minimal SPIFFS (1.9MB APP)** or larger

5. Open `firmware/AirMouse/AirMouse.ino`

6. Edit your WiFi credentials near the top:
   ```cpp
   const char* SSID = "YourWiFiName";
   const char* PASS = "YourWiFiPassword";
   ```
   > ⚠️ The ESP32 and your PC must be on the **same** WiFi network.

7. Click **Upload** (▶) and open Serial Monitor at **115200 baud**

8. You should see:
   ```
   === AirMouse v2.1 FINAL ===
   [1] Wire OK
   [2] MPU OK
   [3] Gyro OK
   [4] Buttons OK
   [5] BLE OK
       Pair 'AirMouse' in Bluetooth settings
   [6] WiFi OK http://10.x.x.x
       ^ Copy this to backend/esp32_ip.txt
   [7] HTTP OK
   === READY ===
   ```

9. **Copy the IP address** shown (e.g. `10.210.199.72`) — you'll need it in Step 5.

---

### Step 2 — Start the Backend

```powershell
cd "c:\Users\Varun\air mouse\air-mouse\backend"
npm install
npm run dev
```

Backend starts at **http://localhost:5000**

**First time only** — create a `.env` file in `/backend/`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/airmouse
```

---

### Step 3 — Start the Frontend

Open a new terminal:
```powershell
cd "c:\Users\Varun\air mouse\air-mouse\frontend"
npm install
npm run dev
```

Frontend starts at **http://localhost:4000**

Open this URL in your browser.

---

### Step 4 — Pair via Bluetooth

1. On Windows: **Settings → Bluetooth & devices → Add device**
2. Select **"AirMouse"** from the list
3. Once paired, the ESP32 Serial Monitor shows:
   ```
   BLE connected
   ```
4. Move the ESP32 — your cursor should move immediately ✅

---

### Step 5 — Connect the Dashboard

1. Open the dashboard at **http://localhost:4000**
2. Go to **Settings → ESP32 Connection**
3. Paste the IP address from Step 1 (e.g. `10.210.199.72`)
4. Click **Save IP** — the dashboard header should show **● Connected**
5. Real-time sensor values (AX, AY, AZ, GX, GY, GZ) will start streaming

---

## 🧠 ML Gesture Recognition

The ML pipeline lets you train a custom gesture classifier on your own motions. It replaces the simple heuristic detection with real neural network inference.

### Workflow Overview

```
Record samples → Train model → Start inference server → Live predictions
```

### Step 1 — Install Python Dependencies

```powershell
cd "c:\Users\Varun\air mouse\air-mouse"
pip install -r ml/requirements.txt
```

Installs: `scikit-learn`, `flask`, `flask-cors`, `numpy`, `joblib`

### Step 2 — Record Training Samples

1. Open dashboard → **Gestures** tab
2. Click **AI Training Data** sub-tab
3. For each gesture you want to recognize:
   - Type a gesture name (e.g. `flick right`)
   - Click **Record** — a 3-2-1 countdown starts
   - **Perform the gesture** during the 1-second capture window
   - Repeat **15–20 times** per gesture
4. Progress bars show how many samples each gesture has
5. Aim for **balanced classes** (same count per gesture)

**Recommended gesture set for beginners:**

| Gesture | Motion | Suggested Action |
|---|---|---|
| `flick right` | Sharp wrist flick to the right | Next Slide |
| `flick left` | Sharp wrist flick to the left | Previous Slide |
| `tilt up` | Raise device nose upward | Volume Up |
| `tilt down` | Lower device nose downward | Volume Down |

### Step 3 — Train the Model

Click **Train Model** in the dashboard.

The button spawns `python ml/train.py` in the background and polls for completion. You'll see:
```
Training in progress... (2s)
Training in progress... (4s)
...
🎉 Model trained! Restart inference server to load it.
```

Training output (via backend logs):
```
[train] Loaded 72 samples | 4 gestures
         flick right          -> 20 samples
         flick left           -> 18 samples
         tilt up              -> 17 samples
         tilt down            -> 17 samples
[train] Cross-val accuracy: 91.7% ± 8.3%
[train] Training accuracy: 100.0%
[train] Model saved → ml/model.pkl
```

### Step 4 — Start the Inference Server

```powershell
cd "c:\Users\Varun\air mouse\air-mouse"
python ml/inference_server.py
```

Expected output:
```
[inference] ✅ Model loaded — 4 gestures: ['flick left', 'flick right', 'tilt down', 'tilt up']
[inference] 🚀 Starting on http://localhost:5001
```

> Keep this terminal open while using AirMouse.

### Step 5 — Use ML Predictions in Testing Tab

1. Go to **Simulation & Testing** tab
2. Badge shows **🧠 ML Active** (purple) — ML is live
3. The **Neural Network Confidence** panel shows live probability bars per gesture
4. When confidence > 70%, the mapped action fires automatically

**If server is offline**, the badge shows **Heuristic** (grey) and simple threshold-based detection is used as fallback.

### Tips for Better Accuracy

| Issue | Fix |
|---|---|
| Model always predicts one gesture | Record more samples for the underrepresented gesture |
| Low cross-val accuracy (<80%) | Gestures may be too similar — make motions more distinct |
| High variance in accuracy score | Add more samples (aim for 20+ per gesture) |
| Confidence never exceeds 70% | Record cleaner samples — keep device still before each gesture |

---

## 📊 Dashboard Guide

### Dashboard Tab
Real-time overview of the device state:
- **Connection status** — WiFi + BLE indicators
- **Latency** — round-trip ping to ESP32 HTTP server
- **Battery** — (placeholder for future hardware)
- **Active Profile** — currently selected gesture profile
- **Live Gesture Monitor** — 6-axis real-time sensor waveform
- **Operating Mode** — Mouse / Presentation / Gaming

### Gestures Tab
Manage and train gestures:
- **Add Gesture** — give it a name, assign it an action
- **AI Training Data** tab — record sensor samples for ML training
  - Shows step-by-step ML setup guide that auto-checks completion
  - Progress bars per gesture with sample counts
  - One-click Train Model button

### Profiles Tab
Multiple gesture profile sets:
- Create profiles for different use cases (presentations, gaming, etc.)
- Switch profiles instantly — gestures reload from DB

### Analytics Tab
Live session statistics:
- **Gestures Mapped** — how many gestures exist in current profile
- **Mapping Rate** — % of gestures that have an action assigned
- **Session Actions Fired** — count since dashboard opened
- **Most Used Gestures** — bar chart of trigger counts (from Testing tab activity)
- **Session Activity Timeline** — actions fired per minute

### Simulation & Testing Tab
Test gesture detection live:
- **Real-Time Motion Stream** — all 6 axes with color-coded bars
- **Action Activity Log** — every trigger with timestamp, gesture, action, source (ML/heuristic), confidence
- **How It Works** panel — updates to explain ML vs heuristic mode
- **Neural Network Confidence** — per-gesture probability bars (live when ML server running)

### Settings Tab
- **Sensitivity** — global cursor speed multiplier
- **Dark/Light mode** toggle
- **ESP32 IP** — update if device gets a new IP address
- **Gesture export/import**

---

## 🐛 Troubleshooting

### ESP32 crashes on boot (abort/panic)
- **Cause:** WiFi sleep disabled while BLE is active
- **Fix:** Ensure `WiFi.setSleep(false)` is NOT in the firmware — remove it if present

### `std::function` compile error
- **Fix:** Add `#include <functional>` to `BleMouse.h` line 9

### Dashboard shows "Device Offline"
- Check ESP32 and PC are on the same WiFi network
- Confirm the IP in Settings matches Serial Monitor output
- Ping the IP: `ping 10.x.x.x` — if it fails, ESP32 may have a new IP

### BLE cursor not moving / slow
- Ensure `WiFi.setSleep()` is not called (breaks BLE TDM)
- Dead zone: adjust `#define DEAD_ZONE 0.15` in firmware (higher = less drift)
- Low-pass filter: adjust `alpha = 0.08f` (lower = smoother but more lag)

### Physical buttons not working
- Check Serial Monitor for `[BTN] LEFT pressed — BLE=yes` when pressing
- If nothing prints: verify GPIO pins match your wiring (`BTN_LEFT 25`, `BTN_RIGHT 26`)
- If prints but no click: BLE may not be paired — pair first, then test

### ML `timeout of 8000ms exceeded`
- Fixed in current version — training now runs async in background
- Restart backend and try again

### ML `UnicodeEncodeError` on Windows
- Fixed in current version — `PYTHONUTF8=1` flag set automatically

### `POST /predict → 503`
- Inference server is running but model not loaded
- Cause: server was started **before** training completed
- Fix: `Ctrl+C` the inference server and restart it after training

### Cross-val accuracy is low (<75%)
- Need more samples (aim for 20+ per gesture)
- Gestures may be physically too similar
- Try recording in different orientations/speeds

---

## 📡 API Reference

### Backend (Node.js — port 5000)

#### ESP32 Proxy Routes
| Method | Route | Description |
|---|---|---|
| GET | `/api/esp32/status` | Device connected, BLE state, RSSI |
| GET | `/api/esp32/motion` | Live ax/ay/az/gx/gy/gz readings |
| GET | `/api/esp32/settings` | Current sensitivity/threshold |
| POST | `/api/esp32/settings` | Update sensitivity |
| GET | `/api/esp32/stats` | Clicks, scrolls, moves counters |
| POST | `/api/esp32/stats/reset` | Reset counters |
| POST | `/api/esp32/ip` | Update stored ESP32 IP |

#### Gesture Database Routes
| Method | Route | Description |
|---|---|---|
| GET | `/api/gestures` | List all gestures for active profile |
| POST | `/api/gestures` | Create new gesture |
| PATCH | `/api/gestures/:id` | Update gesture action |
| DELETE | `/api/gestures/:id` | Delete gesture |

#### ML Routes
| Method | Route | Description |
|---|---|---|
| GET | `/api/ml/status` | Model trained? Server live? Samples count? |
| GET | `/api/ml/samples` | Summary of collected training data |
| POST | `/api/ml/sample` | Save one labeled sample (50 frames) |
| DELETE | `/api/ml/samples` | Clear all training data |
| DELETE | `/api/ml/samples/:gesture` | Clear one gesture's samples |
| POST | `/api/ml/train` | Trigger Python training (async) |
| POST | `/api/ml/predict` | Proxy predict to Flask :5001 |

#### Action Executor
| Method | Route | Body | Description |
|---|---|---|---|
| POST | `/api/execute-action` | `{ action: "Volume Up" }` | Runs PowerShell to trigger OS action |

**Supported actions:**
`Volume Up`, `Volume Down`, `Next Slide`, `Previous Slide`, `Scroll Up`, `Scroll Down`, `Left Click`, `Right Click`, `Double Click`

---

### Flask ML Server (Python — port 5001)

| Method | Route | Description |
|---|---|---|
| GET | `/health` | Server alive? Model loaded? Gesture list |
| POST | `/predict` | Classify 50 frames → gesture + confidence + probabilities |
| GET | `/gestures` | List trained gesture classes |

**Predict request:**
```json
{
  "frames": [
    [0.01, -0.14, 0.97, 1.86, 0.44, 1.46],
    ...
  ]
}
```

**Predict response:**
```json
{
  "gesture": "flick right",
  "confidence": 0.927,
  "probabilities": [
    { "gesture": "flick left", "prob": 0.073 },
    { "gesture": "flick right", "prob": 0.927 }
  ]
}
```

---

### ESP32 HTTP Server (port 80)

| Route | Response |
|---|---|
| `GET /status` | `{ connected, bleConnected, ip, rssi }` |
| `GET /motion` | `{ ax, ay, az, gx, gy, gz }` |
| `GET /settings` | `{ sensitivity, deadZone, alpha }` |
| `POST /settings` | Update and persist settings |

---

## 📁 Project Structure

```
air-mouse/
│
├── firmware/
│   └── AirMouse/
│       └── AirMouse.ino          # ESP32 firmware (BLE + WiFi + HTTP)
│
├── backend/
│   ├── server.js                 # Express app, routes, ESP32 proxy
│   ├── routes/
│   │   ├── gestures.js           # Gesture CRUD
│   │   ├── profiles.js           # Profile management
│   │   ├── settings.js           # Device settings
│   │   ├── usage.js              # Analytics
│   │   └── mlTraining.js         # ML data collection + training trigger
│   ├── services/
│   │   └── esp32Service.js       # ESP32 HTTP proxy + polling
│   ├── models/                   # Mongoose schemas
│   ├── data/
│   │   └── training_samples.json # Collected ML training data
│   └── esp32_ip.txt              # Current ESP32 IP address
│
├── frontend/
│   └── src/
│       ├── app/
│       │   └── page.jsx          # Main dashboard page + state
│       ├── components/Dashboard/
│       │   ├── DashboardSection.jsx
│       │   ├── GesturesSection.jsx
│       │   ├── GestureTrainingMode.jsx  # ML training UI + guide
│       │   ├── TestingSection.jsx       # Live testing + ML predictions
│       │   ├── AnalyticsSection.jsx     # Real analytics
│       │   ├── UsageChart.jsx
│       │   ├── AccuracyChart.jsx
│       │   └── ...
│       ├── hooks/
│       │   ├── useDashboardData.js  # ESP32 polling
│       │   ├── useGestures.js
│       │   └── ...
│       └── services/
│           └── api.js            # All API calls (axios)
│
└── ml/
    ├── train.py                  # Training script (sklearn RF + MLP)
    ├── inference_server.py       # Flask prediction server (:5001)
    ├── requirements.txt          # Python dependencies
    ├── model.pkl                 # Trained model (generated)
    └── labels.json               # Gesture class labels (generated)
```

---

## 🔄 Running Everything Together

| Terminal | Command | URL |
|---|---|---|
| 1 — Backend | `cd backend && npm run dev` | `:5000` |
| 2 — Frontend | `cd frontend && npm run dev` | `:4000` |
| 3 — ML Server | `python ml/inference_server.py` | `:5001` |
| 4 — Arduino Serial Monitor | (Flash first, then monitor) | 115200 baud |

> MongoDB must be running locally (`mongod`) or use MongoDB Atlas (set `MONGO_URI` in `.env`).

---

## 🏆 Current Status

| Feature | Status |
|---|---|
| BLE cursor control | ✅ Working |
| Physical buttons | ✅ Working |
| WiFi dashboard | ✅ Working |
| Real-time sensor stream | ✅ Working |
| Gesture mapping to actions | ✅ Working |
| System action execution (PowerShell) | ✅ Working |
| ML training pipeline | ✅ Working |
| ML real-time inference | ✅ Working |
| Neural Network Confidence panel | ✅ Working |
| Analytics (real data) | ✅ Working |
| AI model accuracy (2 gestures) | ~94% cross-val |

---

*Built with ❤️ — ESP32 + React + Python + BLE*
