import { motion } from "motion/react";
import { Trash2 } from "lucide-react";
import { GestureIcon } from "./GestureIcon";

export function GestureMappingTable({
  gestures,
  actionOptions,
  updateGestureAction,
  deleteGesture,
}) {
  return (
    <div className="card mb-6 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
              <th
                className="text-left py-4 px-5 text-sm uppercase tracking-wider"
                style={{
                  fontFamily: "Syne, sans-serif",
                  color: "var(--text-secondary)",
                  fontWeight: 600,
                }}
              >
                Gesture
              </th>
              <th
                className="text-left py-4 px-5 text-sm uppercase tracking-wider"
                style={{
                  fontFamily: "Syne, sans-serif",
                  color: "var(--text-secondary)",
                  fontWeight: 600,
                }}
              >
                Preview
              </th>
              <th
                className="text-left py-4 px-5 text-sm uppercase tracking-wider"
                style={{
                  fontFamily: "Syne, sans-serif",
                  color: "var(--text-secondary)",
                  fontWeight: 600,
                }}
              >
                Action
              </th>
              <th
                className="text-left py-4 px-5 text-sm uppercase tracking-wider"
                style={{
                  fontFamily: "Syne, sans-serif",
                  color: "var(--text-secondary)",
                  fontWeight: 600,
                }}
              >
                User
              </th>
              <th
                className="text-right py-4 px-5 text-sm uppercase tracking-wider"
                style={{
                  fontFamily: "Syne, sans-serif",
                  color: "var(--text-secondary)",
                  fontWeight: 600,
                }}
              >
                Manage
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
                  backgroundColor: "rgba(255,255,255,0.03)",
                  transition: { duration: 0.2 },
                }}
                style={{ borderBottom: "1px solid var(--border-color)" }}
              >
                <td
                  className="py-4 px-5 font-medium"
                  style={{ color: "var(--text-primary)", fontFamily: "Syne, sans-serif" }}
                >
                  {gesture.name}
                </td>
                <td className="py-4 px-5">
                  <GestureIcon gestureName={gesture.name} />
                </td>
                <td className="py-4 px-5">
                  <select
                    value={gesture.action}
                    onChange={(e) => updateGestureAction(idx, e.target.value)}
                    className="px-3 py-2 rounded-lg border text-sm font-medium outline-none transition-all focus:ring-2 focus:ring-indigo-500/50"
                    style={{
                      backgroundColor: "rgba(0,0,0,0.2)",
                      borderColor: "rgba(255,255,255,0.1)",
                      color: "var(--text-primary)",
                    }}
                  >
                    {actionOptions.map((action) => (
                      <option key={action} value={action} className="bg-zinc-900 text-white">
                        {action}
                      </option>
                    ))}
                  </select>
                </td>
                <td
                  className="py-4 px-5"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <span className="px-3 py-1 rounded-full bg-zinc-800 text-xs font-semibold uppercase tracking-wider text-zinc-300">
                    {gesture.user}
                  </span>
                </td>
                <td className="py-4 px-5 text-right">
                  <button
                    onClick={() => deleteGesture(idx)}
                    className="p-2 rounded-lg text-rose-500/70 hover:text-rose-400 hover:bg-rose-500/10 transition-all focus:scale-95"
                    title="Delete Gesture"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </motion.tr>
            ))}
            {gestures.length === 0 && (
              <tr>
                <td colSpan="5" className="py-12 text-center text-zinc-500 text-sm italic">
                  No gestures mapped. Create one below to get started!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
