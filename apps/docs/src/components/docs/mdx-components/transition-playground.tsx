"use client";

import React, { useState } from "react";
import { transition } from "@ssgoi/react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

interface TransitionOption {
  label: string;
  in: (element: HTMLElement) => any;
  out: (element: HTMLElement) => any;
}

const transitionOptions: TransitionOption[] = [
  {
    label: "Fade",
    in: (element) => ({
      tick: (progress: number) => {
        element.style.opacity = progress.toString();
      },
    }),
    out: (element) => ({
      tick: (progress: number) => {
        element.style.opacity = progress.toString();
      },
    }),
  },
  {
    label: "Scale",
    in: (element) => ({
      tick: (progress: number) => {
        element.style.transform = `scale(${progress})`;
        element.style.opacity = progress.toString();
      },
    }),
    out: (element) => ({
      tick: (progress: number) => {
        element.style.transform = `scale(${progress})`;
        element.style.opacity = progress.toString();
      },
    }),
  },
  {
    label: "Blur",
    in: (element) => ({
      tick: (progress: number) => {
        element.style.filter = `blur(${(1 - progress) * 10}px)`;
        element.style.opacity = progress.toString();
      },
    }),
    out: (element) => ({
      tick: (progress: number) => {
        element.style.filter = `blur(${(1 - progress) * 10}px)`;
        element.style.opacity = progress.toString();
      },
    }),
  },
  {
    label: "Flip X",
    in: (element) => ({
      tick: (progress: number) => {
        element.style.transform = `perspective(800px) rotateX(${(1 - progress) * 90}deg)`;
        element.style.opacity = progress.toString();
      },
    }),
    out: (element) => ({
      tick: (progress: number) => {
        element.style.transform = `perspective(800px) rotateX(${(1 - progress) * 90}deg)`;
        element.style.opacity = progress.toString();
      },
    }),
  },
  {
    label: "Flip Y",
    in: (element) => ({
      tick: (progress: number) => {
        element.style.transform = `perspective(800px) rotateY(${(1 - progress) * 180}deg)`;
        element.style.opacity = progress.toString();
      },
    }),
    out: (element) => ({
      tick: (progress: number) => {
        element.style.transform = `perspective(800px) rotateY(${(1 - progress) * 180}deg)`;
        element.style.opacity = progress.toString();
      },
    }),
  },
  {
    label: "Slide Left",
    in: (element) => ({
      tick: (progress: number) => {
        element.style.transform = `translateX(${(1 - progress) * -100}px)`;
        element.style.opacity = progress.toString();
      },
    }),
    out: (element) => ({
      tick: (progress: number) => {
        element.style.transform = `translateX(${(1 - progress) * -100}px)`;
        element.style.opacity = progress.toString();
      },
    }),
  },
  {
    label: "Slide Up",
    in: (element) => ({
      tick: (progress: number) => {
        element.style.transform = `translateY(${(1 - progress) * 50}px)`;
        element.style.opacity = progress.toString();
      },
    }),
    out: (element) => ({
      tick: (progress: number) => {
        element.style.transform = `translateY(${(1 - progress) * 50}px)`;
        element.style.opacity = progress.toString();
      },
    }),
  },
  {
    label: "Rotate",
    in: (element) => ({
      tick: (progress: number) => {
        element.style.transform = `rotate(${(1 - progress) * -360}deg)`;
        element.style.opacity = progress.toString();
      },
    }),
    out: (element) => ({
      tick: (progress: number) => {
        element.style.transform = `rotate(${(1 - progress) * -360}deg)`;
        element.style.opacity = progress.toString();
      },
    }),
  },
  {
    label: "Bounce",
    in: (element) => ({
      tick: (progress: number) => {
        const bounce = Math.sin(progress * Math.PI * 2) * 0.1 * (1 - progress);
        element.style.transform = `translateY(${(1 - progress) * 100 - bounce * 100}px)`;
        element.style.opacity = progress.toString();
      },
    }),
    out: (element) => ({
      tick: (progress: number) => {
        const bounce = Math.sin(progress * Math.PI * 2) * 0.1 * (1 - progress);
        element.style.transform = `translateY(${(1 - progress) * 100 - bounce * 100}px)`;
        element.style.opacity = progress.toString();
      },
    }),
  },
  {
    label: "Zoom & Spin",
    in: (element) => ({
      tick: (progress: number) => {
        element.style.transform = `scale(${0.5 + progress * 0.5}) rotate(${(1 - progress) * 720}deg)`;
        element.style.opacity = progress.toString();
      },
    }),
    out: (element) => ({
      tick: (progress: number) => {
        element.style.transform = `scale(${0.5 + progress * 0.5}) rotate(${(1 - progress) * 720}deg)`;
        element.style.opacity = progress.toString();
      },
    }),
  },
  {
    label: "Skew",
    in: (element) => ({
      tick: (progress: number) => {
        element.style.transform = `skew(${(1 - progress) * 20}deg, ${(1 - progress) * 10}deg)`;
        element.style.opacity = progress.toString();
      },
    }),
    out: (element) => ({
      tick: (progress: number) => {
        element.style.transform = `skew(${(1 - progress) * 20}deg, ${(1 - progress) * 10}deg)`;
        element.style.opacity = progress.toString();
      },
    }),
  },
  {
    label: "Swing",
    in: (element) => ({
      tick: (progress: number) => {
        const swing = Math.sin(progress * Math.PI) * 30;
        element.style.transform = `rotate(${swing * (1 - progress)}deg)`;
        element.style.transformOrigin = "top center";
        element.style.opacity = progress.toString();
      },
    }),
    out: (element) => ({
      tick: (progress: number) => {
        const swing = Math.sin(progress * Math.PI) * 30;
        element.style.transform = `rotate(${swing * (1 - progress)}deg)`;
        element.style.transformOrigin = "top center";
        element.style.opacity = progress.toString();
      },
    }),
  },
];

