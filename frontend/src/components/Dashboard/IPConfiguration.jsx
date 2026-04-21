import { useState, useEffect } from "react";
import { updateESP32IP, getESP32Status } from "../../services/api";

export function IPConfiguration() {
  const [ip, setIp] = useState("");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    // Fetch the current IP from the backend on load
    getESP32Status()
      .then(res => {
        if (res.data.ip) {
           setIp(res.data.ip.replace('http://', ''));
        }
      })
      .catch(console.error);
  }, []);

  const handleSave = async () => {
    if (!ip) return;
    setSaving(true);
    setStatus("saving");
    try {
      await updateESP32IP(ip);
      setStatus("success");
      setTimeout(() => setStatus(null), 3000);
    } catch (error) {
      console.error(error);
      setStatus("error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="card w-full mt-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3
            className="text-lg font-bold mb-1"
            style={{ fontFamily: "Syne, sans-serif", color: "var(--text-primary)" }}
          >
            ESP32 Network Address
          </h3>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Update the IP address if your router assigned a new one. Enter IP printed in Arduino IDE Serial Monitor.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <input
            type="text"
            placeholder="e.g. 10.210.199.68"
            value={ip}
            onChange={(e) => setIp(e.target.value)}
            className="px-4 py-2 rounded-lg border outline-none font-medium flex-1 md:w-48 appearance-none"
            style={{
              backgroundColor: "var(--bg-primary)",
              borderColor: "var(--border-color)",
              color: "var(--text-primary)",
            }}
          />
          <button
            onClick={handleSave}
            disabled={saving || !ip}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-5 py-2 rounded-lg transition-colors whitespace-nowrap disabled:opacity-50"
          >
            {saving ? "Updating..." : "Update IP"}
          </button>
        </div>
      </div>
      {status === 'success' && (
        <div className="mt-3 text-sm text-emerald-500 font-medium">✓ Connect address successfully updated to {ip}!</div>
      )}
      {status === 'error' && (
        <div className="mt-3 text-sm text-red-500 font-medium">✕ Failed to update network address.</div>
      )}
    </div>
  );
}
