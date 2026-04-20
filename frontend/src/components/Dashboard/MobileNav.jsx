export function MobileNav({ activeSection, setActiveSection }) {
  const navItems = [
    { id: "dashboard", icon: "▦" },
    { id: "gestures", icon: "⟳" },
    { id: "profiles", icon: "◉" },
    { id: "analytics", icon: "▭" },
    { id: "settings", icon: "⚙" },
  ];

  return (
    <div
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t"
      style={{
        borderColor: "var(--border-color)",
        backgroundColor: "var(--card-bg)",
      }}
    >
      <div className="flex justify-around py-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className="flex flex-col items-center px-4 py-1"
            style={{
              color:
                activeSection === item.id
                  ? "var(--accent-primary)"
                  : "var(--text-secondary)",
            }}
          >
            <span style={{ fontSize: "20px" }}>{item.icon}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
