import { useState, useEffect } from "react";

const GESTURES = ["V", "O", "Swipe", "Circle", "Shake", "Idle"];

export default function useDeviceData() {
  const [data, setData] = useState({
    gesture: "Idle",
    user: "A",
    battery: 82,
    charging: false,
    ax: 0,
    ay: 0,
    az: 1,
    gx: 0,
    gy: 0,
    gz: 0,
    latency: 12,
    connected: true,
  });

  const [history, setHistory] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => {
        const ax = (Math.random() * 0.4 - 0.2).toFixed(2);
        const ay = (Math.random() * 0.4 - 0.2).toFixed(2);
        const az = (0.9 + Math.random() * 0.2).toFixed(2);
        const gx = (Math.random() * 2 - 1).toFixed(2);
        const gy = (Math.random() * 2 - 1).toFixed(2);
        const gz = (Math.random() * 2 - 1).toFixed(2);

        // Randomly trigger a gesture every ~5 seconds
        const triggerGesture = Math.random() > 0.95;
        const gesture = triggerGesture
          ? GESTURES[Math.floor(Math.random() * (GESTURES.length - 1))]
          : "Idle";

        const newData = {
          ...prev,
          ax: parseFloat(ax),
          ay: parseFloat(ay),
          az: parseFloat(az),
          gx: parseFloat(gx),
          gy: parseFloat(gy),
          gz: parseFloat(gz),
          gesture,
          battery: prev.charging
            ? Math.min(100, prev.battery + 0.1)
            : Math.max(0, prev.battery - 0.01),
          latency: Math.floor(Math.random() * 10) + 10,
        };

        setHistory((h) => {
          const newH = [
            ...h,
            {
              time: new Date().toLocaleTimeString(),
              ax: newData.ax,
              gx: newData.gx,
            },
          ];
          return newH.slice(-20);
        });

        return newData;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return { data, history };
}
