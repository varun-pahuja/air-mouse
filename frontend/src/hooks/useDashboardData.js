import { useState, useEffect } from "react";
import api, { getESP32Stats, getESP32Status } from "../services/api";

export function useDashboardData() {
  const [deviceData, setDeviceData] = useState({
    gesture: "V",
    user: "A",
    battery: 82,
    charging: false,
    ax: 0,
    ay: 0,
    az: 0,
    gx: 0,
    gy: 0,
    gz: 0,
    latency: 0,
    connected: false,
    bluetooth: false,
    wifi: false,
  });

  const [sensorHistory, setSensorHistory] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const [statsResponse, statusResponse] = await Promise.all([
          getESP32Stats().catch(() => ({ data: {} })),
          getESP32Status().catch(() => ({ data: { connected: false } }))
        ]);

        if (!isMounted) return;

        const stats = statsResponse.data || {};
        const status = statusResponse.data || {};

        setDeviceData((prev) => ({
          ...prev,
          ...stats,
          connected: status.connected || false,
          bluetooth: status.ble || false,
          wifi: status.connected ? true : false,
          ax: stats.ax || prev.ax,
          ay: stats.ay || prev.ay,
          az: stats.az || prev.az,
          gx: stats.gx || prev.gx,
          gy: stats.gy || prev.gy,
          gz: stats.gz || prev.gz,
          gesture: stats.lastGesture || prev.gesture,
          battery: stats.batteryLevel || prev.battery,
        }));

        setSensorHistory((prev) => {
          const newPoint = {
            time: Date.now(),
            ax: stats.ax || 0,
            ay: stats.ay || 0,
            az: stats.az || 0,
            gx: stats.gx || 0,
            gy: stats.gy || 0,
            gz: stats.gz || 0,
          };
          return [...prev.slice(-29), newPoint];
        });
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      }
    };

    const interval = setInterval(fetchData, 500);
    fetchData(); // initial fetch

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return { deviceData, sensorHistory };
}
