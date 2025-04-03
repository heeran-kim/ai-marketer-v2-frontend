"use client";
import Link from "next/link";
import Image from "next/image";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center">
      <Image
        src="/aka.png"
        alt="AI Marketer Logo"
        width={80}
        height={80}
        className="mr-2"
        priority // Added priority to optimize LCP
      />
    </Link>
  );
}
