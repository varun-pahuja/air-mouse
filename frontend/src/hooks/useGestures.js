import { useState, useEffect } from "react";
import { getGestures, createGesture, updateGesture as updateGestureApi, deleteGesture as deleteGestureApi } from "../services/api";

export function useGestures(activeProfile) {
  const [gestures, setGestures] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [newGestureName, setNewGestureName] = useState("");

  const actionOptions = [
    "None",
    "Next Slide",
    "Previous Slide",
    "Scroll Up",
    "Scroll Down",
    "Left Click",
    "Right Click",
    "Double Click",
    "Volume Up",
    "Volume Down",
  ];

  useEffect(() => {
    if (activeProfile && activeProfile.id) {
      fetchGestures();
    }
  }, [activeProfile]);

  const fetchGestures = async () => {
    try {
      const { data } = await getGestures(activeProfile.id);
      const mapped = data.map(g => ({ ...g, id: g._id }));
      setGestures(mapped);
    } catch (err) {
      console.error("Failed to fetch gestures", err);
    }
  };

  const updateGestureAction = async (index, action) => {
    try {
      const gesture = gestures[index];
      const { data } = await updateGestureApi(gesture.id, { action });
      const updated = [...gestures];
      updated[index] = { ...data, id: data._id };
      setGestures(updated);
    } catch (err) {
      console.error("Failed to update gesture", err);
    }
  };

  const deleteGesture = async (index) => {
    try {
      const gesture = gestures[index];
      await deleteGestureApi(gesture.id);
      const updated = [...gestures];
      updated.splice(index, 1);
      setGestures(updated);
    } catch (err) {
      console.error("Failed to delete gesture", err);
    }
  };

  const saveNewGesture = async (selectedAction = "None") => {
    if (newGestureName && activeProfile) {
      try {
        const { data } = await createGesture({
          name: newGestureName,
          action: selectedAction,
          profileId: activeProfile.id,
          user: activeProfile.initial
        });
        setGestures([
          ...gestures,
          { ...data, id: data._id }
        ]);
        setNewGestureName("");
        setIsRecording(false);
      } catch (err) {
        console.error("Failed to save new gesture", err);
      }
    }
  };

  const cancelRecording = () => {
    setNewGestureName("");
    setIsRecording(false);
  };

  return {
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
  };
}
