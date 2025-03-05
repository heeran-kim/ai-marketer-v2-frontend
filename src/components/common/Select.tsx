"use client";

import { useState, useRef, useEffect } from "react";
import { FaChevronDown, FaCheck } from "react-icons/fa";

interface SelectProps {
    value: string | null;
    onChange: (value: string | null) => void;
    options: readonly string[];
    placeholder?: string;
    includeAllOption?: boolean;
}

export default function Select({ 
    value, 
    onChange, 
    options, 
    placeholder = "Select an option", 
    includeAllOption = true 
}: SelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative w-auto min-w-[160px]" ref={dropdownRef}>
            {/* Select Box */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="
                    w-auto min-w-[160px] px-4 py-2 text-sm border rounded-md shadow-sm 
                    flex items-center justify-between transition focus:outline-none focus:ring-2
                    dark:bg-black dark:text-white dark:border-gray-700 dark:focus:ring-gray-600 
                    dark:focus:border-gray-600
                    bg-white text-gray-900 border-gray-300 focus:ring-gray-400 focus:border-gray-400
                "
            >
                {value ? value : <span className="text-gray-500 dark:text-gray-400">{placeholder}</span>}
                <FaChevronDown className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Dropdown */}
            {isOpen && (
                <ul className="
                    absolute left-0 mt-2 w-full border rounded-md shadow-lg z-10 overflow-hidden
                    dark:bg-black dark:border-gray-700 dark:text-white dark:shadow-gray-900
                    bg-white border-gray-300 text-gray-900 shadow-gray-200
                    animate-fade-in"
                >
                    {includeAllOption && (
                        <li
                            onClick={() => {
                                onChange(null);
                                setIsOpen(false);
                            }}
                            className="px-4 py-2 text-sm flex items-center justify-between cursor-pointer
                                       dark:hover:bg-gray-800 hover:bg-gray-100 transition"
                        >
                            All
                            {value === null && <FaCheck />}
                        </li>
                    )}

                    {options.map((option) => (
                        <li
                            key={option}
                            onClick={() => {
                                onChange(option);
                                setIsOpen(false);
                            }}
                            className="px-4 py-2 text-sm flex items-center justify-between cursor-pointer
                                       dark:hover:bg-gray-800 hover:bg-gray-100 transition"
                        >
                            {option}
                            {value === option && <FaCheck />}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}