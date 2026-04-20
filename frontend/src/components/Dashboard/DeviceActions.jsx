export function DeviceActions({ profiles, gestures, sensitivity, activeMode }) {
  const handleExportData = () => {
    const data = {
      profiles,
      gestures,
      settings: { sensitivity, mode: activeMode },
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "airmouse-config.json";
    a.click();
  };

  const handleResetDevice = () => {
    if (confirm("Reset device to factory settings?")) {
      alert("Device reset initiated");
    }
  };

  return (
    <>
      <div className="card">
        <button className="btn-secondary w-full md:w-auto">
          Calibrate Device
        </button>
      </div>

      <div className="card">
        <button
          onClick={handleResetDevice}
          className="btn-danger w-full md:w-auto"
        >
          Reset Device
        </button>
      </div>

      <div className="card">
        <button
          onClick={handleExportData}
          className="btn-secondary w-full md:w-auto"
        >
          Export Data
        </button>
      </div>
    </>
  );
}
