export function ProfileCard({
  profile,
  profiles,
  switchProfile,
  setEditingProfile,
  deleteProfile,
}) {
  return (
    <div className="card">
      <div className="flex items-start gap-4 mb-4">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl"
          style={{
            backgroundColor: profile.color,
            fontFamily: "Syne, sans-serif",
          }}
        >
          {profile.initial}
        </div>
        <div className="flex-1">
          <div
            className="font-bold mb-1"
            style={{
              fontFamily: "Syne, sans-serif",
              color: "var(--text-primary)",
            }}
          >
            {profile.name}
          </div>
          {profile.active && (
            <span className="badge badge-success">Active</span>
          )}
        </div>
      </div>
      <div className="text-sm mb-3" style={{ color: "var(--text-secondary)" }}>
        {profile.gestureCount} gestures • Sensitivity: {profile.sensitivity}
      </div>
      <div className="flex gap-2">
        {!profile.active && (
          <button
            onClick={() => switchProfile(profile.id)}
            className="btn-secondary text-sm"
          >
            Switch to
          </button>
        )}
        <button
          onClick={() => setEditingProfile(profile)}
          className="btn-secondary text-sm"
        >
          Edit
        </button>
        {profiles.length > 1 && (
          <button
            onClick={() => {
              if (confirm(`Delete ${profile.name}?`)) {
                deleteProfile(profile.id);
              }
            }}
            className="btn-danger text-sm"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
