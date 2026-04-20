import { motion } from "motion/react";
import { GestureIcon } from "./GestureIcon";

export function GestureMappingTable({
  gestures,
  actionOptions,
  updateGestureAction,
}) {
  return (
    <div className="card mb-6">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
              <th
                className="text-left py-3 px-4 text-sm"
                style={{
                  fontFamily: "Syne, sans-serif",
                  color: "var(--text-secondary)",
                  fontWeight: 600,
                }}
              >
                Gesture
              </th>
              <th
                className="text-left py-3 px-4 text-sm"
                style={{
                  fontFamily: "Syne, sans-serif",
                  color: "var(--text-secondary)",
                  fontWeight: 600,
                }}
              >
                Preview
              </th>
              <th
                className="text-left py-3 px-4 text-sm"
                style={{
                  fontFamily: "Syne, sans-serif",
                  color: "var(--text-secondary)",
                  fontWeight: 600,
                }}
              >
                Action
              </th>
              <th
                className="text-left py-3 px-4 text-sm"
                style={{
                  fontFamily: "Syne, sans-serif",
                  color: "var(--text-secondary)",
                  fontWeight: 600,
                }}
              >
                User
              </th>
            </tr>
          </thead>
          <tbody>
            {gestures.map((gesture, idx) => (
              <motion.tr
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                whileHover={{
                  backgroundColor: "var(--nav-active-bg)",
                  transition: { duration: 0.2 },
                }}
                style={{ borderBottom: "1px solid var(--border-color)" }}
              >
                <td
                  className="py-3 px-4"
                  style={{ color: "var(--text-primary)" }}
                >
                  {gesture.name}
                </td>
                <td className="py-3 px-4">
                  <GestureIcon gestureName={gesture.name} />
                </td>
                <td className="py-3 px-4">
                  <select
                    value={gesture.action}
                    onChange={(e) => updateGestureAction(idx, e.target.value)}
                    className="px-3 py-1.5 rounded-lg border text-sm"
                    style={{
                      backgroundColor: "var(--card-bg)",
                      borderColor: "var(--border-color)",
                      color: "var(--text-primary)",
                    }}
                  >
                    {actionOptions.map((action) => (
                      <option key={action} value={action}>
                        {action}
                      </option>
                    ))}
                  </select>
                </td>
                <td
                  className="py-3 px-4"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {gesture.user}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
