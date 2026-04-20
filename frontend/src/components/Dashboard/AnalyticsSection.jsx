import { UsageChart } from "./UsageChart";
import { AccuracyChart } from "./AccuracyChart";

export function AnalyticsSection() {
  return (
    <div>
      <h2
        className="text-3xl font-bold mb-6"
        style={{ fontFamily: "Syne, sans-serif", color: "var(--text-primary)" }}
      >
        Analytics
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="card">
          <div
            className="text-sm mb-2"
            style={{
              color: "var(--text-secondary)",
              fontFamily: "Syne, sans-serif",
            }}
          >
            Accuracy
          </div>
          <div
            className="text-4xl font-bold"
            style={{ fontFamily: "DM Mono, monospace", color: "#488248" }}
          >
            96%
          </div>
        </div>
        <div className="card">
          <div
            className="text-sm mb-2"
            style={{
              color: "var(--text-secondary)",
              fontFamily: "Syne, sans-serif",
            }}
          >
            Error Rate
          </div>
          <div
            className="text-4xl font-bold"
            style={{ fontFamily: "DM Mono, monospace", color: "#8b6914" }}
          >
            4%
          </div>
        </div>
        <div className="card">
          <div
            className="text-sm mb-2"
            style={{
              color: "var(--text-secondary)",
              fontFamily: "Syne, sans-serif",
            }}
          >
            Total Gestures
          </div>
          <div
            className="text-4xl font-bold"
            style={{
              fontFamily: "DM Mono, monospace",
              color: "var(--text-primary)",
            }}
          >
            604
          </div>
        </div>
      </div>

      <UsageChart />
      <AccuracyChart />
    </div>
  );
}
