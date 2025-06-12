'use client';
import { Dialog } from '@headlessui/react';

export default function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title = "Are you sure?",
    description = "Do you really want to proceed?"
}) {
    return (
        <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="fixed inset-0 bg-black opacity-50" aria-hidden="true" />

            <div className="relative bg-white rounded-lg p-6 max-w-sm w-full shadow-xl z-50">
                <Dialog.Title className="text-lg font-semibold">{title}</Dialog.Title>
                <Dialog.Description className="mt-2 text-gray-600">{description}</Dialog.Description>

                <div className="mt-4 flex justify-end space-x-2">
                    <button onClick={onClose} className="px-4 py-2 rounded-md border border-gray-200 hover:bg-gray-100 text-sm cursor-pointer">Cancel</button>
                    <button onClick={onConfirm} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm cursor-pointer">Logout</button>
                </div>
            </div>
        </Dialog>
    );
}
