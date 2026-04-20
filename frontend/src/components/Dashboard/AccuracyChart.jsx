import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { accuracyData } from "@/data/analyticsData";

export function AccuracyChart() {
  return (
    <div className="card">
      <div
        className="text-lg font-bold mb-4"
        style={{ fontFamily: "Syne, sans-serif", color: "var(--text-primary)" }}
      >
        Accuracy Over Time
      </div>
      <div style={{ height: "250px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={accuracyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
            <XAxis
              dataKey="day"
              stroke="var(--text-secondary)"
              style={{ fontSize: "11px", fontFamily: "DM Mono, monospace" }}
            />
            <YAxis
              stroke="var(--text-secondary)"
              style={{ fontSize: "11px", fontFamily: "DM Mono, monospace" }}
              domain={[90, 100]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--card-bg)",
                border: "1px solid var(--border-color)",
                borderRadius: "8px",
                fontFamily: "DM Mono, monospace",
                fontSize: "12px",
              }}
            />
            <Line
              type="monotone"
              dataKey="accuracy"
              stroke="#9a3f3f"
              strokeWidth={3}
              dot={{ fill: "#9a3f3f", r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
