import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Activity, Webhook, MousePointerClick, ChevronRight, Radar, Zap } from "lucide-react";

// Reusable bar for a single axis value
function AxisBar({ label, value, max, color }) {
  const pct = Math.min(Math.abs(value) / max * 100, 100);
  const isNegative = value < 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-mono w-7 text-right" style={{ color }}>{label}</span>
      <div className="flex-1 h-4 bg-zinc-900 rounded-full overflow-hidden relative">
        {/* Center line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-zinc-700 z-10" />
        {/* Bar from center */}
        <div
          className="absolute top-0 bottom-0 rounded-full transition-all duration-150"
          style={{
            backgroundColor: color,
            width: `${pct / 2}%`,
            left: isNegative ? `${50 - pct / 2}%` : '50%',
            opacity: 0.85,
            boxShadow: `0 0 8px ${color}44`,
          }}
        />
      </div>
      <span className="text-xs font-mono w-16 text-right" style={{ color: "var(--text-secondary)" }}>
        {value?.toFixed(2) ?? "0.00"}
      </span>
    </div>
  );
}

export function TestingSection({ deviceData, gestures }) {
  const [logs, setLogs] = useState([]);
  const [lastFired, setLastFired] = useState(0);
  const [lastAction, setLastAction] = useState(null);

  useEffect(() => {
    if (!deviceData || gestures.length === 0) return;

    const now = Date.now();
    if (now - lastFired < 1000) return;

    const ax = Math.abs(deviceData.ax || 0);
    const ay = Math.abs(deviceData.ay || 0);
    const gx = Math.abs(deviceData.gx || 0);
    const gy = Math.abs(deviceData.gy || 0);

    let triggeredGesture = null;

    if (gx > 120 && gestures.length > 0) {
      triggeredGesture = gestures[0];
    } else if (gy > 120 && gestures.length > 1) {
      triggeredGesture = gestures[1];
    } else if (ax > 1.5 && gestures.length > 2) {
      triggeredGesture = gestures[2];
    } else if (ay > 1.5 && gestures.length > 3) {
      triggeredGesture = gestures[3];
    } else if ((gx > 60 || gy > 60) && gestures.length > 0) {
      triggeredGesture = gestures[Math.floor(Math.random() * gestures.length)];
    }

    if (triggeredGesture && triggeredGesture.action !== "None") {
      const newLog = {
        id: now,
        timestamp: new Date().toLocaleTimeString(),
        gesture: triggeredGesture.name,
        action: triggeredGesture.action,
      };

      setLogs((prev) => [newLog, ...prev].slice(0, 50));
      setLastFired(now);
      setLastAction(newLog);
      // Clear flash after 2s
      setTimeout(() => setLastAction(null), 2000);
    }
  }, [deviceData, gestures, lastFired]);

  const ax = deviceData?.ax ?? 0;
  const ay = deviceData?.ay ?? 0;
  const az = deviceData?.az ?? 0;
  const gx = deviceData?.gx ?? 0;
  const gy = deviceData?.gy ?? 0;
  const gz = deviceData?.gz ?? 0;
  const isConnected = deviceData && (ax !== 0 || ay !== 0 || gx !== 0 || gy !== 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="h-full flex flex-col"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2
          className="text-3xl font-bold"
          style={{ fontFamily: "Syne, sans-serif", color: "var(--text-primary)" }}
        >
          Simulation & Testing
        </h2>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${
            isConnected
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
              : "bg-red-500/10 text-red-400 border-red-500/20"
          }`}
        >
          {isConnected ? "● Live" : "○ Waiting for Data"}
        </span>
      </div>

      {/* Action Flash Banner */}
      <AnimatePresence>
        {lastAction && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="mb-4 p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 flex items-center gap-4"
          >
            <Zap size={24} className="text-emerald-400 animate-pulse" />
            <div>
              <span className="text-emerald-300 font-bold text-lg">{lastAction.action}</span>
              <span className="text-zinc-400 text-sm ml-3">triggered by <span className="text-indigo-400 font-semibold">{lastAction.gesture}</span></span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Row 1: Live Motion + Action Log */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Live Motion Panel */}
        <div className="card border border-white/5 bg-zinc-950/40">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2.5 bg-violet-500/20 rounded-xl text-violet-400">
              <Radar size={20} />
            </div>
            <div>
              <h3 className="font-bold text-white">Real-Time Motion Stream</h3>
              <p className="text-xs text-zinc-500">6-axis sensor data @ 50Hz</p>
            </div>
          </div>

          <div className="space-y-1.5 mb-5">
            <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-2">Accelerometer (g)</p>
            <AxisBar label="AX" value={ax} max={4} color="#818cf8" />
            <AxisBar label="AY" value={ay} max={4} color="#a78bfa" />
            <AxisBar label="AZ" value={az} max={4} color="#c084fc" />
          </div>

          <div className="space-y-1.5">
            <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-2">Gyroscope (°/s)</p>
            <AxisBar label="GX" value={gx} max={250} color="#34d399" />
            <AxisBar label="GY" value={gy} max={250} color="#2dd4bf" />
            <AxisBar label="GZ" value={gz} max={250} color="#22d3ee" />
          </div>

          {!isConnected && (
            <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">
              ⚠ No data — update the ESP32 IP in <strong>Settings</strong> to connect.
            </div>
          )}
        </div>

        {/* Action Activity Log */}
        <div className="card border border-white/5">
          <h3 className="font-bold text-lg text-white mb-4 flex items-center gap-2">
            <Webhook size={18} className="text-emerald-400" /> Action Activity Log
          </h3>
          <div className="bg-zinc-950/80 rounded-xl border border-white/5 h-[300px] overflow-y-auto font-mono text-sm shadow-inner p-4 custom-scrollbar">
            {logs.length === 0 ? (
              <div className="flex items-center justify-center h-full text-zinc-500 italic">
                Waiting for motion input to fire triggers...
              </div>
            ) : (
              <div className="space-y-3">
                {logs.map((log) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-3 p-3 rounded-lg bg-zinc-900/50 border border-white/5"
                  >
                    <span className="text-zinc-500 text-xs w-20">{log.timestamp}</span>
                    <span className="text-indigo-400 font-bold whitespace-nowrap">{log.gesture}</span>
                    <ChevronRight size={14} className="text-zinc-600" />
                    <span className="flex items-center gap-2 text-emerald-400 font-semibold bg-emerald-500/10 px-3 py-1 rounded-full">
                      <MousePointerClick size={14} />
                      {log.action}
                    </span>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Row 2: Info + Pending AI */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card lg:col-span-1 border border-white/5 bg-zinc-950/40 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent transition-opacity group-hover:opacity-100 opacity-50"></div>
          <div className="flex items-center gap-4 mb-4 relative">
            <div className="p-3 bg-indigo-500/20 rounded-xl text-indigo-400">
              <Activity size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">How It Works</h3>
              <p className="text-sm text-zinc-400">Heuristic Engine</p>
            </div>
          </div>
          <div className="text-zinc-300 text-sm leading-relaxed relative">
            Sharp flicks on the X axis trigger your 1st gesture, Y axis the 2nd. Heavy accelerometer spikes trigger the 3rd & 4th.
            <br /><br />
            When the Python AI model is trained, it will replace these heuristics with real neural network inference.
          </div>
        </div>

        <div className="card lg:col-span-2 border border-white/5 opacity-50 relative pointer-events-none">
          <div className="absolute inset-0 flex items-center justify-center z-10 flex-col gap-2">
            <span className="bg-zinc-900 px-4 py-2 rounded-full text-sm font-bold border border-zinc-700 text-zinc-400">
              Python AI Model Pipeline Pending
            </span>
          </div>
          <h3 className="font-bold text-lg text-white mb-4">Neural Network Confidence</h3>
          <div className="h-32 grid grid-cols-4 gap-4">
            <div className="bg-zinc-900 rounded-lg animate-pulse" style={{ animationDelay: "0ms" }}></div>
            <div className="bg-zinc-900 rounded-lg animate-pulse" style={{ animationDelay: "200ms" }}></div>
            <div className="bg-zinc-900 rounded-lg animate-pulse" style={{ animationDelay: "400ms" }}></div>
            <div className="bg-zinc-900 rounded-lg animate-pulse" style={{ animationDelay: "600ms" }}></div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
