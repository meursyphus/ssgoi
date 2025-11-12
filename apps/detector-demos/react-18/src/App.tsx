import { useState, useEffect } from "react";
import { transition } from "@ssgoi/react";
import "./App.css";

function App() {
  const [items, setItems] = useState([
    { id: 1, color: "#FF6B6B", name: "Item 1" },
    { id: 2, color: "#4ECDC4", name: "Item 2" },
    { id: 3, color: "#45B7D1", name: "Item 3" },
    { id: 4, color: "#96CEB4", name: "Item 4" },
  ]);
  const [reactVersion, setReactVersion] = useState<string>("Unknown");
  const [autoDetectionEnabled, setAutoDetectionEnabled] =
    useState<boolean>(false);

  useEffect(() => {
    // Get React version from window
    const version = (window as any).React?.version || "Unknown";
    setReactVersion(version);

    // Check if auto-detection should be enabled
    const majorVersion = parseInt(version.split(".")[0], 10);
    setAutoDetectionEnabled(majorVersion < 19);
  }, []);

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const addItem = () => {
    const newId = Math.max(...items.map((i) => i.id), 0) + 1;
    const colors = [
      "#FF6B6B",
      "#4ECDC4",
      "#45B7D1",
      "#96CEB4",
      "#FECA57",
      "#DDA0DD",
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    setItems((prev) => [
      ...prev,
      { id: newId, color: randomColor, name: `Item ${newId}` },
    ]);
  };

  const resetItems = () => {
    setItems([
      { id: 1, color: "#FF6B6B", name: "Item 1" },
      { id: 2, color: "#4ECDC4", name: "Item 2" },
      { id: 3, color: "#45B7D1", name: "Item 3" },
      { id: 4, color: "#96CEB4", name: "Item 4" },
    ]);
  };

  return (
    <div className="container">
      <div className="header">
        <h1>🔍 Automatic Removal Detection Demo</h1>
        <p className="subtitle">React 18 + MutationObserver</p>
      </div>

      {/* React Version Info */}
      <div className="info-section">
        <div className="info-card">
          <h3>React Version</h3>
          <p className="version">{reactVersion}</p>
        </div>
        <div className="info-card">
          <h3>Auto-Detection Status</h3>
          <p className={autoDetectionEnabled ? "enabled" : "disabled"}>
            {autoDetectionEnabled ? "✅ Enabled" : "❌ Disabled"}
          </p>
        </div>
        <div className="info-card">
          <h3>Detection Method</h3>
          <p className="method">
            {autoDetectionEnabled ? "MutationObserver" : "React Ref Cleanup"}
          </p>
        </div>
      </div>

      {/* Explanation */}
      <div className="explanation">
        <h3>How it works:</h3>
        <ul>
          <li>
            <strong>React 19+:</strong> Uses native ref cleanup function (no
            MutationObserver needed)
          </li>
          <li>
            <strong>React 18-:</strong> Uses MutationObserver to detect when
            elements are removed
          </li>
          <li>
            <strong>Vanilla JS:</strong> Also uses MutationObserver for
            automatic detection
          </li>
        </ul>
        <p className="note">
          Click "Remove" buttons below. Exit animations should run
          automatically without manual cleanup!
        </p>
      </div>

      {/* Controls */}
      <div className="controls">
        <button onClick={addItem} className="add-button">
          + Add Item
        </button>
        <button onClick={resetItems} className="reset-button">
          Reset Items
        </button>
      </div>

      {/* Items Grid */}
      <div className="items-grid">
        {items.map((item) => (
          <div
            key={item.id}
            ref={transition({
              key: `item-${item.id}`,
              in: (element) => ({
                spring: { stiffness: 300, damping: 30 },
                tick: (progress) => {
                  element.style.opacity = progress.toString();
                  element.style.transform = `scale(${0.8 + progress * 0.2})`;
                },
              }),
              out: (element) => ({
                spring: { stiffness: 400, damping: 35 },
                tick: (progress) => {
                  element.style.opacity = progress.toString();
                  element.style.transform = `scale(${0.8 + progress * 0.2}) rotate(${(1 - progress) * 15}deg)`;
                },
              }),
            })}
            className="item"
            style={{ backgroundColor: item.color }}
          >
            <div className="item-content">
              <h4 className="item-name">{item.name}</h4>
              <button
                onClick={() => removeItem(item.id)}
                className="remove-button"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="empty-state">
          <p>
            All items removed! Click "Add Item" or "Reset Items" to continue.
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
