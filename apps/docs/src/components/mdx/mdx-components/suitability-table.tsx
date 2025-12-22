"use client";

import React from "react";
import { cn } from "../../../lib/utils";

interface SuitabilityItem {
  label: string;
  suitable: "yes" | "no" | "maybe";
  description: string;
}

interface SuitabilityTableProps {
  items: SuitabilityItem[];
  className?: string;
}

export function SuitabilityTable({ items, className }: SuitabilityTableProps) {
  const getSuitabilityIcon = (suitable: "yes" | "no" | "maybe") => {
    switch (suitable) {
      case "yes":
        return <span className="text-green-500 text-xl font-bold">✅</span>;
      case "no":
        return <span className="text-red-500 text-xl font-bold">❌</span>;
      case "maybe":
        return <span className="text-yellow-500 text-xl font-bold">⚠️</span>;
    }
  };

  return (
    <div className={cn("overflow-x-auto mb-6", className)}>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="text-left px-4 py-3 text-sm font-semibold text-gray-300 uppercase tracking-wider">
              콘텐츠 관계
            </th>
            <th className="text-center px-4 py-3 text-sm font-semibold text-gray-300 uppercase tracking-wider w-24">
              적합성
            </th>
            <th className="text-left px-4 py-3 text-sm font-semibold text-gray-300 uppercase tracking-wider">
              설명
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr
              key={index}
              className={cn(
                "border-b border-gray-800",
                index % 2 === 0 ? "bg-gray-900/50" : "bg-transparent",
              )}
            >
              <td className="px-4 py-3 text-sm font-medium text-gray-200">
                {item.label}
              </td>
              <td className="px-4 py-3 text-center">
                {getSuitabilityIcon(item.suitable)}
              </td>
              <td className="px-4 py-3 text-sm text-gray-300">
                {item.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
