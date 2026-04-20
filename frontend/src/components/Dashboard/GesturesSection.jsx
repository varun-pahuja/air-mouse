import { motion } from "motion/react";
import { GestureMappingTable } from "./GestureMappingTable";
import { GestureTrainingMode } from "./GestureTrainingMode";

export function GesturesSection({
  gestures,
  actionOptions,
  isRecording,
  newGestureName,
  setNewGestureName,
  setIsRecording,
  updateGestureAction,
  saveNewGesture,
  cancelRecording,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h2
        initial={{ clipPath: "inset(0 100% 0 0)" }}
        animate={{ clipPath: "inset(0 0% 0 0)" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="text-3xl font-bold mb-6"
        style={{ fontFamily: "Syne, sans-serif", color: "var(--text-primary)" }}
      >
        Gesture Mapping
      </motion.h2>

      <motion.div
        initial={{ clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)" }}
        animate={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
        transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <GestureMappingTable
          gestures={gestures}
          actionOptions={actionOptions}
          updateGestureAction={updateGestureAction}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <GestureTrainingMode
          isRecording={isRecording}
          newGestureName={newGestureName}
          setNewGestureName={setNewGestureName}
          setIsRecording={setIsRecording}
          saveNewGesture={saveNewGesture}
          cancelRecording={cancelRecording}
        />
      </motion.div>
    </motion.div>
  );
}
