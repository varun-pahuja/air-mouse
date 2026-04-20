export function ActiveProfileCard({ profile }) {
  return (
    <div className="card">
      <div
        className="text-sm mb-2"
        style={{
          color: "var(--text-secondary)",
          fontFamily: "Syne, sans-serif",
        }}
      >
        Active Profile
      </div>
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
          style={{
            backgroundColor: profile.color,
            fontFamily: "Syne, sans-serif",
          }}
        >
          {profile.initial}
        </div>
        <div>
          <div className="font-medium" style={{ color: "var(--text-primary)" }}>
            {profile.name}
          </div>
          <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
            {profile.gestureCount} gestures
          </div>
        </div>
      </div>
    </div>
  );
}
