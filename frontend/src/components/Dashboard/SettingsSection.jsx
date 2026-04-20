import { DarkModeToggle } from "./DarkModeToggle";
import { SensitivityControl } from "./SensitivityControl";
import { DeviceActions } from "./DeviceActions";
import { DeviceSpecs } from "./DeviceSpecs";

export function SettingsSection({
  darkMode,
  setDarkMode,
  sensitivity,
  setSensitivity,
  profiles,
  gestures,
  activeMode,
}) {
  return (
    <div>
      <h2
        className="text-3xl font-bold mb-6"
        style={{ fontFamily: "Syne, sans-serif", color: "var(--text-primary)" }}
      >
        Settings
      </h2>

      <div className="space-y-4">
        <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
        <SensitivityControl
          sensitivity={sensitivity}
          setSensitivity={setSensitivity}
        />
        <DeviceActions
          profiles={profiles}
          gestures={gestures}
          sensitivity={sensitivity}
          activeMode={activeMode}
        />
        <DeviceSpecs />
      </div>
    </div>
  );
}
