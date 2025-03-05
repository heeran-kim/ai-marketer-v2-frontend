"use client";
import { useEffect, useState } from "react";

export default function DarkModeToggle() {
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        if (localStorage.getItem("theme") === "dark") {
            document.documentElement.classList.add("dark");
            setDarkMode(true);
        }
    }, []);

    const toggleDarkMode = () => {
        if (darkMode) {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        } else {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        }
        setDarkMode(!darkMode);
    };

    return (
        <button onClick={toggleDarkMode} className="fixed bottom-6 right-6 bg-gray-200 dark:bg-gray-800 
            text-black dark:text-white rounded-full p-5 shadow-lg hover:scale-110 transition-transform duration-200">
            {darkMode ? "☀️" : "🌙"}
        </button>
    );
}