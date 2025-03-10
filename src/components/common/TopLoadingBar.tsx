"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function TopLoadingBar({ isLoading }: { isLoading: boolean }) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (isLoading) {
            setProgress(0);
            const interval = setInterval(() => {
                setProgress((prev) => (prev < 95 ? prev + 10 : prev));
            }, 300);
            return () => clearInterval(interval);
        } else {
            setProgress(100);
            setTimeout(() => setProgress(0), 500);
        }
    }, [isLoading]);

    return (
        <motion.div
            className="h-1 bg-gray-200 z-40"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: "easeOut", duration: 0.5 }}
        />
    );
}