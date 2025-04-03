"use client";
import Link from "next/link";
import Image from "next/image";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center">
      <Image
        src="/aka.png"
        alt="Logo"
        width="0" // Set width to 0 to let Next.js handle image size with CSS
        height="0" // Set height to 0 to allow CSS to control the size
        className="w-[80px] h-auto" // Use Tailwind CSS to set width to 80px and maintain aspect ratio with auto height
        priority // Added priority to optimize LCP
      />
    </Link>
  );
}
