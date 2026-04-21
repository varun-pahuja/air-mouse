import { useState } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

export function GestureTrainingMode({
  isRecording,
  newGestureName,
  setNewGestureName,
  setIsRecording,
  saveNewGesture,
  cancelRecording,
  deviceData = {},
  actionOptions = [],
}) {
  const [selectedAction, setSelectedAction] = useState("None");

  const handleSave = () => {
    saveNewGesture(selectedAction);
    setSelectedAction("None");
  };

  const cancel = () => {
    cancelRecording();
    setSelectedAction("None");
  };

  const chartData = [
    { subject: 'AX', value: Math.min(200, Math.abs(deviceData.ax || 0) * 50) },
    { subject: 'AY', value: Math.min(200, Math.abs(deviceData.ay || 0) * 50) },
    { subject: 'AZ', value: Math.min(200, Math.abs(deviceData.az || 0) * 50) },
    { subject: 'GX', value: Math.min(200, Math.abs(deviceData.gx || 0) * 2) },
    { subject: 'GY', value: Math.min(200, Math.abs(deviceData.gy || 0) * 2) },
    { subject: 'GZ', value: Math.min(200, Math.abs(deviceData.gz || 0) * 2) },
  ];

  return (
    <div className="card w-full flex flex-col md:flex-row gap-8 items-center border border-white/5">
      <div className="flex-1 w-full relative">
        <div className="flex justify-between items-center mb-6">
          <div
            className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-zinc-100 to-zinc-400"
            style={{ fontFamily: "Syne, sans-serif" }}
          >
            AI Gesture Training
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs tracking-wider uppercase font-bold transition-colors duration-300 ${
              isRecording ? "bg-red-500/20 text-red-400 animate-pulse border border-red-500/30" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
            }`}
             style={{ fontFamily: "DM Mono, monospace" }}
          >
            {isRecording ? "🔴 Motion Tracking" : "🟢 Radar Active"}
          </span>
        </div>

        {isRecording ? (
          <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
            <div>
              <label className="text-xs tracking-wider uppercase font-semibold text-zinc-400 mb-1.5 block">Gesture Name</label>
              <input
                type="text"
                placeholder="e.g. Swirl, Flick Up, Zig-Zag"
                value={newGestureName}
                onChange={(e) => setNewGestureName(e.target.value)}
                autoFocus
                className="w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium placeholder:text-zinc-600"
                style={{
                  backgroundColor: "rgba(0,0,0,0.2)",
                  borderColor: "rgba(255,255,255,0.1)",
                  color: "white",
                }}
              />
            </div>
            
            <div>
              <label className="text-xs tracking-wider uppercase font-semibold text-zinc-400 mb-1.5 block">Trigger Action</label>
              <select
                value={selectedAction}
                onChange={(e) => setSelectedAction(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all appearance-none cursor-pointer font-medium"
                style={{
                  backgroundColor: "rgba(0,0,0,0.2)",
                  borderColor: "rgba(255,255,255,0.1)",
                  color: "white",
                }}
              >
                {actionOptions.map((opt) => (
                  <option key={opt} value={opt} className="bg-zinc-900 text-white">
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3 pt-4">
              <button onClick={handleSave} className="flex-1 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-indigo-500/25 shadow-lg text-white font-semibold tracking-wide px-5 py-3 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]">
                Save Pattern
              </button>
              <button onClick={cancel} className="bg-zinc-800/80 hover:bg-zinc-700 border border-zinc-700/50 text-zinc-300 font-medium px-6 py-3 rounded-xl transition-all hover:text-white">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="py-10 flex flex-col items-center justify-center space-y-6">
             <div className="text-zinc-400 text-center text-sm leading-relaxed max-w-[280px]">
               Move your Air Mouse to see the real-time spatial motion on the radar.
             </div>
             <button onClick={() => setIsRecording(true)} className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold tracking-wide px-8 py-3.5 rounded-full shadow-lg shadow-emerald-500/25 transition-all hover:scale-105 active:scale-95 flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="3"></circle></svg>
              Start Mapping
            </button>
          </div>
        )}
      </div>

      <div className="w-full md:w-1/2 h-[300px] bg-zinc-950/40 rounded-2xl flex items-center justify-center p-2 relative overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.05)" }}>
         {/* Decorative grid gradient */}
         <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent opacity-60"></div>
         
         <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="65%" data={chartData}>
            <PolarGrid stroke="rgba(255,255,255,0.08)" gridType="polygon" />
            <PolarAngleAxis 
              dataKey="subject" 
              tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 10, fontFamily: "DM Mono", fontWeight: 600 }} 
            />
            <PolarRadiusAxis domain={[0, 200]} tick={false} axisLine={false} />
            <Radar
              name="Motion"
              dataKey="value"
              stroke={isRecording ? "#ef4444" : "#8b5cf6"}
              strokeWidth={2}
              fill={isRecording ? "#ef4444" : "#8b5cf6"}
              fillOpacity={isRecording ? 0.4 : 0.25}
              isAnimationActive={false}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
