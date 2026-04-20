import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { usageData } from "@/data/analyticsData";

export function UsageChart() {
  return (
    <div className="card mb-6">
      <div
        className="text-lg font-bold mb-4"
        style={{ fontFamily: "Syne, sans-serif", color: "var(--text-primary)" }}
      >
        Most Used Gestures
      </div>
      <div style={{ height: "300px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={usageData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
            <XAxis
              type="number"
              stroke="var(--text-secondary)"
              style={{ fontSize: "11px", fontFamily: "DM Mono, monospace" }}
            />
            <YAxis
              dataKey="gesture"
              type="category"
              stroke="var(--text-secondary)"
              style={{ fontSize: "11px", fontFamily: "Syne, sans-serif" }}
              width={100}
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
            <Bar dataKey="count" fill="#9a3f3f" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
