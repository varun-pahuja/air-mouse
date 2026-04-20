const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
const settingsRoutes = require('./routes/settings');
const usageRoutes = require('./routes/usage');
const esp32Service = require('./services/esp32Service');

const app = express();

// Connect to MongoDB (uses db.js exclusively — no double connect)
connectDB();

// FIX: restrict CORS to known origin instead of wildcard
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:4000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// FIX: body-size limit prevents OOM from large payloads
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ── Routes ──
app.use('/api/settings', settingsRoutes);
app.use('/api/usage', usageRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// ============ ESP32 Real-Time Routes ============

app.get('/api/esp32/status', async (req, res) => {
  try {
    const status = await esp32Service.checkConnection();
    if (status) {
      res.json({ connected: true, ...status });
    } else {
      res.json({ connected: false, message: 'ESP32 not reachable' });
    }
  } catch (error) {
    res.status(500).json({ connected: false, error: error.message });
  }
});

app.get('/api/esp32/stats', async (req, res) => {
  try {
    const stats = await esp32Service.getStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/esp32/settings', async (req, res) => {
  try {
    const settings = await esp32Service.getSettings();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/esp32/settings', async (req, res) => {
  try {
    const settings = await esp32Service.updateSettings(req.body);
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/esp32/stats/reset', async (req, res) => {
  try {
    const result = await esp32Service.resetStats();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/esp32/info', async (req, res) => {
  try {
    const info = await esp32Service.getDeviceInfo();
    res.json(info);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ Team Data ============
// FIX: /api/team now properly exists (was missing — frontend always got 404)
app.get('/api/team', (req, res) => {
  const team = [
    {
      id: 1,
      name: "Your Name",
      role: "Hardware Engineer",
      bio: "Specialized in ESP32 and IoT devices. Designed the circuit and PCB layout.",
      image: "/images/team/member1.jpg",
      github: "https://github.com/yourusername",
      linkedin: "https://linkedin.com/in/yourusername",
      email: "your.email@example.com"
    },
    {
      id: 2,
      name: "Team Member 2",
      role: "Firmware Developer",
      bio: "Expert in embedded systems and sensor integration. Developed the MPU6050 integration.",
      image: "/images/team/member2.jpg",
      github: "https://github.com/member2",
      linkedin: "https://linkedin.com/in/member2",
      email: "member2@example.com"
    },
    {
      id: 3,
      name: "Team Member 3",
      role: "Full Stack Developer",
      bio: "MERN stack specialist and UI/UX enthusiast. Built the web dashboard.",
      image: "/images/team/member3.jpg",
      github: "https://github.com/member3",
      linkedin: "https://linkedin.com/in/member3",
      email: "member3@example.com"
    }
  ];
  res.json(team);
});

// ============ Components Data ============
app.get('/api/components', (req, res) => {
  const components = [
    {
      id: 1,
      name: "ESP32 DevKit v1",
      description: "Dual-core microcontroller with WiFi and Bluetooth Low Energy",
      specifications: {
        "Processor": "Dual-core Xtensa 32-bit LX6",
        "Clock Speed": "240 MHz",
        "Flash Memory": "4 MB",
        "SRAM": "520 KB",
        "Connectivity": "WiFi 802.11 b/g/n + BLE 4.2",
        "GPIO Pins": "34 programmable",
        "Operating Voltage": "3.3V",
        "Input Voltage": "5V via USB",
        "Current Consumption": "80mA average"
      },
      image: "/images/components/esp32.jpg",
      datasheet: "https://www.espressif.com/sites/default/files/documentation/esp32_datasheet_en.pdf",
      pinout: {
        "I2C_SDA": "GPIO 21",
        "I2C_SCL": "GPIO 22",
        "Button_Left": "GPIO 18",
        "Button_Right": "GPIO 19",
        "Button_ScrollUp": "GPIO 14",
        "Button_ScrollDown": "GPIO 27"
      }
    },
    {
      id: 2,
      name: "MPU6050 Module",
      description: "6-axis Motion Tracking Device with Gyroscope and Accelerometer",
      specifications: {
        "Gyroscope Range": "±250, ±500, ±1000, ±2000°/sec",
        "Accelerometer Range": "±2g, ±4g, ±8g, ±16g",
        "Communication": "I2C (Address: 0x68)",
        "Operating Voltage": "3-5V DC",
        "Current Draw": "3.9mA normal operation",
        "Degrees of Freedom": "6-DOF",
        "ADC Resolution": "16-bit",
        "Sample Rate": "1kHz",
        "Temperature Sensor": "Built-in"
      },
      image: "/images/components/mpu6050.jpg",
      datasheet: "https://invensense.tdk.com/wp-content/uploads/2015/02/MPU-6000-Datasheet1.pdf",
      wiring: {
        "VCC": "3.3V from ESP32",
        "GND": "GND",
        "SDA": "GPIO 21",
        "SCL": "GPIO 22",
        "AD0": "GND (for I2C address 0x68)",
        "INT": "Not connected"
      }
    },
    {
      id: 3,
      name: "Tactile Push Buttons",
      description: "4x Momentary switches for mouse control",
      specifications: {
        "Type": "Tactile Momentary Push Button",
        "Quantity": "4 buttons",
        "Rating": "12V 50mA",
        "Life Cycle": "100,000 operations",
        "Operating Force": "250gf ±50gf",
        "Contact Resistance": "100mΩ max",
        "Debounce": "Software implemented"
      },
      functions: {
        "Button 1 (GPIO 18)": "Left Click",
        "Button 2 (GPIO 19)": "Right Click",
        "Button 3 (GPIO 14)": "Scroll Up",
        "Button 4 (GPIO 27)": "Scroll Down"
      },
      image: "/images/components/button.jpg",
      wiring: "One pin to GPIO, other to GND. Internal pull-up enabled."
    },
    {
      id: 4,
      name: "Power Supply",
      description: "USB power with voltage regulation",
      specifications: {
        "Input": "5V via Micro USB",
        "Voltage Regulator": "AMS1117-3.3",
        "Output": "3.3V regulated",
        "Current Capacity": "1A max",
        "Protection": "Over-current and thermal protection",
        "Battery Option": "3.7V LiPo with charging circuit",
        "Power Consumption": "~200mA average (BLE + WiFi + MPU6050)"
      },
      image: "/images/components/power.jpg"
    },
    {
      id: 5,
      name: "Connecting Wires",
      description: "Jumper wires for connections",
      specifications: {
        "Type": "Male-to-Female Dupont wires",
        "Length": "20cm",
        "Gauge": "26 AWG",
        "Quantity": "10 wires minimum",
        "Colors": "Multiple for easy identification"
      },
      image: "/images/components/wires.jpg"
    }
  ];
  res.json(components);
});

// ============ Project Info ============
app.get('/api/project', (req, res) => {
  res.json({
    name: "ESP32 BLE Mouse",
    version: "1.0.0",
    description: "Wireless motion-controlled mouse using ESP32 and MPU6050",
    features: [
      "Bluetooth Low Energy connectivity",
      "WiFi dashboard for real-time monitoring",
      "6-axis motion tracking",
      "Configurable sensitivity",
      "Live statistics tracking",
      "Web-based configuration"
    ],
    repository: "https://github.com/yourusername/esp32-ble-mouse",
    license: "MIT"
  });
});

// ============ 404 catch-all for unknown API routes ============
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

// ============ Global Express error handler ============
// FIX: catches async errors propagated via next(err) or thrown in middleware
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('[ERROR]', err.stack || err.message);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
  });
});

// ============ Start Server ============
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║                                        ║
║    ESP32 BLE Mouse Dashboard Server    ║
║                                        ║
╠════════════════════════════════════════╣
║                                        ║
║  ✓ Server running on port ${PORT}         ║
║  ✓ MongoDB: via db.js connectDB()      ║
║  ✓ CORS origin: ${process.env.CLIENT_ORIGIN || 'http://localhost:4000'}  ║
║  ✓ ESP32 IP: 10.210.199.68             ║
║                                        ║
║  Dashboard: http://localhost:4000      ║
║  API: http://localhost:${PORT}/api       ║
║                                        ║
╚════════════════════════════════════════╝
  `);
});