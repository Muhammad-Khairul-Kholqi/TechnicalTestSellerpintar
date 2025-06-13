"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Cookies from 'js-cookie';

export default function EditCategoryModal({ category, onClose, onSuccess }) {
    const [name, setName] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const BASE_API = process.env.NEXT_PUBLIC_BASE_API;

    const getAuthToken = () => {
        return Cookies.get('token') ||
            localStorage.getItem('token') ||
            localStorage.getItem('accessToken') ||
            localStorage.getItem('auth_token');
    };

    const handleAuthError = () => {
        Cookies.remove('token');
        localStorage.removeItem('token');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('auth_token');

        toast.error("Session expired. Please login again.");

        setTimeout(() => {
            window.location.href = '/';
        }, 2000);
    };

    useEffect(() => {
        if (category) {
            setName(category.name || "");
        }
    }, [category]);

    const handleEditCategory = async () => {

        if (!name.trim()) {
            toast.error("Please input a category name.");
            return;
        }

        if (name.trim() === category?.name) {
            toast.info("No changes detected.");
            return;
        }

        const categoryId = category?.id || category?._id || category?.categoryId;

        if (!categoryId) {
            console.error("Category object:", category);
            toast.error("Category ID is missing. Please try refreshing the page.");
            return;
        }

        setIsLoading(true);

        try {
            const token = getAuthToken();

            if (!token) {
                handleAuthError();
                return;
            }

            const response = await axios.put(
                `${BASE_API}/categories/${categoryId}`,
                {
                    name: name.trim()
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    }
                }
            );

            toast.success("Category updated successfully!");

            if (onSuccess) {
                onSuccess();
            }

        } catch (error) {
            console.error("Error updating category:", error);

            if (error.response) {
                const status = error.response.status;
                const errorMessage = error.response.data?.message ||
                    error.response.data?.error ||
                    error.response.data;

                if (status === 401 || status === 403) {
                    toast.error("Authentication failed. Please login again.");
                } else if (status === 404) {
                    toast.error("Category not found.");
                } else if (status === 422) {
                    toast.error("Invalid data. Please check your input.");
                } else if (status === 409) {
                    toast.error("Category name already exists.");
                } else {
                    toast.error(typeof errorMessage === 'string' ? errorMessage : `Failed to update category. Status: ${status}`);
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
            handleEditCategory();
        }
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleCancel = () => {
        if (category) {
            setName(category.name || "");
        }
        onClose();
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
                    <h2 className="text-lg font-semibold mb-4">Edit Category</h2>

                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Category name"
                        className="w-full border border-gray-200 outline-none px-4 py-2 rounded-md mb-4 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        disabled={isLoading}
                        autoFocus
                    />

                    <div className="flex justify-end gap-2">
                        <button
                            onClick={handleCancel}
                            className="px-4 py-2 cursor-pointer rounded-md border border-gray-200 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleEditCategory}
                            className="px-4 py-2 cursor-pointer rounded-md bg-blue-500 text-white hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center gap-2"
                            disabled={isLoading}
                        >
                            {isLoading && (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            )}
                            {isLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}