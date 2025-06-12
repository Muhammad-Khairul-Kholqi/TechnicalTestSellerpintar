"use client";
import { useEffect, useState, useRef } from "react";
import axios from 'axios';
import { ChevronDown, Search, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import ImageDummy from "@/app/assets/offc-image.jpg";

export default function ArticlePage() {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [articles, setArticles] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalArticles, setTotalArticles] = useState(0);

    const itemsPerPage = 10;
    const BASE_API = process.env.NEXT_PUBLIC_BASE_API;

    const fetchArticles = async (page = 1, category = "All") => {
        try {
            const response = await axios.get(`${BASE_API}/articles`, {
                params: {
                    page: page,
                    limit: itemsPerPage,
                    category: category !== "All" ? category : undefined
                }
            });
            console.log("API response:", response.data);
            const data = response.data;

            const articlesData = data.articles || data.data || [];
            const total = data.total || data.totalCount || articlesData.length;
            const pages = data.totalPages || Math.ceil(total / itemsPerPage);

            setArticles(articlesData);
            setTotalArticles(total);
            setTotalPages(pages);
        } catch (error) {
            console.error("Error fetching articles:", error);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            const newPage = currentPage - 1;
            setCurrentPage(newPage);
            fetchArticles(newPage, selectedCategory);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            const newPage = currentPage + 1;
            setCurrentPage(newPage);
            fetchArticles(newPage, selectedCategory);
        }
    };

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        setCurrentPage(1); 
        setDropdownOpen(false);
        fetchArticles(1, category);
    };

    useEffect(() => {
        fetchArticles(currentPage, selectedCategory);
    }, []);

    return (
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
                        {articles.map((article, index) => (
                            <tr key={article.id || index} className="border-b border-gray-200">
                                <td scope="row" className="px-6 py-4">
                                    {(currentPage - 1) * itemsPerPage + index + 1}
                                </td>
                                <td scope="row" className="px-6 py-4">
                                    <img
                                        src={article.imageUrl || ImageDummy.src}
                                        alt=""
                                        className="w-full max-w-[100px] h-full rounded-sm group-hover:scale-105 duration-300"
                                    />
                                </td>
                                <td className="px-6 py-4 text-gray-500">
                                    {article.title}
                                </td>
                                <td className="px-6 py-4 text-gray-500">
                                    {article.category?.name || 'Uncategorized'}
                                </td>
                                <td className="px-6 py-4 text-gray-500">
                                    {formatDate(article.createdAt)}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-center gap-3 h-full">
                                        <a href="" className="text-blue-500 hover:text-blue-600 hover:underline">Preview</a>
                                        <a href="/admin/articles/edit" className="text-blue-500 hover:text-blue-600 hover:underline">Edit</a>
                                        <a href="#" className="text-red-500 hover:text-red-600 hover:underline">Delete</a>
                                    </div>
                                </td>
                            </tr>
                        ))}
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
    );
}