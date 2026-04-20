import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { ConnectionCard } from "./ConnectionCard";
import { LatencyCard } from "./LatencyCard";
import { BatteryCard } from "./BatteryCard";
import { ActiveProfileCard } from "./ActiveProfileCard";
import { LiveGestureMonitor } from "./LiveGestureMonitor";
import { OperatingModeCard } from "./OperatingModeCard";

export function DashboardSection({
  deviceData,
  sensorHistory,
  activeProfile,
  activeMode,
  setActiveMode,
}) {
  const scrollRef = useRef(null);

  // Parallax scroll effects
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const y1 = useTransform(smoothProgress, [0, 1], [0, -50]);
  const y2 = useTransform(smoothProgress, [0, 1], [0, -100]);
  const y3 = useTransform(smoothProgress, [0, 1], [0, -150]);
  const opacity = useTransform(smoothProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(smoothProgress, [0, 0.5], [1, 0.95]);

  return (
    <div ref={scrollRef}>
      {/* Parallax Header with Mask Reveal */}
      <motion.div
        style={{ y: y1, opacity, scale }}
        className="mb-8 overflow-hidden"
      >
        <motion.h2
          initial={{ clipPath: "inset(0 100% 0 0)" }}
          animate={{ clipPath: "inset(0 0% 0 0)" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-3xl font-bold mb-2"
          style={{
            fontFamily: "Syne, sans-serif",
            color: "var(--text-primary)",
          }}
        >
          Dashboard
        </motion.h2>
        <motion.div
          initial={{ clipPath: "inset(0 100% 0 0)" }}
          animate={{ clipPath: "inset(0 0% 0 0)" }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="text-sm"
          style={{ color: "var(--text-secondary)" }}
        >
          Real-time device monitoring and control
        </motion.div>
      </motion.div>

      {/* Top Metrics with Staggered Mask Reveal */}
      <motion.div
        style={{ y: y2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
      >
        <motion.div
          initial={{ clipPath: "inset(0 0 100% 0)", opacity: 0 }}
          animate={{ clipPath: "inset(0 0 0% 0)", opacity: 1 }}
          transition={{ duration: 0.6, delay: 0, ease: [0.22, 1, 0.36, 1] }}
        >
          <ConnectionCard deviceData={deviceData} />
        </motion.div>
        <motion.div
          initial={{ clipPath: "inset(0 0 100% 0)", opacity: 0 }}
          animate={{ clipPath: "inset(0 0 0% 0)", opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <LatencyCard latency={deviceData.latency} />
        </motion.div>
        <motion.div
          initial={{ clipPath: "inset(0 0 100% 0)", opacity: 0 }}
          animate={{ clipPath: "inset(0 0 0% 0)", opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <BatteryCard
            battery={deviceData.battery}
            charging={deviceData.charging}
          />
        </motion.div>
        <motion.div
          initial={{ clipPath: "inset(0 0 100% 0)", opacity: 0 }}
          animate={{ clipPath: "inset(0 0 0% 0)", opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <ActiveProfileCard profile={activeProfile} />
        </motion.div>
      </motion.div>

      {/* Live Gesture Monitor with Parallax */}
      <motion.div
        style={{ y: y3 }}
        initial={{ clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)" }}
        animate={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
        transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="mb-6"
      >
        <LiveGestureMonitor
          deviceData={deviceData}
          sensorHistory={sensorHistory}
        />
      </motion.div>

      {/* Mode Switcher with Slide-in Reveal */}
      <motion.div
        initial={{ clipPath: "inset(0 100% 0 0)" }}
        animate={{ clipPath: "inset(0 0% 0 0)" }}
        transition={{ duration: 0.7, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <OperatingModeCard
          activeMode={activeMode}
          setActiveMode={setActiveMode}
        />
      </motion.div>
    </div>
  );
}
