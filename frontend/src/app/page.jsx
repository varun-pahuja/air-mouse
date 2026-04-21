"use client";

import { useState } from "react";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useDeviceSettings } from "@/hooks/useDeviceSettings";
import { useProfiles } from "@/hooks/useProfiles";
import { useGestures } from "@/hooks/useGestures";
import { useTheme } from "@/hooks/useTheme";
import { Sidebar } from "@/components/Dashboard/Sidebar";
import { MobileNav } from "@/components/Dashboard/MobileNav";
import { DashboardSection } from "@/components/Dashboard/DashboardSection";
import { GesturesSection } from "@/components/Dashboard/GesturesSection";
import { ProfilesSection } from "@/components/Dashboard/ProfilesSection";
import { AnalyticsSection } from "@/components/Dashboard/AnalyticsSection";
import { SettingsSection } from "@/components/Dashboard/SettingsSection";
import { TestingSection } from "@/components/Dashboard/TestingSection";
import { GlobalStyles } from "@/components/Dashboard/GlobalStyles";

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [activeMode, setActiveMode] = useState("Mouse Mode");
  const { sensitivity, setSensitivity } = useDeviceSettings();

  const { deviceData, sensorHistory } = useDashboardData();
  const {
    profiles,
    activeProfile,
    editingProfile,
    setEditingProfile,
    addProfile,
    switchProfile,
    updateProfile,
    deleteProfile,
  } = useProfiles();
  const {
    gestures,
    isRecording,
    newGestureName,
    actionOptions,
    setIsRecording,
    setNewGestureName,
    updateGestureAction,
    deleteGesture,
    saveNewGesture,
    cancelRecording,
  } = useGestures(activeProfile);
  const { darkMode, setDarkMode } = useTheme();

  return (
    <>
      <GlobalStyles />

      <div
        className="flex h-screen overflow-hidden"
        style={{
          backgroundColor: "var(--bg-primary)",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <Sidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />
        <MobileNav
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />

        <main
          className="flex-1 overflow-y-auto pb-20 md:pb-0"
          style={{ backgroundColor: "var(--bg-primary)" }}
        >
          <div className="p-6 md:p-8 max-w-7xl mx-auto">
            {activeSection === "dashboard" && (
              <DashboardSection
                deviceData={deviceData}
                sensorHistory={sensorHistory}
                activeProfile={activeProfile}
                activeMode={activeMode}
                setActiveMode={setActiveMode}
              />
            )}

            {activeSection === "gestures" && (
              <GesturesSection
                gestures={gestures}
                actionOptions={actionOptions}
                isRecording={isRecording}
                newGestureName={newGestureName}
                setNewGestureName={setNewGestureName}
                setIsRecording={setIsRecording}
                updateGestureAction={updateGestureAction}
                deleteGesture={deleteGesture}
                saveNewGesture={saveNewGesture}
                cancelRecording={cancelRecording}
                deviceData={deviceData}
              />
            )}

            {activeSection === "profiles" && (
              <ProfilesSection
                profiles={profiles}
                editingProfile={editingProfile}
                setEditingProfile={setEditingProfile}
                addProfile={addProfile}
                switchProfile={switchProfile}
                updateProfile={updateProfile}
                deleteProfile={deleteProfile}
              />
            )}

            {activeSection === "analytics" && <AnalyticsSection />}

            {activeSection === "testing" && (
              <TestingSection deviceData={deviceData} gestures={gestures} />
            )}

            {activeSection === "settings" && (
              <SettingsSection
                darkMode={darkMode}
                setDarkMode={setDarkMode}
                sensitivity={sensitivity}
                setSensitivity={setSensitivity}
                profiles={profiles}
                gestures={gestures}
                activeMode={activeMode}
              />
            )}
          </div>
        </main>
      </div>
    </>
  );
}
