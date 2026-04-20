export function DeviceSpecs() {
  return (
    <div className="card">
      <div
        className="font-bold mb-3"
        style={{ fontFamily: "Syne, sans-serif", color: "var(--text-primary)" }}
      >
        Device Specifications
      </div>
      <div
        className="text-sm space-y-1"
        style={{
          color: "var(--text-secondary)",
          fontFamily: "DM Mono, monospace",
        }}
      >
        <div>• Microcontroller: ESP32</div>
        <div>• IMU Sensor: MPU-6500</div>
        <div>• Battery: 2500mAh 3.7V Li-Ion</div>
        <div>• Boost Converter: XL6009E1</div>
        <div>• Charging: TP4056 Module</div>
        <div>• Buttons: 4x Tactile</div>
      </div>
    </div>
  );
}
