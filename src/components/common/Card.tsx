"use client";

import { ReactNode } from "react";

interface CardProps {
    id?: string;
    title: string;
    description: ReactNode;
    children: ReactNode;
    restriction?: string;
    showButton?: boolean;
    buttonText?: string;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void; 
    buttonDisabled?: boolean;
}

export default function Card({
    id,
    title,
    description,
    children,
    restriction,
    showButton = true,
    buttonText = 'Save',
    onClick,
    buttonDisabled = false,
}: CardProps) {
    return (
        <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-600 rounded-lg shadow-md space-y-4">
            <div className="p-6">
                <div className="space-y-2">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{title}</h2>
                    <div className="text-gray-600 text-sm dark:text-gray-400">{description}</div>
                </div>

                <div className="mt-4">{children}</div>
            </div>

            {(restriction || showButton)  && (
                <div className="bg-gray-100 dark:bg-gray-800 px-4 py-3 flex items-center justify-between rounded-b-lg min-h-[48px]">
                    <p className="text-xs text-gray-500 dark:text-gray-400">{restriction}</p>
                    {showButton ? (
                        <button
                            id={id}
                            className="px-4 py-1.5 text-sm font-medium bg-black text-white rounded-md hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-300"
                            onClick={onClick}
                            disabled={buttonDisabled}
                        >
                            {buttonText}
                        </button>
                    ) : (
                        <div className="w-[75px]"></div>
                    )}
                </div>
            )}
        </div>
    );
}