export function SensitivityControl({ sensitivity, setSensitivity }) {
  return (
    <div className="card">
      <div
        className="font-bold mb-3"
        style={{ fontFamily: "Syne, sans-serif", color: "var(--text-primary)" }}
      >
        Global Sensitivity: {sensitivity}
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={sensitivity}
        onChange={(e) => setSensitivity(parseInt(e.target.value))}
        className="w-full"
      />
    </div>
  );
}
