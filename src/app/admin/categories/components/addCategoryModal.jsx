"use client";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

export default function AddCategoryModal({ onClose, onSuccess }) {
    const [category, setCategory] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const BASE_API = process.env.NEXT_PUBLIC_BASE_API;

    const handleAddCategory = async () => {
        if (!category.trim()) {
            toast.error("Please input a category name.");
            return;
        }

        setIsLoading(true);

        try {
            const token = localStorage.getItem('token') ||
                localStorage.getItem('accessToken') ||
                localStorage.getItem('auth_token');

            if (!token) {
                toast.error("Authentication required. Please login first.");
                return;
            }

            const response = await axios.post(
                `${BASE_API}/categories`,
                {
                    name: category.trim()
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    }
                }
            );

            toast.success("Category added successfully!");

            setCategory("");

            if (onSuccess) {
                onSuccess();
            }

            setTimeout(() => {
                onClose();
            }, 1000);

            console.log(response.status)

        } catch (error) {
            console.error("Error adding category:", error);

            if (error.response) {
                const status = error.response.status;
                const errorMessage = error.response.data?.message ||
                    error.response.data?.error ||
                    error.response.data;

                if (status === 401 || status === 403) {
                    toast.error("Authentication failed. Please login again.");
                } else if (status === 422) {
                    toast.error("Invalid data. Please check your input.");
                } else {
                    toast.error(typeof errorMessage === 'string' ? errorMessage : `Failed to add category. Status: ${status}`);
                }
            } else if (error.request) {
                toast.error("Network error. Please check your connection.");
            } else {
                toast.error("An unexpected error occurred.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleAddCategory();
        }
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <div
                className="fixed inset-0 bg-black/40 bg-opacity-30 flex items-center justify-center z-50"
                onClick={handleOverlayClick}
            >
                <div className="bg-white rounded-xl p-6 w-[90%] max-w-md shadow-lg">
                    <h2 className="text-lg font-medium mb-4">Add New Category</h2>

                    <input
                        type="text"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Input category name"
                        className="w-full border border-gray-200 outline-none px-4 py-2 rounded-md mb-4 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        disabled={isLoading}
                        autoFocus
                    />

                    <div className="flex justify-end gap-2">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 cursor-pointer rounded-md border border-gray-200 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleAddCategory}
                            className="px-4 py-2 cursor-pointer rounded-md bg-blue-500 text-white hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center gap-2"
                            disabled={isLoading}
                        >
                            {isLoading && (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            )}
                            {isLoading ? 'Adding...' : 'Add Category'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}