"use client";

import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      style={
        {
          "--normal-bg": "#ffffff",
          "--normal-text": "#1c1917",
          "--normal-border": "#e5e5e5",
          "--success-bg": "#ffffff",
          "--success-text": "#1c1917",
          "--success-border": "#dc2626",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
