export function Sidebar({ activeSection, setActiveSection }) {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "▦" },
    { id: "gestures", label: "Gestures", icon: "⟳" },
    { id: "testing", label: "Testing", icon: "⚗" },
    { id: "profiles", label: "Profiles", icon: "◉" },
    { id: "analytics", label: "Analytics", icon: "▭" },
    { id: "settings", label: "Settings", icon: "⚙" },
  ];

  return (
    <aside
      className="hidden md:flex md:flex-col w-[220px] border-r"
      style={{
        borderColor: "var(--border-color)",
        backgroundColor: "var(--bg-primary)",
      }}
    >
      <div className="p-6">
        <h1
          className="text-xl font-bold"
          style={{
            fontFamily: "Syne, sans-serif",
            color: "var(--text-primary)",
          }}
        >
          AirMouse AI
        </h1>
      </div>
      <nav className="flex-1 px-3">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className="w-full text-left px-4 py-2.5 mb-1 rounded-lg transition-all duration-200"
            style={{
              fontFamily: "Syne, sans-serif",
              fontSize: "14px",
              color:
                activeSection === item.id
                  ? "var(--accent-primary)"
                  : "var(--text-secondary)",
              backgroundColor:
                activeSection === item.id
                  ? "var(--nav-active-bg)"
                  : "transparent",
              borderLeft:
                activeSection === item.id
                  ? "3px solid var(--accent-primary)"
                  : "3px solid transparent",
            }}
          >
            <span style={{ marginRight: "10px", opacity: 0.7 }}>
              {item.icon}
            </span>
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
