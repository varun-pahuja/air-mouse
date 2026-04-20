export function DarkModeToggle({ darkMode, setDarkMode }) {
  return (
    <div className="card">
      <div className="flex justify-between items-center">
        <div>
          <div
            className="font-bold mb-1"
            style={{
              fontFamily: "Syne, sans-serif",
              color: "var(--text-primary)",
            }}
          >
            Dark Mode
          </div>
          <div className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Toggle between light and dark themes
          </div>
        </div>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="relative w-14 h-7 rounded-full transition-all duration-200"
          style={{ backgroundColor: darkMode ? "#9a3f3f" : "#d1d5db" }}
        >
          <span
            className="absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform duration-200"
            style={{
              transform: darkMode ? "translateX(28px)" : "translateX(0)",
            }}
          ></span>
        </button>
      </div>
    </div>
  );
}
