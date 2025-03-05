// src/components/common/Header.tsx
"use client";

import { useRouter } from "next/navigation";
import ActionDropdown from "./ActionDropdown";
import { FaArrowLeft, FaPlus } from "react-icons/fa";
import { HeaderProps } from "@/app/types/nav";


export default function Header({ title, description, createAction, moreActions, backTo }: HeaderProps) {
    const router = useRouter();
    return (
        <div className="border-b border-gray-300 dark:border-gray-700 px-6 py-8">
            {backTo && (
                <div className="relative text-xs">
                    <button
                        onClick={() => router.push(backTo)}
                        className="absolute top-1/2 right-2 p-2 rounded-lg hover:bg-gray-200 transition"
                    >
                        <FaArrowLeft className="text-gray-600" size={14} />
                    </button>
                </div>
            )}

            {createAction && (
                <div className="relative text-xs">
                    <button
                        onClick={createAction(router)?.onClick}
                        className="absolute top-1/2 right-10 p-2 rounded-lg hover:bg-gray-200 transition"
                    >
                        <FaPlus className="text-gray-600" size={14} />
                    </button>
                </div>
            )}

            {moreActions && (
                <ActionDropdown actions={moreActions(router) ?? []} />
            )}

            
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
                {title}
            </h1>

            {description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 whitespace-pre-wrap">
                    {description.split("**").map((part, index) =>
                        index % 2 === 1 ? (
                            <strong key={index} className="text-black dark:text-white">{part}</strong>
                        ) : (
                            part
                        )
                    )}
                </p>
            )}
        </div>
    );
}