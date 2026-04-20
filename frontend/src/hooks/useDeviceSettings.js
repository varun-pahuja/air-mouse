import { useState, useEffect, useCallback } from "react";
import { getESP32Settings, updateESP32Settings } from "@/services/api";

export function useDeviceSettings() {
  const [sensitivity, setSensitivityState] = useState(50);
  const [isReady, setIsReady] = useState(false);

  // Fetch initial value from hardware
  useEffect(() => {
    let mounted = true;
    const fetchSettings = async () => {
      try {
        const response = await getESP32Settings();
        if (mounted && response && response.data) {
          // It might return { sensitivity: 50, ... }
          if (response.data.sensitivity !== undefined) {
             setSensitivityState(response.data.sensitivity);
          }
        }
      } catch (err) {
        console.warn("Could not fetch remote settings on load", err.message);
      } finally {
         if (mounted) setIsReady(true);
      }
    };
    fetchSettings();
    return () => { mounted = false; };
  }, []);

  // Update backend when UI changes
  const setSensitivity = useCallback((value) => {
    setSensitivityState(value);
    
    // Fire and forget update
    if (isReady) {
      updateESP32Settings({ sensitivity: value }).catch(err => {
         console.warn("Failed to push sensitivity to ESP32", err.message);
      });
    }
  }, [isReady]);

  return { sensitivity, setSensitivity, isReady };
}
