// src/app/settings/layout.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";
import SettingsSidebar from "./components/SettingsSidebar";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Start with a safe initial state that matches server rendering
  const [isDesktop, setIsDesktop] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Use useEffect to update isDesktop after component mounts (client-side only)
  useEffect(() => {
    setMounted(true);
    const checkIfDesktop = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    // Initial check
    checkIfDesktop();

    // Update on resize
    window.addEventListener("resize", checkIfDesktop);
    return () => window.removeEventListener("resize", checkIfDesktop);
  }, []);

  // Render the initial state that matches the server until mounted
  if (!mounted) {
    return (
      <div className="bg-gray-50 px-6 py-6">
        <div className="max-w-7xl mx-auto flex flex-row">
          <div className="flex-1">{children}</div>
        </div>
      </div>
    );
  }

  return (
    <>
      {!isDesktop && pathname !== "/settings" && (
        <button
          onClick={() => router.push("/settings")}
          className="flex items-center px-6 py-4 gap-2 border-b border-gray-300 text-gray-700 hover:text-black w-full"
        >
          <FaArrowLeft size={18} />
          <span>Settings</span>
        </button>
      )}
      <div className="bg-gray-50 px-6 py-6">
        <div className="max-w-7xl mx-auto flex flex-row">
          {isDesktop && (
            <div className="sticky top-20 self-start">
              <SettingsSidebar />
            </div>
          )}
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </>
  );
}
