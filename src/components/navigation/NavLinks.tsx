"use client";

import { useState, useRef } from "react";
import ProductsDropdown from "@/components/navigation/ProductsDropdown";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { flexRowClass, dropdownNavItemClass } from "@/components/styles";

export default function NavLinks() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownTimeout = useRef<NodeJS.Timeout | null>(null);

    const handleMouseEnter = () => {
        if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
        setIsDropdownOpen(true);
    };

    const handleMouseLeave = () => {
        dropdownTimeout.current = setTimeout(() => {
            setIsDropdownOpen(false);
        }, 300);
    };

    return (
        <div className={`${flexRowClass}`}>
            {/* Products Dropdown (Keeps Active State While Open) */}
            <div className="relative group" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <button className={dropdownNavItemClass(isDropdownOpen)}>
                    <span>Features</span>
                    {isDropdownOpen ? <FaChevronUp size={14} className="ml-1" /> : <FaChevronDown size={14} className="ml-1" />}
                </button>

                {isDropdownOpen && (
                    <div className="absolute left-0 top-full z-10">
                        <ProductsDropdown />
                    </div>
                )}
            </div>
        </div>
    );
}