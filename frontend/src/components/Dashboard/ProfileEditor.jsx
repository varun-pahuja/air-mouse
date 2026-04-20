export function ProfileEditor({
  editingProfile,
  setEditingProfile,
  updateProfile,
}) {
  if (!editingProfile) return null;

  return (
    <div className="card">
      <div
        className="text-lg font-bold mb-4"
        style={{ fontFamily: "Syne, sans-serif", color: "var(--text-primary)" }}
      >
        Edit Profile
      </div>
      <div className="space-y-4">
        <div>
          <label
            className="block text-sm mb-2"
            style={{ color: "var(--text-secondary)" }}
          >
            Name
          </label>
          <input
            type="text"
            value={editingProfile.name}
            onChange={(e) =>
              setEditingProfile({ ...editingProfile, name: e.target.value })
            }
            className="w-full px-4 py-2 rounded-lg border"
            style={{
              backgroundColor: "var(--card-bg)",
              borderColor: "var(--border-color)",
              color: "var(--text-primary)",
            }}
          />
        </div>
        <div>
          <label
            className="block text-sm mb-2"
            style={{ color: "var(--text-secondary)" }}
          >
            Sensitivity: {editingProfile.sensitivity}
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={editingProfile.sensitivity}
            onChange={(e) =>
              setEditingProfile({
                ...editingProfile,
                sensitivity: parseInt(e.target.value),
              })
            }
            className="w-full"
          />
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => updateProfile(editingProfile)}
            className="btn-primary"
          >
            Save Changes
          </button>
          <button
            onClick={() => setEditingProfile(null)}
            className="btn-secondary"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
