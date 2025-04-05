// src/components/common/ActionDropdown.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { HiDotsHorizontal } from "react-icons/hi";
import { Action } from "@/types/nav";

interface ActionDropdownProps {
  actions: Action[];
  variant?: "default" | "inline"; // "default" uses absolute positioning, "inline" does not.
}

export default function ActionDropdown({
  actions,
  variant = "default",
}: ActionDropdownProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Conditional classes for the container and button based on variant
  const containerClasses =
    variant === "default"
      ? "relative text-xs"
      : "relative text-xs inline-flex items-center";

  const buttonClasses =
    variant === "default"
      ? "absolute top-1/2 right-2 p-2 rounded-lg hover:bg-gray-200 transition"
      : "p-2 rounded-lg hover:bg-gray-200 transition";

  const dropdownClasses =
    variant === "default"
      ? "absolute top-10 right-0 min-w-[120px] bg-white shadow-lg border rounded-xl z-50 p-1"
      : "absolute top-full right-0 mt-2 min-w-[120px] bg-white shadow-lg border rounded-xl z-50 p-1";

  return (
    <div className={containerClasses}>
      <button
        ref={buttonRef}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((prev) => !prev);
        }}
        className={buttonClasses}
      >
        <HiDotsHorizontal className="text-gray-600" size={14} />
      </button>

      {open && (
        <div ref={dropdownRef} className={dropdownClasses}>
          {actions.map((action) => (
            <button
              key={action.label}
              onClick={() => {
                action.onClick(router);
                setOpen(false);
              }}
              disabled={action.disabled}
              className={`block w-full text-left px-4 py-2 rounded-lg transition ${
                action.disabled
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "hover:bg-gray-100"
              }`}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
