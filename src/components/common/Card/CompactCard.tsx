"use client";

export default function CompactCard({ title, description, children }: { title?: string; description?: string; children: React.ReactNode }) {
    return (
        <div className="border w-full border-gray-200 rounded-md bg-white dark:bg-gray-800 p-3 shadow-sm">
            {title && <h3 className="text-sm font-semibold text-gray-700 dark:text-white">{title}</h3>}
            {description && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{description}</p>}
            <div className="mt-2">{children}</div>
        </div>
    );
}