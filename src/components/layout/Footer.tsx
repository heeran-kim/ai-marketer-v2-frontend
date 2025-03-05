"use client";

import { useEffect, useState } from "react";
import { FaTwitter, FaFacebookF, FaLinkedinIn, FaArrowUp, FaSun, FaMoon } from "react-icons/fa";
import { useAuth } from "@/components/auth/AuthProvider";

export default function Footer() {
    const { user } = useAuth();
    const [isDark, setIsDark] = useState(false);
    const [showScrollButton, setShowScrollButton] = useState(false);

    useEffect(() => {
        setIsDark(document.documentElement.classList.contains("dark"));

        const handleScroll = () => {
            setShowScrollButton(window.scrollY > 300);
        };
        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    // 다크모드 토글 함수
    const toggleDarkMode = () => {
        document.documentElement.classList.toggle("dark");
        setIsDark(!isDark);
    };

    // 맨 위로 가기 함수
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <footer
            className={`py-12 relative transition-colors duration-300 dark:bg-neutral-900 text-black dark:text-gray-300
                ${user ? "bg-white" : "bg-gray-50"}`}
        >
            <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-4 gap-6">
                <div>
                    <h3 className="text-lg font-semibold">Promoease</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        AI-powered marketing automation platform.
                    </p>
                </div>
                <div>
                    <h3 className="text-lg font-semibold">Resources</h3>
                    <ul className="text-sm">
                        <li><a href="#" className="hover:underline">Docs</a></li>
                        <li><a href="#" className="hover:underline">Blog</a></li>
                        <li><a href="#" className="hover:underline">Support</a></li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-lg font-semibold">Company</h3>
                    <ul className="text-sm">
                        <li><a href="#" className="hover:underline">About</a></li>
                        <li><a href="#" className="hover:underline">Careers</a></li>
                        <li><a href="#" className="hover:underline">Contact</a></li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-lg font-semibold">Social</h3>
                    <div className="flex gap-4 mt-2">
                        <a href="#" className="text-xl hover:text-blue-400"><FaTwitter /></a>
                        <a href="#" className="text-xl hover:text-blue-600"><FaFacebookF /></a>
                        <a href="#" className="text-xl hover:text-blue-500"><FaLinkedinIn /></a>
                    </div>
                </div>
            </div>

            {/* 다크모드 토글 버튼 */}
            <button
                onClick={toggleDarkMode}
                className="absolute bottom-6 left-6 p-3 bg-gray-300 dark:bg-gray-700 text-black dark:text-white rounded-full shadow-lg transition hover:scale-110">
                {isDark ? <FaSun className="text-yellow-500" /> : <FaMoon className="text-blue-500" />}
            </button>

            {/* 맨 위로 가기 버튼 (스크롤 시 표시) */}
            {showScrollButton && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-6 right-6 p-3 bg-indigo-600 text-white rounded-full shadow-lg transition hover:scale-110">
                    <FaArrowUp />
                </button>
            )}

            <div className="text-center text-sm mt-10">
                © 2025 Promoease. All rights reserved.
            </div>
        </footer>
    );
}