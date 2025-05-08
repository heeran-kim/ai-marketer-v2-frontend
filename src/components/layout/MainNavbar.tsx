// src/components/layout/MainNavbar.tsx
"use client";

import Logo from "@/components/navigation/Logo";
import AuthButtons from "@/components/navigation/AuthButtons";

export default function MainNavbar() {
  return (
    <div className="left-0 w-full">
      <div className="flex justify-between items-center max-w-7xl mx-auto px-6 py-2 h-14">
        <Logo />
        <AuthButtons />
      </div>
    </div>
  );
}
