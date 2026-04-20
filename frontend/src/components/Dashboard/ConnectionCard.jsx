export function ConnectionCard({ deviceData }) {
  return (
    <div className="card">
      <div
        className="text-sm mb-2"
        style={{
          color: "var(--text-secondary)",
          fontFamily: "Syne, sans-serif",
        }}
      >
        Connection
      </div>
      <div className="flex items-center gap-2 mb-3">
        <span
          className={`badge ${deviceData.connected ? "badge-success" : "badge-error"}`}
        >
          {deviceData.connected ? "Connected" : "Disconnected"}
        </span>
      </div>
      <div
        className="flex items-center gap-3 text-xs"
        style={{ color: "var(--text-secondary)" }}
      >
        <div className="flex items-center gap-1">
          <span
            className={`w-2 h-2 rounded-full ${deviceData.bluetooth ? "bg-[#10b981]" : "bg-[#6b7280]"}`}
          ></span>
          Bluetooth
        </div>
        <div className="flex items-center gap-1">
          <span
            className={`w-2 h-2 rounded-full ${deviceData.wifi ? "bg-[#10b981]" : "bg-[#6b7280]"}`}
          ></span>
          WiFi
        </div>
      </div>
      <div className="text-xs mt-2" style={{ color: "var(--text-secondary)" }}>
        ESP32-AirMouse
      </div>
    </div>
  );
}
