"use client";

import { useState, useRef, useEffect } from "react";
import { FaChevronDown, FaCheck } from "react-icons/fa";

type OptionType = string | { key: string; label: string };
interface SelectProps {
  value: string | null;
  onChange: (value: string | null) => void;
  options: readonly OptionType[];
  placeholder?: string;
  includeAllOption?: boolean;
}

export default function Select({
  value,
  onChange,
  options,
  placeholder = "Select an option",
  includeAllOption = true,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative flex-shrink min-w-[160px]" ref={dropdownRef}>
      {/* Select Box */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="
                    w-full min-w-[160px] px-4 py-2 text-sm border rounded-md shadow-sm 
                    flex items-center justify-between transition focus:outline-none focus:ring-2
                    bg-white text-gray-900 border-gray-300 focus:ring-gray-400 focus:border-gray-400
                "
      >
        {value ? (
          typeof value === "string" ? (
            options.find(
              (opt): opt is { key: string; label: string } =>
                typeof opt !== "string" && opt.key === value
            )?.label || value
          ) : (
            value
          )
        ) : (
          <span className="text-gray-500">{placeholder}</span>
        )}

        <FaChevronDown
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <ul
          className="
                    absolute left-0 mt-2 w-full border rounded-md shadow-lg z-50 overflow-hidden
                    bg-white border-gray-300 text-gray-900 shadow-gray-200
                    animate-fade-in"
        >
          {includeAllOption && (
            <li
              onClick={() => {
                onChange(null);
                setIsOpen(false);
              }}
              className="px-4 py-2 text-sm flex items-center justify-between cursor-pointer hover:bg-gray-100 transition"
            >
              All
              {value === null && <FaCheck />}
            </li>
          )}

          {options.map((opt) => {
            const key = typeof opt === "string" ? opt : opt.key;
            const label = typeof opt === "string" ? opt : opt.label;
            return (
              <li
                key={key}
                onClick={() => {
                  onChange(key);
                  setIsOpen(false);
                }}
                className="px-4 py-2 text-sm flex items-center justify-between cursor-pointer hover:bg-gray-100 transition"
              >
                {label}
                {value === key && <FaCheck />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
