"use client";

import { useState } from "react";
import { transition } from "@ssgoi/react";

export default function Home() {
  const [showShapes, setShowShapes] = useState(false);
  const [stiffness, setStiffness] = useState(1000);
  const [damping, setDamping] = useState(100);

  return (
    <>
      <style>{`
        .app-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        }

        .app-title {
          text-align: center;
          font-size: 2.5rem;
          margin-bottom: 2rem;
          color: #333;
        }

        .toggle-button {
          display: block;
          margin: 0 auto 3rem;
          padding: 0.75rem 2rem;
          font-size: 1rem;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .toggle-button:hover {
          background-color: #0056b3;
        }
        
        .controls {
          background-color: #f5f5f5;
          border-radius: 8px;
          padding: 1.5rem;
          margin-bottom: 2rem;
          display: flex;
          gap: 2rem;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
        }

        .speed-buttons {
          display: flex;
          gap: 0.5rem;
          margin-right: 1rem;
        }

        .speed-button {
          padding: 0.5rem 1rem;
          border: 2px solid #ddd;
          border-radius: 5px;
          background-color: white;
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 500;
          transition: all 0.2s;
        }

        .speed-button:hover {
          border-color: #007bff;
          background-color: #f8f9fa;
        }

        .speed-button.slow {
          color: #dc3545;
        }

        .speed-button.fast {
          color: #28a745;
        }
        
        .control-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          align-items: center;
        }
        
        .control-label {
          font-size: 0.9rem;
          color: #666;
          font-weight: 500;
        }
        
        .control-input {
          width: 80px;
          padding: 0.25rem 0.5rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          text-align: center;
          font-size: 1rem;
        }
        
        .control-value {
          font-size: 0.8rem;
          color: #888;
        }

        .shapes-container {
          display: flex;
          justify-content: center;
          margin-top: 3rem;
        }

        .shape {
          width: 100px;
          height: 100px;
          background-color: #ff6b6b;
          border-radius: 50%;
        }
      `}</style>

      <div className="app-container">
        <h1 className="app-title">SSGOI Transition Demo</h1>

        <div className="controls">
          <div className="speed-buttons">
            <button
              className="speed-button slow"
              onClick={() => {
                setStiffness(200);
                setDamping(100);
              }}
            >
              느리게
            </button>
            <button
              className="speed-button fast"
              onClick={() => {
                setStiffness(1000);
                setDamping(100);
              }}
            >
              빠르게
            </button>
          </div>

          <div className="control-group">
            <label className="control-label">Stiffness</label>
            <input
              type="number"
              className="control-input"
              value={stiffness}
              onChange={(e) => setStiffness(Number(e.target.value))}
              min="1"
              max="1000"
            />
            <span className="control-value">(1-1000)</span>
          </div>

          <div className="control-group">
            <label className="control-label">Damping</label>
            <input
              type="number"
              className="control-input"
              value={damping}
              onChange={(e) => setDamping(Number(e.target.value))}
              min="0"
              max="100"
            />
            <span className="control-value">(0-100)</span>
          </div>
        </div>

        <button
          onClick={() => setShowShapes(!showShapes)}
          className="toggle-button"
        >
          {showShapes ? "Hide Element" : "Show Element"}
        </button>

        <div className="shapes-container">
          {showShapes && (
            <div
              ref={transition({
                key: "fade",
                in: (element) => ({
                  spring: { stiffness, damping },
                  tick: (progress) => {
                    element.style.opacity = progress.toString();
                  },
                }),
                out: (element) => ({
                  spring: { stiffness, damping },
                  tick: (progress) => {
                    element.style.opacity = progress.toString();
                  },
                }),
              })}
              className="shape"
            />
          )}
        </div>
      </div>
    </>
  );
}
