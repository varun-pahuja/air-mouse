import { useState, useEffect } from "react";
import { getProfiles, createProfile, updateProfile as updateProfileApi, deleteProfile as deleteProfileApi, switchProfile as switchProfileApi } from "../services/api";

export function useProfiles() {
  const [profiles, setProfiles] = useState([]);
  const [editingProfile, setEditingProfile] = useState(null);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const { data } = await getProfiles();
      // Map _id to id for UI consistency
      const mapped = data.map(p => ({ ...p, id: p._id }));
      setProfiles(mapped);
    } catch (err) {
      console.error("Failed to fetch profiles", err);
    }
  };

  const activeProfile = profiles.find((p) => p.active) || profiles[0] || null;

  const addProfile = async () => {
    try {
      const newName = `User ${String.fromCharCode(65 + profiles.length)}`;
      const { data } = await createProfile({
        name: newName,
        initial: String.fromCharCode(65 + profiles.length),
        sensitivity: 50,
        active: false,
        color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      });
      setProfiles([...profiles, { ...data, id: data._id }]);
    } catch (err) {
      console.error("Failed to add profile", err);
    }
  };

  const switchProfile = async (profileId) => {
    try {
      await switchProfileApi(profileId);
      // locally optimize
      setProfiles(profiles.map((p) => ({ ...p, active: p.id === profileId })));
    } catch (err) {
      console.error("Failed to switch profile", err);
    }
  };

  const updateProfile = async (updatedProfile) => {
    try {
      const { data } = await updateProfileApi(updatedProfile.id, updatedProfile);
      setProfiles(
        profiles.map((p) => (p.id === updatedProfile.id ? { ...data, id: data._id } : p)),
      );
      setEditingProfile(null);
    } catch (err) {
      console.error("Failed to update profile", err);
    }
  };

  const deleteProfile = async (profileId) => {
    if (profiles.length > 1) {
      try {
        await deleteProfileApi(profileId);
        await fetchProfiles(); // re-fetch to ensure active status fallback works
      } catch (err) {
        console.error("Failed to delete profile", err);
      }
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
