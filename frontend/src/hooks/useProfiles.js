import { useState } from "react";

export function useProfiles() {
  const [profiles, setProfiles] = useState([
    {
      id: 1,
      name: "User A",
      initial: "A",
      sensitivity: 75,
      active: true,
      gestureCount: 12,
      color: "#9a3f3f",
    },
    {
      id: 2,
      name: "User B",
      initial: "B",
      sensitivity: 60,
      active: false,
      gestureCount: 8,
      color: "#c1856d",
    },
    {
      id: 3,
      name: "User C",
      initial: "C",
      sensitivity: 50,
      active: false,
      gestureCount: 15,
      color: "#8b6914",
    },
  ]);

  const [editingProfile, setEditingProfile] = useState(null);

  const activeProfile = profiles.find((p) => p.active) || profiles[0];

  const addProfile = () => {
    const newProfile = {
      id: profiles.length + 1,
      name: `User ${String.fromCharCode(65 + profiles.length)}`,
      initial: String.fromCharCode(65 + profiles.length),
      sensitivity: 50,
      active: false,
      gestureCount: 0,
      color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
    };
    setProfiles([...profiles, newProfile]);
  };

  const switchProfile = (profileId) => {
    setProfiles(profiles.map((p) => ({ ...p, active: p.id === profileId })));
  };

  const updateProfile = (updatedProfile) => {
    setProfiles(
      profiles.map((p) => (p.id === updatedProfile.id ? updatedProfile : p)),
    );
    setEditingProfile(null);
  };

  const deleteProfile = (profileId) => {
    if (profiles.length > 1) {
      setProfiles(profiles.filter((p) => p.id !== profileId));
    }
  };

  return {
    profiles,
    activeProfile,
    editingProfile,
    setEditingProfile,
    addProfile,
    switchProfile,
    updateProfile,
    deleteProfile,
  };
}
