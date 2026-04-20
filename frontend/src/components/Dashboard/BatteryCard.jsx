export function BatteryCard({ battery, charging }) {
  return (
    <div className="card">
      <div
        className="text-sm mb-2"
        style={{
          color: "var(--text-secondary)",
          fontFamily: "Syne, sans-serif",
        }}
      >
        Battery
      </div>
      <div
        className="text-3xl font-medium mb-2"
        style={{
          fontFamily: "DM Mono, monospace",
          color: "var(--text-primary)",
        }}
      >
        {Math.round(battery)}%
      </div>
      <div
        className="w-full h-2 rounded-full mb-2"
        style={{ backgroundColor: "var(--progress-bg)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-200"
          style={{
            width: `${battery}%`,
            backgroundColor: "var(--accent-primary)",
          }}
        ></div>
      </div>
      {charging && <span className="badge badge-info">Charging</span>}
      {battery < 20 && !charging && (
        <span className="badge badge-warning">Low Battery</span>
      )}
    </div>
  );
}
