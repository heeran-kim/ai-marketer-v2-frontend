// src/components/common/Header.tsx
"use client";

import { HeaderProps } from "@/types/nav";

export default function Header({ title, actionButton }: HeaderProps) {
  return (
    <>
      <div className="border-b border-gray-300 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-6 py-8">
          {actionButton && (
            <div className="relative text-sm">
              <button
                onClick={actionButton.onClick}
                disabled={actionButton.isDisabled}
                className={`absolute top-1/2 right-1 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-700 transition 
                ${
                  actionButton.isDisabled &&
                  "bg-gray-300 text-gray-500 cursor-not-allowed"
                }
              `}
              >
                {actionButton.label}
              </button>
            </div>
          )}

          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
            {title}
          </h1>
        </div>
      </div>
    </>
  );
}
