import { useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";

interface SuccessModalProps {
    isOpen: boolean;
    message: string;
    onClose: () => void;
    duration?: number;
}

export default function SuccessModal({ isOpen, message, onClose, duration = 1500 }: SuccessModalProps) {
    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(onClose, duration);
            return () => clearTimeout(timer);
        }
    }, [isOpen, duration, onClose]);

    return (
        <Transition
            show={isOpen}
            enter="transition-opacity duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
        >
            <Dialog open={isOpen} onClose={onClose} className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50">
                <div className="bg-black bg-opacity-90 text-white px-6 py-3 w-[300px] text-center text-sm font-medium tracking-wide border border-gray-700 shadow-md">
                    {message}
                </div>
            </Dialog>
        </Transition>
    );
}