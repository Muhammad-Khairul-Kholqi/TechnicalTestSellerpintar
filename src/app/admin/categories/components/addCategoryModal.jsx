"use client";
export default function AddCategoryModal({ onClose }) {
    return (
        <div className="fixed inset-0 bg-black/40 bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-[90%] max-w-md shadow-lg">
                <h2 className="text-lg font-medium mb-4">Add New Category</h2>
                <input
                    type="text"
                    placeholder="Input category"
                    className="w-full border border-gray-200 outline-none px-4 py-2 rounded-md mb-4"
                />
                <div className="flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 cursor-pointer rounded-md border border-gray-200 hover:bg-gray-100">
                        Cancel
                    </button>
                    <button className="px-4 py-2 cursor-pointer rounded-md bg-blue-500 text-white hover:bg-blue-600">
                        Add Category
                    </button>
                </div>
            </div>
        </div>
    );
}
