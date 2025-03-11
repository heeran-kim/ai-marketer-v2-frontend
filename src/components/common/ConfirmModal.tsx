import { Dialog } from "@headlessui/react";

interface ConfirmModalProps {
    isOpen: boolean;
    message: string;
    onConfirm: () => void;
    onClose: () => void;
}

export default function ConfirmModal({ isOpen, message, onConfirm, onClose }: ConfirmModalProps) {
    return (
        <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
            <div className="bg-white rounded-lg shadow-lg w-80 p-3">
                <h2 className="text-md font-semibold text-gray-800 text-center">Confirmation</h2>
                <p className="text-sm text-gray-600 mt-2 text-center">{message}</p>

                <div className="mt-4 border-t border-gray-300">
                    <button
                        onClick={onConfirm}
                        className="w-full py-2 text-blue-600 font-medium text-center text-md hover:bg-gray-100"
                    >
                        Continue
                    </button>
                </div>

                <div className="border-t border-gray-300">
                    <button
                        onClick={onClose}
                        className="w-full py-2 text-gray-600 font-medium text-center text-md hover:bg-gray-100"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </Dialog>
    );
}