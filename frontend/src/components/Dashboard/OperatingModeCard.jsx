import { motion } from "motion/react";

export function OperatingModeCard({ activeMode, setActiveMode }) {
  const modes = ["Presentation Mode", "Mouse Mode", "Gaming Mode"];

  return (
    <div className="card">
      <div
        className="text-sm mb-3"
        style={{
          color: "var(--text-secondary)",
          fontFamily: "Syne, sans-serif",
        }}
      >
        Operating Mode
      </div>
      <div className="flex flex-wrap gap-3">
        {modes.map((mode, idx) => (
          <motion.button
            key={mode}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 1 + idx * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveMode(mode)}
            className="px-4 py-2 rounded-lg border transition-all duration-200"
            style={{
              fontFamily: "Syne, sans-serif",
              fontSize: "14px",
              backgroundColor:
                activeMode === mode ? "var(--accent-primary)" : "transparent",
              color:
                activeMode === mode ? "var(--card-bg)" : "var(--text-primary)",
              borderColor:
                activeMode === mode
                  ? "var(--accent-primary)"
                  : "var(--border-color)",
            }}
          >
            {mode}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
