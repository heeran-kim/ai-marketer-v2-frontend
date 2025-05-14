// src/components/common/Header.tsx
"use client";

import { HeaderProps } from "@/types/nav";
import InfoTooltip from "./InfoTooltip";

export default function Header({ title, actionButton }: HeaderProps) {
  return (
    <>
      <div className="border-b border-gray-300">
        <div className="flex justify-between max-w-6xl mx-auto px-6 py-8">
          <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
          {actionButton && (
            <button
              onClick={actionButton.onClick}
              disabled={actionButton.isDisabled}
              className={`flex items-center gap-2 px-4 py-2 bg-black text-sm text-white rounded-md hover:bg-gray-700 transition 
              ${
                actionButton.isDisabled &&
                "bg-gray-300 text-gray-500 cursor-not-allowed"
              }
            `}
            >
              {actionButton.tooltipContent && (
                <InfoTooltip
                  content={actionButton.tooltipContent}
                  position="left"
                  width="w-56"
                />
              )}
              {actionButton.label}
            </button>
          )}
        </div>
      </div>
    </>
  );
}
