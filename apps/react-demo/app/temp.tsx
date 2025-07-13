"use client";

import { useState } from "react";
import { useDomTransition } from "@meursyphus/ssgoi-react";
import {
  easeInOut,
  easeOut,
  easeOutBack,
  easeOutElastic,
  easeInCubic,
  easeOutBounce,
} from "@meursyphus/ssgoi-react/easing";

// Shape container component that maintains size
interface ShapeContainerProps {
  label: string;
  children: React.ReactNode;
}

function ShapeContainer({ label, children }: ShapeContainerProps) {
  return (
    <div className="shape-container">
      <div className="shape-wrapper">
        {children}
      </div>
      <p className="shape-label">{label}</p>
    </div>
  );
}

export default function TempDemo() {
  const [showShapes, setShowShapes] = useState(true);
  const [t1, t2, t3, t4] = [
    useDomTransition(),
    useDomTransition(),
    useDomTransition(),
    useDomTransition(),
  ];

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

        .shapes-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 3rem;
          padding: 2rem;
        }

        .shape-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .shape-wrapper {
          width: 150px;
          height: 150px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .shape {
          width: 100px;
          height: 100px;
          position: relative;
        }

        .circle {
          background-color: #ff6b6b;
          border-radius: 50%;
        }

        .triangle {
          width: 0;
          height: 0;
          border-left: 50px solid transparent;
          border-right: 50px solid transparent;
          border-bottom: 87px solid #4ecdc4;
        }

        .square {
          background-color: #45b7d1;
        }

        .pentagon {
          position: relative;
          width: 100px;
          background-color: #ffd93d;
          height: 0;
          border-left: 50px solid transparent;
          border-right: 50px solid transparent;
          border-top: 38px solid #ffd93d;
        }

        .pentagon::before {
          content: '';
          position: absolute;
          top: -88px;
          left: -50px;
          width: 0;
          height: 0;
          border-left: 50px solid transparent;
          border-right: 50px solid transparent;
          border-bottom: 50px solid #ffd93d;
        }

        .shape-label {
          font-size: 1.1rem;
          font-weight: 500;
          color: #555;
          margin: 0;
        }
      `}</style>
      
      <div className="app-container">
        <h1 className="app-title">useDomTransition Examples</h1>

        <button
          onClick={() => setShowShapes(!showShapes)}
          className="toggle-button"
        >
          {showShapes ? "Hide All Shapes" : "Show All Shapes"}
        </button>

        <div className="shapes-grid">
          {/* Circle with fade effect */}
          <ShapeContainer label="Fade">
            {showShapes && (
              <div
                ref={t1({
                  in: (element) => ({
                    duration: 600,
                    easing: easeInOut,
                    tick: (progress) => {
                      element.style.opacity = progress.toString();
                    },
                  }),
                  out: (element) => ({
                    duration: 600,
                    easing: easeOut,
                    tick: (progress) => {
                      element.style.opacity = progress.toString();
                    },
                  }),
                })}
                className="shape circle"
              />
            )}
          </ShapeContainer>

          {/* Triangle with scale + rotate effect */}
          <ShapeContainer label="Scale + Rotate">
            {showShapes && (
              <div
                ref={t2({
                  in: (element) => ({
                    duration: 600,
                    easing: easeOutBack,
                    tick: (progress) => {
                      element.style.transform = `scale(${progress}) rotate(${
                        progress * 360
                      }deg)`;
                      element.style.opacity = progress.toString();
                    },
                  }),
                  out: (element) => ({
                    duration: 600,
                    easing: easeInCubic,
                    tick: (progress) => {
                      element.style.transform = `scale(${progress}) rotate(${
                        progress * 360
                      }deg)`;
                      element.style.opacity = progress.toString();
                    },
                  }),
                })}
                className="shape triangle"
              />
            )}
          </ShapeContainer>

          {/* Square with slide effect */}
          <ShapeContainer label="Slide">
            {showShapes && (
              <div
                ref={t3({
                  in: (element) => ({
                    duration: 600,
                    easing: easeOutElastic,
                    tick: (progress) => {
                      element.style.transform = `translateX(${
                        (1 - progress) * -100
                      }px)`;
                      element.style.opacity = progress.toString();
                    },
                  }),
                  out: (element) => ({
                    duration: 600,
                    easing: easeInOut,
                    tick: (progress) => {
                      element.style.transform = `translateX(${
                        (1 - progress) * 100
                      }px)`;
                      element.style.opacity = progress.toString();
                    },
                  }),
                })}
                className="shape square"
              />
            )}
          </ShapeContainer>

          {/* Pentagon with bounce effect */}
          <ShapeContainer label="Bounce">
            {showShapes && (
              <div
                ref={t4({
                  in: (element) => ({
                    duration: 600,
                    easing: easeOutBounce,
                    tick: (progress) => {
                      element.style.transform = `translateY(${
                        (1 - progress) * -100
                      }px)`;
                      element.style.opacity = progress.toString();
                    },
                  }),
                  out: (element) => ({
                    duration: 600,
                    easing: easeInOut,
                    tick: (progress) => {
                      element.style.transform = `translateY(${
                        (1 - progress) * 100
                      }px)`;
                      element.style.opacity = progress.toString();
                    },
                  }),
                })}
                className="shape pentagon"
              />
            )}
          </ShapeContainer>
        </div>
      </div>
    </>
  );
}
