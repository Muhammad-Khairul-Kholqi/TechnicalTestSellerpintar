"use client";
import { useEffect, useState } from "react";
import axios from 'axios';
import { Search, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import AddCategoryModal from "@/app/admin/categories/components/addCategoryModal";
import EditCategoryModal from "@/app/admin/categories/components/editCategoryModal";
import ConfirmModal from "@/app/utils/alert/confirmModal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Cookies from 'js-cookie'; 

export default function CategoriesPage() {
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [editCategory, setEditCategory] = useState(null);
    const [deleteCategory, setDeleteCategory] = useState(null);
    const [categories, setCategories] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCategories, setTotalCategories] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    const itemsPerPage = 10;
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

    const fetchCategories = async () => {
        try {
            const token = getAuthToken();

            if (!token) {
                handleAuthError();
                return;
            }

            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            };

            const response = await axios.get(`${BASE_API}/categories`, {
                headers: headers
            });
            const data = response.data;

            const categoriesData = data.category || data.data || [];
            const total = data.total || data.totalCount || categoriesData.length;

            setCategories(categoriesData);
            setFilteredCategories(categoriesData);
            setTotalCategories(total);
        } catch (error) {
            console.error("Error fetching categories:", error);

            if (error.response?.status === 401) {
                handleAuthError();
            } else {
                toast.error("Failed to fetch categories. Please try again.");
            }
        }
    };

    const logout = () => {
        Cookies.remove('token');
        localStorage.removeItem('token');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('auth_token');

        window.location.href = '/';
    };

    const deleteCategoryData = async (categoryId) => {
        try {
            setIsDeleting(true);

            const token = getAuthToken();

            if (!token) {
                toast.error("Authentication token missing. Redirecting to login...");
                handleAuthError();
                return;
            }

            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            };

            const response = await axios.delete(`${BASE_API}/categories/${categoryId}`, {
                headers: headers
            });

            await fetchCategories();

            toast.success("Category deleted successfully!");

        } catch (error) {
            console.error("Error deleting category:", error);

            if (error.response?.status === 401) {
                handleAuthError();
            } else if (error.response?.status === 404) {
                toast.error("Category not found.");
            } else if (error.response?.status === 403) {
                toast.error("You don't have permission to delete this category.");
            } else {
                toast.error("Failed to delete category. Please try again.");
            }
        } finally {
            setIsDeleting(false);
            setShowDeleteModal(false);
            setDeleteCategory(null);
        }
    };

    useEffect(() => {
        const token = getAuthToken();
        if (!token) {
            handleAuthError();
            return;
        }

        fetchCategories();
    }, []);

    useEffect(() => {
        if (searchQuery.trim() === "") {
            setFilteredCategories(categories);
        } else {
            const filtered = categories.filter(category =>
                category.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredCategories(filtered);
        }
        setCurrentPage(1);
    }, [searchQuery, categories]);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'Invalid Date';
        }
    };

    const handleEditClick = (category) => {
        setEditCategory(category);
        setShowEditModal(true);
    };

    const handleDeleteClick = (category) => {
        setDeleteCategory(category);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = () => {
        if (deleteCategory) {
            deleteCategoryData(deleteCategory.id);
        }
    };

    const handleDeleteCancel = () => {
        setShowDeleteModal(false);
        setDeleteCategory(null);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentCategories = filteredCategories.slice(startIndex, endIndex);

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
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

            <div className="bg-white border border-gray-200 rounded-xl">
                <div className="p-5">
                    <h2 className="font-medium">Total Category: {totalCategories}</h2>
                </div>

                <hr className="border-0.5 border-gray-100" />

                <div className="px-5 pt-5 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div className="flex items-center bg-white border border-gray-200 px-3 py-2 rounded-md w-full lg:max-w-[300px] md:max-w-[300px]">
                        <Search className="text-gray-600 h-4 w-4 mr-2" />
                        <input
                            type="text"
                            placeholder="Search by category"
                            className="bg-transparent outline-none w-full text-gray-800"
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                    </div>

                    <button
                        className="w-full cursor-pointer md:w-auto flex items-center justify-center gap-3 bg-blue-500 hover:bg-blue-600 text-white rounded-md py-2 px-5"
                        onClick={() => setShowAddModal(true)}
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Category</span>
                    </button>
                </div>

                <div className="relative overflow-x-auto pt-5">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-700 bg-[#F3F4F6]">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    No
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Category
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Created at
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody className="text-xs">
                            {currentCategories.length > 0 ? (
                                currentCategories.map((category, index) => (
                                    <tr className="border-b border-gray-200" key={category.id || index}>
                                        <td scope="row" className="px-6 py-4">
                                            {startIndex + index + 1}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {category.name}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {formatDate(category.createdAt)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-start gap-3 h-full">
                                                <button
                                                    onClick={() => handleEditClick(category)}
                                                    className="text-blue-500 hover:text-blue-600 hover:underline cursor-pointer"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(category)}
                                                    disabled={isDeleting}
                                                    className="text-red-500 hover:text-red-600 hover:underline cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {isDeleting && deleteCategory?.id === category.id ? 'Deleting...' : 'Delete'}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                                        {searchQuery ? "No categories found matching your search." : "No categories available."}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {filteredCategories.length > 0 && (
                    <div className="flex items-center justify-start gap-5 p-5">
                        <div
                            className={`flex items-center gap-2 cursor-pointer ${currentPage === 1
                                ? 'text-gray-400 cursor-not-allowed'
                                : 'text-gray-700 hover:text-black'
                                }`}
                            onClick={handlePreviousPage}
                        >
                            <ChevronLeft className="w-4 h-4" />
                            <span>Previous</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-gray-600">
                                Page {currentPage} of {totalPages}
                            </span>
                        </div>

                        <div
                            className={`flex items-center gap-2 cursor-pointer ${currentPage === totalPages
                                ? 'text-gray-400 cursor-not-allowed'
                                : 'text-gray-700 hover:text-black'
                                }`}
                            onClick={handleNextPage}
                        >
                            <span>Next</span>
                            <ChevronRight className="w-4 h-4" />
                        </div>
                    </div>
                )}
            </div>

            {showAddModal && (
                <AddCategoryModal
                    onClose={() => setShowAddModal(false)}
                    onSuccess={fetchCategories} 
                />
            )}

            {showEditModal && (
                <EditCategoryModal
                    category={editCategory}
                    onClose={() => setShowEditModal(false)}
                    onSuccess={() => {
                        fetchCategories();
                        setShowEditModal(false);
                    }}
                />
            )}

            {showDeleteModal && (
                <ConfirmModal
                    isOpen={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={handleDeleteConfirm}
                    title="Confirm Delete"
                    description="Are you sure you want to delete this category?"
                />
            )}

            <ConfirmModal
                isOpen={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                onConfirm={() => {
                    setShowLogoutModal(false);
                    logout();
                }}
                title="Confirm Logout"
                description="Are you sure you want to logout?"
            />
        </>
    );
}