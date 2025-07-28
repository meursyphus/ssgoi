"use client";

import React, { useState } from "react";
import { transition } from "@ssgoi/react";
import {
  fade,
  scale,
  blur,
  slide,
  fly,
  rotate,
  bounce,
} from "@ssgoi/react/transitions";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

interface TransitionOption {
  label: string;
  getTransition: (stiffness: number, damping: number) => ReturnType<typeof fade>;
  getCode?: (stiffness: number, damping: number) => string;
}

const transitionOptions: TransitionOption[] = [
  {
    label: "Fade",
    getTransition: (stiffness, damping) => fade({ spring: { stiffness, damping } }),
    getCode: (stiffness, damping) =>
      `fade({ spring: { stiffness: ${stiffness}, damping: ${damping} } })`,
  },
  {
    label: "Fade (Custom Range)",
    getTransition: (stiffness, damping) => fade({ from: 0.2, to: 0.8, spring: { stiffness, damping } }),
    getCode: (stiffness, damping) =>
      `fade({ from: 0.2, to: 0.8, spring: { stiffness: ${stiffness}, damping: ${damping} } })`,
  },
  {
    label: "Scale",
    getTransition: (stiffness, damping) => scale({ spring: { stiffness, damping } }),
    getCode: (stiffness, damping) =>
      `scale({ spring: { stiffness: ${stiffness}, damping: ${damping} } })`,
  },
  {
    label: "Scale X",
    getTransition: (stiffness, damping) => scale({ axis: "x", spring: { stiffness, damping } }),
    getCode: (stiffness, damping) =>
      `scale({ axis: 'x', spring: { stiffness: ${stiffness}, damping: ${damping} } })`,
  },
  {
    label: "Scale Y",
    getTransition: (stiffness, damping) => scale({ axis: "y", spring: { stiffness, damping } }),
    getCode: (stiffness, damping) =>
      `scale({ axis: 'y', spring: { stiffness: ${stiffness}, damping: ${damping} } })`,
  },
  {
    label: "Blur",
    getTransition: (stiffness, damping) => blur({ spring: { stiffness, damping } }),
    getCode: (stiffness, damping) =>
      `blur({ spring: { stiffness: ${stiffness}, damping: ${damping} } })`,
  },
  {
    label: "Blur (Heavy)",
    getTransition: (stiffness, damping) => blur({ amount: 20, spring: { stiffness, damping } }),
    getCode: (stiffness, damping) =>
      `blur({ amount: 20, spring: { stiffness: ${stiffness}, damping: ${damping} } })`,
  },
  {
    label: "Blur + Scale",
    getTransition: (stiffness, damping) => blur({ scale: true, spring: { stiffness, damping } }),
    getCode: (stiffness, damping) =>
      `blur({ scale: true, spring: { stiffness: ${stiffness}, damping: ${damping} } })`,
  },
  {
    label: "Slide Left",
    getTransition: (stiffness, damping) => slide({ direction: "left", spring: { stiffness, damping } }),
    getCode: (stiffness, damping) =>
      `slide({ direction: 'left', spring: { stiffness: ${stiffness}, damping: ${damping} } })`,
  },
  {
    label: "Slide Right",
    getTransition: (stiffness, damping) => slide({ direction: "right", spring: { stiffness, damping } }),
    getCode: (stiffness, damping) =>
      `slide({ direction: 'right', spring: { stiffness: ${stiffness}, damping: ${damping} } })`,
  },
  {
    label: "Slide Up",
    getTransition: (stiffness, damping) => slide({ direction: "up", spring: { stiffness, damping } }),
    getCode: (stiffness, damping) =>
      `slide({ direction: 'up', spring: { stiffness: ${stiffness}, damping: ${damping} } })`,
  },
  {
    label: "Slide Down",
    getTransition: (stiffness, damping) => slide({ direction: "down", spring: { stiffness, damping } }),
    getCode: (stiffness, damping) =>
      `slide({ direction: 'down', spring: { stiffness: ${stiffness}, damping: ${damping} } })`,
  },
  {
    label: "Fly",
    getTransition: (stiffness, damping) => fly({ spring: { stiffness, damping } }),
    getCode: (stiffness, damping) =>
      `fly({ spring: { stiffness: ${stiffness}, damping: ${damping} } })`,
  },
  {
    label: "Fly (Custom)",
    getTransition: (stiffness, damping) => fly({ x: 200, y: -50, opacity: 0.2, spring: { stiffness, damping } }),
    getCode: (stiffness, damping) =>
      `fly({ x: 200, y: -50, opacity: 0.2, spring: { stiffness: ${stiffness}, damping: ${damping} } })`,
  },
  {
    label: "Rotate",
    getTransition: (stiffness, damping) => rotate({ spring: { stiffness, damping } }),
    getCode: (stiffness, damping) =>
      `rotate({ spring: { stiffness: ${stiffness}, damping: ${damping} } })`,
  },
  {
    label: "Bounce",
    getTransition: (stiffness, damping) => bounce({ spring: { stiffness, damping } }),
    getCode: (stiffness, damping) =>
      `bounce({ spring: { stiffness: ${stiffness}, damping: ${damping} } })`,
  },
];

