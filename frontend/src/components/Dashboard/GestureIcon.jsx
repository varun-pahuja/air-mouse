export function GestureIcon({ gestureName }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#9a3f3f"
      strokeWidth="2"
    >
      {gestureName === "V Shape" && (
        <path d="M12 4 L8 12 L12 20 M12 4 L16 12 L12 20" />
      )}
      {gestureName === "O Shape" && <circle cx="12" cy="12" r="6" />}
      {gestureName === "Swipe Left" && (
        <path d="M20 12 L4 12 M8 8 L4 12 L8 16" />
      )}
      {gestureName === "Swipe Right" && (
        <path d="M4 12 L20 12 M16 8 L20 12 L16 16" />
      )}
      {gestureName === "Circle" && <circle cx="12" cy="12" r="8" />}
      {gestureName === "Shake" && <path d="M4 12 L8 8 L12 12 L16 8 L20 12" />}
      {gestureName === "Tilt Up" && <path d="M12 20 L12 4 M8 8 L12 4 L16 8" />}
      {gestureName === "Tilt Down" && (
        <path d="M12 4 L12 20 M8 16 L12 20 L16 16" />
      )}
    </svg>
  );
}
