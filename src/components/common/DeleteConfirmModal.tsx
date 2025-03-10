import { Dialog } from "@headlessui/react";

interface DeleteConfirmModalProps {
    isOpen: boolean;
    itemId: string | null;
    onClose: () => void;
    onConfirm: (itemId: string) => void;
}

export default function DeleteConfirmModal({ isOpen, itemId, onClose, onConfirm }: DeleteConfirmModalProps) {
    return (
        <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
            <div className="bg-white rounded-lg shadow-lg w-80 p-6">
                <h2 className="text-lg font-semibold text-gray-800 text-center">Delete Confirmation</h2>
                <p className="text-sm text-gray-600 mt-2 text-center">
                    Are you sure you want to delete this? This action cannot be undone.
                </p>

                <div className="mt-4 border-t border-gray-300">
                    <button
                        onClick={() => itemId && onConfirm(itemId)}
                        className="w-full py-3 text-red-600 font-medium text-center hover:bg-gray-100"
                    >
                        Delete
                    </button>
                </div>
                
                <div className="border-t border-gray-300">
                    <button
                        onClick={onClose}
                        className="w-full py-3 text-blue-600 font-medium text-center hover:bg-gray-100"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </Dialog>
    );
}