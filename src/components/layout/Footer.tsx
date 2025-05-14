"use client";

import { useEffect, useState } from "react";
import {
  FaTwitter,
  FaFacebookF,
  FaLinkedinIn,
  FaArrowUp,
} from "react-icons/fa";
import { useAuth } from "@/components/auth/AuthProvider";

export default function Footer() {
  const { authState } = useAuth();
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollButton(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      className={`py-12 relative transition-colors duration-300 text-black
                ${
                  authState.status === "authenticated"
                    ? "bg-white"
                    : "bg-gray-50"
                }`}
    >
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-6">
        <div>
          <h3 className="text-lg font-semibold">AKA Studio</h3>
          <p className="text-sm text-gray-500">
            AI-powered marketing automation platform.
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Company</h3>
          <ul className="text-sm">
            <li>
              <a href="#" className="hover:underline">
                About
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Careers
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Contact
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Social</h3>
          <div className="flex gap-4 mt-2">
            <a href="#" className="text-xl hover:text-blue-400">
              <FaTwitter />
            </a>
            <a href="#" className="text-xl hover:text-blue-600">
              <FaFacebookF />
            </a>
            <a href="#" className="text-xl hover:text-blue-500">
              <FaLinkedinIn />
            </a>
          </div>
        </div>
      </div>

      {showScrollButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 bg-indigo-600 text-white rounded-full shadow-lg transition hover:scale-110"
        >
          <FaArrowUp />
        </button>
      )}

      <div className="text-center text-sm mt-10">
        © 2025 AKA Studio. All rights reserved.
      </div>
    </footer>
  );
}
