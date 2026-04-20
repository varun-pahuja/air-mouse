import { motion } from "motion/react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function LiveGestureMonitor({ deviceData, sensorHistory }) {
  const sensors = [
    { label: "ax", value: deviceData.ax },
    { label: "ay", value: deviceData.ay },
    { label: "az", value: deviceData.az },
    { label: "gx", value: deviceData.gx },
    { label: "gy", value: deviceData.gy },
    { label: "gz", value: deviceData.gz },
  ];

  return (
    <div className="card">
      <div
        className="text-sm mb-4"
        style={{
          color: "var(--text-secondary)",
          fontFamily: "Syne, sans-serif",
        }}
      >
        Live Gesture Monitor
      </div>
      <div
        className="text-center mb-6 relative overflow-hidden"
        style={{ perspective: "1000px" }}
      >
        <motion.div
          key={deviceData.gesture}
          initial={{ scale: 0.8, opacity: 0, rotateX: -90 }}
          animate={{ scale: 1, opacity: 1, rotateX: 0 }}
          exit={{ scale: 1.2, opacity: 0, rotateX: 90 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-5xl font-bold mb-4"
          style={{
            fontFamily: "Syne, sans-serif",
            color: "var(--accent-primary)",
          }}
        >
          {deviceData.gesture}
        </motion.div>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-6">
        {sensors.map((sensor, idx) => (
          <motion.div
            key={sensor.label}
            initial={{ clipPath: "circle(0% at 50% 50%)", opacity: 0 }}
            animate={{ clipPath: "circle(100% at 50% 50%)", opacity: 1 }}
            transition={{
              duration: 0.5,
              delay: 0.5 + idx * 0.05,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="sensor-chip"
          >
            <div
              className="text-xs mb-1"
              style={{ color: "var(--text-secondary)" }}
            >
              {sensor.label}
            </div>
            <div
              className="text-lg font-medium"
              style={{
                fontFamily: "DM Mono, monospace",
                color: "var(--text-primary)",
              }}
            >
              {sensor.value.toFixed(2)}
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        style={{ height: "200px" }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sensorHistory}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
            <XAxis dataKey="time" hide />
            <YAxis
              stroke="var(--text-secondary)"
              style={{ fontSize: "11px", fontFamily: "DM Mono, monospace" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--card-bg)",
                border: "1px solid var(--border-color)",
                borderRadius: "8px",
                fontFamily: "DM Mono, monospace",
                fontSize: "12px",
              }}
              labelStyle={{ color: "var(--text-secondary)" }}
            />
            <Line
              type="monotone"
              dataKey="ax"
              stroke="#9a3f3f"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="ay"
              stroke="#c1856d"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="az"
              stroke="#8b6914"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="gx"
              stroke="#b8860b"
              strokeWidth={1.5}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="gy"
              stroke="#cd853f"
              strokeWidth={1.5}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="gz"
              stroke="#6b5555"
              strokeWidth={1.5}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}
