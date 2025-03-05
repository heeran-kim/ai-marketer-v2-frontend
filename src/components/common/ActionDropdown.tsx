// src/components/common/ActionDropdown.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { HiDotsHorizontal } from "react-icons/hi";
import { Action } from "@/app/types/nav";

interface ActionDropdownProps {
    actions: Action[];
}

export default function ActionDropdown({ actions }: (ActionDropdownProps)) {
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

    return (
        <div className="relative text-xs">
            <button
                ref={buttonRef}
                onClick={(e) => {
                    e.stopPropagation();
                    setOpen((prev) => !prev);
                }}
                className="absolute top-1/2 right-2 p-2 rounded-lg hover:bg-gray-200 transition"
            >
                <HiDotsHorizontal className="text-gray-600" size={14} />
            </button>

            {open && (
                <div
                    ref={dropdownRef}
                    className="absolute top-10 right-0 min-w-[120px] bg-white shadow-lg border rounded-xl z-50 p-1"
                >
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