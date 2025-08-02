"use client";

import { useEffect } from "react";

export function ConsoleWelcome() {
  useEffect(() => {
    // ASCII art with color styling
    console.log(
      "%c" +
      "███████╗███████╗ ██████╗  ██████╗ ██╗\n" +
      "██╔════╝██╔════╝██╔════╝ ██╔═══██╗██║\n" +
      "███████╗███████╗██║  ███╗██║   ██║██║\n" +
      "╚════██║╚════██║██║   ██║██║   ██║██║\n" +
      "███████║███████║╚██████╔╝╚██████╔╝██║\n" +
      "╚══════╝╚══════╝ ╚═════╝  ╚═════╝ ╚═╝",
      "color: #10b981; font-family: monospace; font-size: 12px; line-height: 1.2;"
    );
    
    console.log(
      "%c🥒 Welcome to SSGOI - 쓱오이!",
      "color: #10b981; font-size: 20px; font-weight: bold; margin-top: 10px;"
    );
    
    console.log(
      "%c✨ Beautiful page transitions for modern web apps",
      "color: #6b7280; font-size: 14px; margin-top: 5px;"
    );
    
    console.log(
      "%c🚀 Supports React, Svelte, and more!",
      "color: #6b7280; font-size: 14px;"
    );
    
    console.log(
      "%c📚 Visit: https://github.com/meursyphus/ssgoi",
      "color: #3b82f6; font-size: 14px; margin-top: 5px;"
    );
  }, []);

  return null;
}