"use client";

export default function Modal({ isOpen, children }: { isOpen: boolean; onClose: () => void; children: React.ReactNode }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-2 rounded-lg w-[430px] h-[600px] max-w-md shadow-lg relative">
                {children}
            </div>
        </div>
    );
}