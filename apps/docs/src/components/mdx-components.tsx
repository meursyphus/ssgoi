import { ComponentProps } from "react";
import _Demo from "./demo";
import { TransitionPlayground } from "./transition-playground";

// Example custom components for MDX
export const CodeDemo = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="my-8 rounded-lg border border-zinc-800 bg-zinc-900/50 p-6">
      <div className="mb-4 flex items-center gap-2">
        <div className="h-3 w-3 rounded-full bg-red-500" />
        <div className="h-3 w-3 rounded-full bg-yellow-500" />
        <div className="h-3 w-3 rounded-full bg-green-500" />
      </div>
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
};

export const Note = ({
  type = "info",
  children,
}: {
  type?: "info" | "warning" | "tip";
  children: React.ReactNode;
}) => {
  const styles = {
    info: "border-blue-500 bg-blue-500/10 text-blue-200",
    warning: "border-yellow-500 bg-yellow-500/10 text-yellow-200",
    tip: "border-green-500 bg-green-500/10 text-green-200",
  };

  const icons = {
    info: "ℹ️",
    warning: "⚠️",
    tip: "💡",
  };

  return (
    <div className={`my-4 rounded-lg border-l-4 p-4 ${styles[type]}`}>
      <div className="flex items-start gap-2">
        <span className="text-xl">{icons[type]}</span>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
};

export const CodeGroup = ({ children }: { children: React.ReactNode }) => {
  return <div className="my-4 space-y-2">{children}</div>;
};

export const Badge = ({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning";
}) => {
  const styles = {
    default: "bg-zinc-800 text-zinc-200",
    success: "bg-green-500/20 text-green-400",
    warning: "bg-yellow-500/20 text-yellow-400",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[variant]}`}
    >
      {children}
    </span>
  );
};

export const Grid = ({
  children,
  cols = 2,
}: {
  children: React.ReactNode;
  cols?: number;
}) => {
  return (
    <div className={`grid gap-4 my-6 grid-cols-1 md:grid-cols-${cols}`}>
      {children}
    </div>
  );
};

export const Card = ({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
      {title && (
        <h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>
      )}
      <div className="text-gray-300">{children}</div>
    </div>
  );
};

export function Demo({ autoPlay = false }: { autoPlay?: boolean }) {
  return (
    <div className="flex justify-center items-center my-12">
      <div className="relative max-w-sm w-full">
        {/* 모바일 프레임 */}
        <div className="relative overflow-hidden rounded-[3rem] border-8 border-white/10 bg-black shadow-2xl">
          <div className="absolute left-1/2 top-4 h-6 w-24 -translate-x-1/2 rounded-full bg-black" />

          {/* Demo Component */}
          <div className="aspect-[9/19.5]">
            <_Demo autoPlay={autoPlay} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Export all components that will be available in MDX
export const mdxComponents = {
  CodeDemo,
  Note,
  CodeGroup,
  Badge,
  Grid,
  Card,
  Demo,
  TransitionPlayground,
};
