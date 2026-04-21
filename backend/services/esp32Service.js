const axios = require('axios');
const fs = require('fs');
const path = require('path');

const ipFilePath = path.join(__dirname, '../esp32_ip.txt');
let ESP32_IP = 'http://10.210.199.68'; // Fallback

try {
  if (fs.existsSync(ipFilePath)) {
    ESP32_IP = fs.readFileSync(ipFilePath, 'utf8').trim();
  }
} catch (e) {}

class ESP32Service {
  constructor() {
    this.baseURL = ESP32_IP;
    this.connected = false;
  }

  setBaseURL(ip) {
    if (!ip.startsWith('http')) ip = `http://${ip}`;
    this.baseURL = ip;
    try {
      fs.writeFileSync(ipFilePath, ip, 'utf8');
    } catch (e) {
      console.error("Failed to save IP to file:", e.message);
    }
  }

  // Check if ESP32 is reachable
  async checkConnection() {
    try {
      const response = await axios.get(`${this.baseURL}/status`, { timeout: 5000 });
      this.connected = true;
      return response.data;
    } catch (error) {
      console.error("ESP32 Connection Error:", error.message);
      this.connected = false;
      return null;
    }
  }

  // Get current settings from ESP32
  async getSettings() {
    try {
      const response = await axios.get(`${this.baseURL}/settings`, { timeout: 5000 });
      const espData = response.data;
      
      return {
        sensitivity: Math.round((espData.sens || 0.6) / 0.012),
        threshold: espData.th || 0.04,
        invertX: espData.invX || false,
        invertY: espData.invY || false
      };
    } catch (error) {
      throw new Error('Cannot connect to ESP32');
    }
  }

  // Update settings on ESP32
  async updateSettings(settings) {
    try {
      // Map standard frontend fields config payload to short ESP32 variables
      const payload = {
        sens: settings.sensitivity !== undefined ? (settings.sensitivity * 0.012).toFixed(3) : 0.6,
        th: settings.threshold !== undefined ? settings.threshold : 0.04,
        invX: settings.invertX !== undefined ? settings.invertX : false,
        invY: settings.invertY !== undefined ? settings.invertY : false
      };

      const response = await axios.post(`${this.baseURL}/settings`, payload, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 5000
      });
      return response.data;
    } catch (error) {
      throw new Error('Cannot update ESP32 settings');
    }
  }

  // Get statistics from ESP32
  async getStats() {
    try {
      const [statsRes, motionRes] = await Promise.all([
        axios.get(`${this.baseURL}/stats`, { timeout: 5000 }).catch(() => ({ data: {} })),
        axios.get(`${this.baseURL}/motion`, { timeout: 5000 }).catch(() => ({ data: {} }))
      ]);
      return { ...statsRes.data, ...motionRes.data };
    } catch (error) {
      throw new Error('Cannot get ESP32 stats');
    }
  }

  // Reset statistics
  async resetStats() {
    try {
      const response = await axios.post(`${this.baseURL}/stats/reset`, {}, { timeout: 5000 });
      return response.data;
    } catch (error) {
      throw new Error('Cannot reset ESP32 stats');
    }
  }

  // Get device info
  async getDeviceInfo() {
    try {
      const response = await axios.get(`${this.baseURL}/info`, { timeout: 5000 });
      return response.data;
    } catch (error) {
      throw new Error('Cannot get ESP32 info');
    }
  }
}

module.exports = new ESP32Service();