export function TransitionPlayground() {
  const [isVisible, setIsVisible] = useState(true);
  const [selectedTransition, setSelectedTransition] =
    useState<TransitionOption>(transitionOptions[0]);
  const [stiffness, setStiffness] = useState(300);
  const [damping, setDamping] = useState(30);

  const generateCode = () => {
    const transitionCode =
      selectedTransition.getCode?.(stiffness, damping) ||
      selectedTransition.label.toLowerCase();
    return `\`\`\`tsx
import { transition } from '@ssgoi/react';
import { ${selectedTransition.label.toLowerCase().replace(/[^a-z]/g, "")} } from '@ssgoi/react/transitions';

// Using the transition
const animatedTransition = ${transitionCode};

<div
  ref={transition({
    key: "playground-element",
    ...animatedTransition
  })}
>
  Your content here
</div>
\`\`\``;
  };

  return (
    <div className="w-full space-y-6 p-6 bg-gray-50 dark:bg-gray-900 rounded-lg">
      {/* Preview Area */}
      <div className="flex flex-col items-center space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Preview
        </h2>
        <div className="flex justify-center items-center h-64 w-full bg-white dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
          {isVisible && (
            <div
              ref={transition({
                key: "playground-element",
                ...selectedTransition.getTransition(stiffness, damping),
              })}
              className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-lg flex items-center justify-center text-white font-bold text-xl"
            >
              SSGOI
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="space-y-4">
        {/* Transition Type */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Transition Type
          </label>
          <select
            value={selectedTransition.label}
            onChange={(e) => {
              const option = transitionOptions.find(
                (opt) => opt.label === e.target.value
              );
              if (option) setSelectedTransition(option);
            }}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
          >
            {transitionOptions.map((option) => (
              <option key={option.label} value={option.label}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Preset Speed Buttons */}
        <div className="flex gap-2 justify-center">
          <button
            onClick={() => {
              setStiffness(100);
              setDamping(20);
            }}
            className={`px-4 py-2 rounded-md transition-colors ${
              stiffness === 100
                ? "bg-blue-500 text-white"
                : "bg-gray-200 dark:bg-gray-700"
            }`}
          >
            Smooth
          </button>
          <button
            onClick={() => {
              setStiffness(300);
              setDamping(30);
            }}
            className={`px-4 py-2 rounded-md transition-colors ${
              stiffness === 300
                ? "bg-blue-500 text-white"
                : "bg-gray-200 dark:bg-gray-700"
            }`}
          >
            Normal
          </button>
          <button
            onClick={() => {
              setStiffness(500);
              setDamping(40);
            }}
            className={`px-4 py-2 rounded-md transition-colors ${
              stiffness === 500
                ? "bg-blue-500 text-white"
                : "bg-gray-200 dark:bg-gray-700"
            }`}
          >
            Fast
          </button>
        </div>

        {/* Spring Settings */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Stiffness: {stiffness}
            </label>
            <input
              type="range"
              min="50"
              max="500"
              step="10"
              value={stiffness}
              onChange={(e) => setStiffness(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Damping: {damping}
            </label>
            <input
              type="range"
              min="5"
              max="50"
              step="1"
              value={damping}
              onChange={(e) => setDamping(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>

        {/* Toggle Button - More prominent */}
        <div className="flex justify-center">
          <button
            onClick={() => setIsVisible(!isVisible)}
            className={`px-8 py-3 font-semibold rounded-lg shadow-md transition-all transform hover:scale-105 ${
              isVisible
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-green-500 hover:bg-green-600 text-white animate-pulse"
            }`}
          >
            {isVisible ? "🫥 Hide Element" : "✨ Show Element"}
          </button>
        </div>
      </div>

      {/* Code Preview */}
      <div className="mt-6">
        <h3 className="text-sm font-medium mb-2">Generated Code:</h3>
        <div className="prose prose-invert max-w-none">
          <Markdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={{
              pre: ({ children, ...props }) => (
                <pre
                  className="hljs p-4 bg-gray-900 rounded-md overflow-x-auto"
                  {...props}
                >
                  {children}
                </pre>
              ),
              code: ({ node, className, children, ...props }) => {
                if (className?.includes("language-")) {
                  return (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                }
                return (
                  <code
                    className="bg-gray-800 text-red-400 px-1.5 py-0.5 rounded text-sm"
                    {...props}
                  >
                    {children}
                  </code>
                );
              },
            }}
          >
            {generateCode()}
          </Markdown>
        </div>
      </div>
    </div>
  );
}
