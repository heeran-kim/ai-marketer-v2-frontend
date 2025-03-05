"use client";

export default function Modal({ isOpen, children }: { isOpen: boolean; onClose: () => void; children: React.ReactNode }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white w-[430px] h-[600px] max-w-md p-2 rounded-lg shadow-lg relative overflow-y-auto">
                {children}
            </div>
        </div>
    );
}