"use client";
import { useEffect, useState, useRef } from "react";
import axios from 'axios';
import { ChevronDown, Search, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import ImageDummy from "@/app/assets/offc-image.jpg";
import ConfirmModal from "@/app/utils/alert/confirmModal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Cookies from 'js-cookie';

export default function ArticlePage() {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [categories, setCategories] = useState(["All"]);
    const [allArticles, setAllArticles] = useState([]);
    const [filteredArticles, setFilteredArticles] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalArticles, setTotalArticles] = useState(0);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteArticle, setDeleteArticle] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    const itemsPerPage = 10;
    const BASE_API = process.env.NEXT_PUBLIC_BASE_API;
    const searchTimer = useRef(null);

    const getAuthToken = () => {
        const token = Cookies.get('token') ||
            localStorage.getItem('token') ||
            localStorage.getItem('accessToken') ||
            localStorage.getItem('auth_token');

        return token;
    };

    const getAuthHeaders = () => {
        const token = getAuthToken();
        if (!token) {
            console.warn('No authentication token found');
            return {};
        }

        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    };

    const handleAuthError = () => {
        console.error("Authentication failed - clearing tokens and redirecting");
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
            const headers = getAuthHeaders();
            const response = await axios.get(`${BASE_API}/categories`, {
                headers: headers
            });

            const categoriesData = response.data.categories || response.data.data || [];
            const categoryNames = ["All", ...categoriesData.map(cat => cat.name || cat)];
            setCategories(categoryNames);
        } catch (error) {
            console.error("Error fetching categories:", error);
            setCategories(["All"]);
        }
    };

    const fetchArticles = async () => {
        try {
            setIsLoading(true);
            const headers = getAuthHeaders();
            const response = await axios.get(`${BASE_API}/articles`, {
                headers: headers
            });

            const data = response.data;
            const articlesData = data.articles || data.data || [];

            setAllArticles(articlesData);
            setFilteredArticles(articlesData);
            setTotalArticles(articlesData.length);
            setTotalPages(Math.ceil(articlesData.length / itemsPerPage));

        } catch (error) {
            console.error("Error fetching articles:", error);

            if (error.response?.status === 401) {
                handleAuthError();
            } else {
                toast.error("Failed to fetch articles. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

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

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        setCurrentPage(1);
        setDropdownOpen(false);
        applyFilters(category, searchTerm);
    };

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (searchTimer.current) {
            clearTimeout(searchTimer.current);
        }

        searchTimer.current = setTimeout(() => {
            setCurrentPage(1);
            applyFilters(selectedCategory, value);
        }, 300);
    };

    const applyFilters = (category, search) => {
        let result = [...allArticles];

        if (category !== "All") {
            result = result.filter(article =>
                article.category?.name?.toLowerCase() === category.toLowerCase()
            );
        }

        if (search.trim()) {
            const searchLower = search.toLowerCase();
            result = result.filter(article =>
                article.title?.toLowerCase().includes(searchLower)
            );
        }

        setFilteredArticles(result);
        setTotalArticles(result.length);
        setTotalPages(Math.ceil(result.length / itemsPerPage));
    };

    const handleDeleteConfirm = () => {
        if (deleteArticle) {
            deleteArticleData(deleteArticle.id);
        }
    };

    const handleDeleteClick = (article) => {
        setDeleteArticle(article);
        setShowDeleteModal(true);
    };

    const handleDeleteCancel = () => {
        setShowDeleteModal(false);
        setDeleteArticle(null);
    };

    const deleteArticleData = async (articleId) => {
        try {
            setIsDeleting(true);
            const token = getAuthToken();

            if (!token) {
                toast.error("Authentication token missing. Redirecting to login...");
                handleAuthError();
                return;
            }

            const headers = getAuthHeaders();

            await axios.delete(`${BASE_API}/articles/${articleId}`, {
                headers: headers
            });

            await fetchArticles();
            toast.success("Article deleted successfully!");

        } catch (error) {
            console.error("Error deleting Article:", error);

            if (error.response?.status === 401) {
                handleAuthError();
            } else if (error.response?.status === 404) {
                toast.error("Article not found.");
            } else if (error.response?.status === 403) {
                toast.error("You don't have permission to delete this article.");
            } else {
                toast.error("Failed to delete article. Please try again.");
            }
        } finally {
            setIsDeleting(false);
            setShowDeleteModal(false);
            setDeleteArticle(null);
        }
    };

    useEffect(() => {
        const token = getAuthToken();
        if (!token) {
            console.warn('No auth token found, redirecting to login');
            handleAuthError();
            return;
        }

        fetchCategories();
        fetchArticles();

        return () => {
            if (searchTimer.current) {
                clearTimeout(searchTimer.current);
            }
        };
    }, []);
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentArticles = filteredArticles.slice(startIndex, endIndex);

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
                    <h2 className="font-medium">Total Article: {totalArticles}</h2>
                </div>

                <hr className="border-0.5 border-gray-100" />

                <div className="px-5 pt-5 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div className="flex flex-col sm:flex-row gap-4 w-full md:max-w-[500px]">
                        <div className="relative w-full sm:max-w-[200px]">
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="w-full cursor-pointer px-3 py-2 bg-white border border-gray-200 text-gray-800 rounded-md flex justify-between items-center"
                            >
                                <span>{selectedCategory}</span>
                                <ChevronDown
                                    className={`h-4 w-4 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                                />
                            </button>

                            {dropdownOpen && (
                                <div className="absolute top-full left-0 w-full mt-1 z-10 rounded-md shadow-md bg-white overflow-hidden">
                                    <div className="max-h-[200px] overflow-y-auto scrollbar-hide">
                                        <ul className="text-gray-800 p-2 space-y-1">
                                            {categories.map((category) => (
                                                <li
                                                    key={category}
                                                    className="px-4 py-2 hover:bg-blue-100 rounded-md cursor-pointer"
                                                    onClick={() => handleCategoryChange(category)}
                                                >
                                                    {category}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center bg-white border border-gray-200 px-3 py-2 rounded-md w-full">
                            <Search className="text-gray-600 h-4 w-4 mr-2" />
                            <input
                                type="text"
                                placeholder="Search by title"
                                value={searchTerm}
                                onChange={handleSearch}
                                className="bg-transparent outline-none w-full text-gray-800"
                            />
                        </div>
                    </div>

                    <a href="/admin/articles/add" className="w-full cursor-pointer md:w-auto flex items-center justify-center gap-3 bg-blue-500 hover:bg-blue-600 text-white rounded-md py-2 px-5">
                        <Plus className="w-4 h-4" />
                        <span>Add Article</span>
                    </a>
                </div>

                <div className="relative overflow-x-auto pt-5">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-700 bg-[#F3F4F6]">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    No
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Thumbnails
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Title
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
                            {isLoading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                        Loading articles...
                                    </td>
                                </tr>
                            ) : currentArticles.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                        {searchTerm || selectedCategory !== "All"
                                            ? "No articles found matching your filters."
                                            : "No articles available."}
                                    </td>
                                </tr>
                            ) : (
                                currentArticles.map((article, index) => (
                                    <tr key={article.id || index} className="border-b border-gray-200">
                                        <td scope="row" className="px-6 py-4">
                                            {startIndex + index + 1}
                                        </td>
                                        <td scope="row" className="px-6 py-4">
                                            <img
                                                src={article.imageUrl || ImageDummy.src}
                                                alt={article.title || "Article thumbnail"}
                                                className="w-full max-w-[100px] h-full rounded-sm group-hover:scale-105 duration-300"
                                                onError={(e) => {
                                                    e.target.src = ImageDummy.src;
                                                }}
                                            />
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {article.title || 'Untitled'}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {article.category?.name || 'Uncategorized'}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {formatDate(article.createdAt)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-3 h-full">
                                                <a
                                                    href={`/admin/articles/preview/${article.id}`}
                                                    className="text-blue-500 hover:text-blue-600 hover:underline"
                                                >
                                                    Preview
                                                </a>
                                                <a
                                                    href={`/admin/articles/edit/${article.id}`}
                                                    className="text-blue-500 hover:text-blue-600 hover:underline"
                                                >
                                                    Edit
                                                </a>
                                                <button
                                                    onClick={() => handleDeleteClick(article)}
                                                    disabled={isDeleting}
                                                    className="text-red-500 hover:text-red-600 hover:underline cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {isDeleting && deleteArticle?.id === article.id ? 'Deleting...' : 'Delete'}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
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

            {showDeleteModal && (
                <ConfirmModal
                    isOpen={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={handleDeleteConfirm}
                    title="Confirm Delete"
                    description="Are you sure you want to delete this article?"
                />
            )}
        </>
    );
}