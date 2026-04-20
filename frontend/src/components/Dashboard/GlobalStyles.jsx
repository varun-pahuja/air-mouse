export function GlobalStyles() {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700&family=DM+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />

      <style jsx global>{`
        :root {
          --bg-primary: #e6cfa9;
          --card-bg: #fbf9d1;
          --text-primary: #2d1f1f;
          --text-secondary: #6b5555;
          --border-color: rgba(154, 63, 63, 0.12);
          --nav-active-bg: rgba(154, 63, 63, 0.1);
          --progress-bg: rgba(154, 63, 63, 0.08);
          --accent-primary: #9a3f3f;
          --accent-secondary: #c1856d;
        }

        [data-theme="dark"] {
          --bg-primary: #2d1f1f;
          --card-bg: #3d2f2f;
          --text-primary: #fbf9d1;
          --text-secondary: #c1856d;
          --border-color: rgba(230, 207, 169, 0.12);
          --nav-active-bg: rgba(193, 133, 109, 0.15);
          --progress-bg: rgba(193, 133, 109, 0.1);
          --accent-primary: #c1856d;
          --accent-secondary: #e6cfa9;
        }

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        .card {
          background-color: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 4px 12px rgba(154, 63, 63, 0.08);
          transition: all 250ms ease-out;
        }

        .card:hover {
          box-shadow: 0 6px 16px rgba(154, 63, 63, 0.12);
        }

        .badge {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
          font-family: 'DM Mono', monospace;
        }

        .badge-success {
          background-color: rgba(72, 130, 72, 0.15);
          color: #488248;
        }

        .badge-error {
          background-color: rgba(154, 63, 63, 0.15);
          color: #9a3f3f;
        }

        .badge-info {
          background-color: rgba(193, 133, 109, 0.15);
          color: #c1856d;
        }

        .badge-warning {
          background-color: rgba(230, 207, 169, 0.3);
          color: #8b6914;
        }

        .sensor-chip {
          background-color: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 10px;
          text-align: center;
          transition: all 250ms ease-out;
        }

        .sensor-chip:hover {
          border-color: var(--accent-primary);
        }

        .btn-primary {
          background-color: var(--accent-primary);
          color: #fbf9d1;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          font-family: 'Syne', sans-serif;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 250ms ease-out;
        }

        .btn-primary:hover {
          background-color: #7d3333;
        }

        .btn-secondary {
          background-color: transparent;
          color: var(--text-primary);
          border: 1px solid var(--border-color);
          padding: 10px 20px;
          border-radius: 8px;
          font-family: 'Syne', sans-serif;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 250ms ease-out;
        }

        .btn-secondary:hover {
          background-color: rgba(193, 133, 109, 0.08);
        }

        .btn-danger {
          background-color: transparent;
          color: #9a3f3f;
          border: 1px solid #9a3f3f;
          padding: 10px 20px;
          border-radius: 8px;
          font-family: 'Syne', sans-serif;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 250ms ease-out;
        }

        .btn-danger:hover {
          background-color: rgba(154, 63, 63, 0.08);
        }

        .recording-badge {
          background-color: rgba(154, 63, 63, 0.15);
          color: #9a3f3f;
          animation: pulse 1.5s ease-in-out infinite;
        }

        .idle-badge {
          background-color: rgba(107, 85, 85, 0.12);
          color: #6b5555;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        input[type="range"] {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 6px;
          border-radius: 3px;
          background: var(--progress-bg);
          outline: none;
        }

        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: var(--accent-primary);
          cursor: pointer;
          transition: all 250ms ease-out;
        }

        input[type="range"]::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }

        input[type="range"]::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: var(--accent-primary);
          cursor: pointer;
          border: none;
          transition: all 250ms ease-out;
        }

        input[type="range"]::-moz-range-thumb:hover {
          transform: scale(1.2);
        }
      `}</style>
    </>
  );
}
