export function GestureTrainingMode({
  isRecording,
  newGestureName,
  setNewGestureName,
  setIsRecording,
  saveNewGesture,
  cancelRecording,
}) {
  return (
    <div className="card">
      <div
        className="text-lg font-bold mb-4"
        style={{ fontFamily: "Syne, sans-serif", color: "var(--text-primary)" }}
      >
        Gesture Training Mode
      </div>
      <div className="flex items-center gap-4 mb-4">
        <span
          className={`px-3 py-1 rounded-full text-sm ${isRecording ? "recording-badge" : "idle-badge"}`}
          style={{ fontFamily: "DM Mono, monospace" }}
        >
          {isRecording ? "Recording" : "Idle"}
        </span>
      </div>
      {isRecording ? (
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Gesture name..."
            value={newGestureName}
            onChange={(e) => setNewGestureName(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border"
            style={{
              backgroundColor: "var(--card-bg)",
              borderColor: "var(--border-color)",
              color: "var(--text-primary)",
            }}
          />
          <div className="flex gap-3">
            <button onClick={saveNewGesture} className="btn-primary">
              Save Gesture
            </button>
            <button onClick={cancelRecording} className="btn-secondary">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button onClick={() => setIsRecording(true)} className="btn-primary">
          Start Recording
        </button>
      )}
    </div>
  );
}
