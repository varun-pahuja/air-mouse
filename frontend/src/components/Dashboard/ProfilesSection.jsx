import { ProfileCard } from "./ProfileCard";
import { ProfileEditor } from "./ProfileEditor";

export function ProfilesSection({
  profiles,
  editingProfile,
  setEditingProfile,
  addProfile,
  switchProfile,
  updateProfile,
  deleteProfile,
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2
          className="text-3xl font-bold"
          style={{
            fontFamily: "Syne, sans-serif",
            color: "var(--text-primary)",
          }}
        >
          Profiles
        </h2>
        <button onClick={addProfile} className="btn-primary">
          New Profile
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {profiles.map((profile) => (
          <ProfileCard
            key={profile.id}
            profile={profile}
            profiles={profiles}
            switchProfile={switchProfile}
            setEditingProfile={setEditingProfile}
            deleteProfile={deleteProfile}
          />
        ))}
      </div>

      <ProfileEditor
        editingProfile={editingProfile}
        setEditingProfile={setEditingProfile}
        updateProfile={updateProfile}
      />
    </div>
  );
}
