"use client";
import Link from "next/link";
import Image from "next/image";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center">
      <Image
        src="/AKA.png"
        alt="Logo"
        width={80}
        height={40}
        className="w-[80px] h-auto"
        priority
      />
    </Link>
  );
}