export function TransitionPlayground() {
  const [isVisible, setIsVisible] = useState(true);
  const [selectedTransition, setSelectedTransition] =
    useState<TransitionOption>(transitionOptions[0]);
  const [stiffness, setStiffness] = useState(300);
  const [damping, setDamping] = useState(30);
  const [transitionKey, setTransitionKey] = useState("playground-element");

  const generateCode = () => {
    return `\`\`\`tsx
import { transition } from '@ssgoi/react';

// Using transition hook
<div
  ref={transition({
    key: "${transitionKey}",
    in: (element) => ({
      spring: { stiffness: ${stiffness}, damping: ${damping} },
      tick: (progress) => {
        ${
          selectedTransition.label === "Fade"
            ? `element.style.opacity = progress.toString();`
            : selectedTransition.label === "Scale"
              ? `element.style.transform = \`scale(\${progress})\`;
        element.style.opacity = progress.toString();`
              : selectedTransition.label === "Blur"
                ? `element.style.filter = \`blur(\${(1 - progress) * 10}px)\`;
        element.style.opacity = progress.toString();`
                : selectedTransition.label === "Rotate"
                  ? `element.style.transform = \`rotate(\${(1 - progress) * -360}deg)\`;
        element.style.opacity = progress.toString();`
                  : `// Custom transition logic here`
        }
      }
    }),
    out: (element) => ({
      spring: { stiffness: ${stiffness}, damping: ${damping} },
      tick: (progress) => {
        // Same as 'in' but progress goes from 1 to 0
      }
    })
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
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Preview</h2>
        <div className="flex justify-center items-center h-64 w-full bg-white dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
          {isVisible && (
            <div
              ref={transition({
                key: transitionKey,
                in: (element) => ({
                  spring: { stiffness, damping },
                  ...selectedTransition.in(element),
                }),
                out: (element) => ({
                  spring: { stiffness, damping },
                  ...selectedTransition.out(element),
                }),
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
