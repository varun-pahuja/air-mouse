import { useState } from "react";

export function useGestures(activeProfile) {
  const [gestures, setGestures] = useState([
    { name: "V Shape", action: "Next Slide", user: "A" },
    { name: "O Shape", action: "Previous Slide", user: "A" },
    { name: "Swipe Left", action: "Scroll Down", user: "A" },
    { name: "Swipe Right", action: "Scroll Up", user: "A" },
    { name: "Circle", action: "Left Click", user: "A" },
    { name: "Shake", action: "Right Click", user: "A" },
    { name: "Tilt Up", action: "Volume Up", user: "A" },
    { name: "Tilt Down", action: "Volume Down", user: "A" },
  ]);

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

  const updateGestureAction = (index, action) => {
    const updated = [...gestures];
    updated[index].action = action;
    setGestures(updated);
  };

  const saveNewGesture = () => {
    if (newGestureName) {
      setGestures([
        ...gestures,
        { name: newGestureName, action: "None", user: activeProfile.initial },
      ]);
      setNewGestureName("");
      setIsRecording(false);
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
    saveNewGesture,
    cancelRecording,
  };
}
