export function LatencyCard({ latency }) {
  return (
    <div className="card">
      <div
        className="text-sm mb-2"
        style={{
          color: "var(--text-secondary)",
          fontFamily: "Syne, sans-serif",
        }}
      >
        Latency
      </div>
      <div
        className="text-3xl font-medium"
        style={{
          fontFamily: "DM Mono, monospace",
          color: "var(--text-primary)",
        }}
      >
        {latency}
        <span
          className="text-lg ml-1"
          style={{ color: "var(--text-secondary)" }}
        >
          ms
        </span>
      </div>
    </div>
  );
}
