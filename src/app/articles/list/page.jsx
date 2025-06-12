"use client";
import { useEffect, useState, useRef } from "react";
import axios from 'axios';
import ImageDummy from "@/app/assets/offc-image.jpg";
import { ChevronRight, ChevronLeft } from 'lucide-react';
import Background from "@/app/assets/offc-image.jpg";
import { ChevronDown, Search, User, LogOut } from "lucide-react";

export default function ArticlePage() {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedCategoryId, setSelectedCategoryId] = useState("all");
    const [scrolled, setScrolled] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [articles, setArticles] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalArticles, setTotalArticles] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [userProfile, setUserProfile] = useState(null);
    const profileRef = useRef(null);
    const searchTimeoutRef = useRef(null);

    const BASE_API = process.env.NEXT_PUBLIC_BASE_API;
    const ARTICLES_PER_PAGE = 9;

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${BASE_API}/categories`);
            const data = response.data;
            setCategories([{ id: "all", name: "All" }, ...data.data]);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const fetchUserProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${BASE_API}/auth/profile`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            setUserProfile(response.data);
        } catch (error) {
            console.error("Error fetching user profile:", error);
        }
    };


    const fetchArticles = async (page = 1, categoryId = null, title = "") => {
        setLoading(true);
        try {
            let url = `${BASE_API}/articles?page=${page}&limit=${ARTICLES_PER_PAGE}`;

            if (categoryId && categoryId !== "all") {
                url += `&categoryId=${categoryId}`;
            }

            if (title) {
                url += `&title=${encodeURIComponent(title)}`;
            }

            const response = await axios.get(url);
            const data = response.data;

            setArticles(data.data || []);
            setTotalArticles(data.total || 0);
            setTotalPages(Math.ceil((data.total || 0) / ARTICLES_PER_PAGE));
        } catch (error) {
            console.error("Error fetching articles:", error);
            setArticles([]);
            setTotalArticles(0);
            setTotalPages(0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
        fetchArticles();
        fetchUserProfile();
    }, []);

    const handleCategoryChange = (category) => {
        setSelectedCategory(category.name);
        setSelectedCategoryId(category.id);
        setCurrentPage(1);
        setSearchTerm("");

        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        const categoryId = category.id === "all" ? null : category.id;
        fetchArticles(1, categoryId, "");
        setDropdownOpen(false);
    };

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        setCurrentPage(1);

        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        const categoryId = selectedCategoryId !== "all" ? selectedCategoryId : null;

        searchTimeoutRef.current = setTimeout(() => {
            fetchArticles(1, categoryId, value);
        }, 500);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        const categoryId = selectedCategoryId !== "all" ? selectedCategoryId : null;
        fetchArticles(page, categoryId, searchTerm);
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            handlePageChange(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            handlePageChange(currentPage + 1);
        }
    };

    const getShowingRange = () => {
        const start = (currentPage - 1) * ARTICLES_PER_PAGE + 1;
        const end = Math.min(currentPage * ARTICLES_PER_PAGE, totalArticles);
        return { start, end };
    };

    const { start, end } = getShowingRange();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const truncateDescription = (content, wordLimit) => {
        const words = content.split(' ');
        if (words.length > wordLimit) {
            return words.slice(0, wordLimit).join(' ') + '...';
        } else {
            return content;
        }
    };

    return (
        <>
            <div
                className={`fixed px-5 top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-white text-black shadow-md" : "bg-transparent text-white"
                    }`}
            >
                <div className="w-full max-w-[1300px] mx-auto flex justify-between items-center py-3">
                    <a href="/articles/list" className="font-semibold text-md">BlogGZ.</a>

                    <div className="relative" ref={profileRef}>
                        <div
                            className="flex gap-2 items-center cursor-pointer"
                            onClick={() => setProfileOpen((prev) => !prev)}
                        >
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#BFDBFE]">
                                <span className="font-medium text-[#1E3A8A]">
                                    {userProfile?.username ? userProfile.username.charAt(0).toUpperCase() : 'U'}
                                </span>
                            </div>
                            <span className="hidden sm:inline">
                                {userProfile?.username || 'User'}
                            </span>
                        </div>

                        {profileOpen && (
                            <div className="absolute right-0 mt-4 bg-white text-black shadow-md rounded-md w-40 overflow-hidden z-50">
                                <a href="/account" className="flex items-center w-full px-4 py-2 hover:bg-gray-100">
                                    <User className="w-4 h-4 mr-2" />
                                    My Account
                                </a>
                                <hr className="my-2 px-2 border-gray-200" />
                                <a href="" className="flex text-red-600 items-center w-full px-4 py-2 hover:bg-gray-100">
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Logout
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <header
                className="relative flex justify-center text-white pt-[72px]"
                style={{
                    backgroundImage: `url(${Background.src})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <div className="absolute inset-0 bg-blue-600 opacity-70 z-0" />

                <div className="relative z-10 w-full px-5 py-10">
                    <div className="mx-auto w-full max-w-[1300px] flex flex-col items-center space-y-4">
                        <span className="font-semibold text-center">Blog Genzet</span>
                        <h1 className="xl:text-4xl lg:text-3xl md:text-2xl sm:text-2xl text-2xl font-medium text-center">
                            The Journal: Design Resources, <br /> Interview, and Industry News
                        </h1>
                        <h2 className="text-xl text-center">Your daily dose of design insights!</h2>

                        <div className="bg-blue-500 p-2 rounded-lg flex flex-col sm:flex-row items-stretch sm:items-center w-full max-w-[600px] gap-2">
                            <div className="relative w-full sm:w-[30%]">
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="w-full px-3 py-2 bg-gray-100 text-gray-800 rounded-md flex justify-between items-center cursor-pointer"
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
                                                        key={category.id}
                                                        className="px-4 py-2 hover:bg-blue-100 rounded-md cursor-pointer"
                                                        onClick={() => handleCategoryChange(category)}
                                                    >
                                                        {category.name}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center bg-gray-100 px-3 py-2 rounded-md w-full sm:w-[70%]">
                                <Search className="text-gray-600 h-4 w-4 mr-2" />
                                <input
                                    type="text"
                                    placeholder="Search articles..."
                                    value={searchTerm}
                                    onChange={handleSearch}
                                    className="bg-transparent outline-none w-full text-gray-800"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <section className="flex justify-center p-5 mt-5">
                <div className="w-full max-w-[1300px]">
                    <span className="text-lg text-gray-500 font-medium">
                        Showing: {totalArticles > 0 ? `${start}-${end}` : '0'} of {totalArticles} articles
                    </span>

                    {loading ? (
                        <div className="flex justify-center items-center mt-8 py-20">
                            <div className="text-gray-500">Loading articles...</div>
                        </div>
                    ) : (
                        <>
                            <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 items-start gap-8 mt-8">
                                {articles.length > 0 ? (
                                    articles.map((article) => (
                                        <a key={article.id} href={`/articles/${article.id}`} className="flex flex-col items-start space-y-2 group">
                                            <img
                                                src={article.imageUrl || ImageDummy.src}
                                                alt={article.title}
                                                className="w-full h-[250px] rounded-lg group-hover:scale-105 duration-300"
                                            />

                                            <span className="text-gray-400 text-sm mt-2">
                                                {formatDate(article.createdAt)}
                                            </span>

                                            <h1 className="font-semibold text-lg group-hover:underline duration-300">
                                                {article.title}
                                            </h1>

                                            <p className="text-gray-600" dangerouslySetInnerHTML={{ __html: truncateDescription(article.content, 15) }} />

                                            <div className="flex items-center gap-4">
                                                <div className="bg-[#BFDBFE] group-hover:bg-[#BFDBFE]/80 duration-300 rounded-full px-4 py-1">
                                                    <span className="text-sm">{article.category?.name || 'Uncategorized'}</span>
                                                </div>

                                                <div className="bg-[#E5E7EB] group-hover:bg-[#E5E7EB]/80 duration-300 rounded-full px-4 py-1">
                                                    <span className="text-sm">{article.user?.username || 'Anonymous'}</span>
                                                </div>
                                            </div>
                                        </a>
                                    ))
                                ) : (
                                    <div className="col-span-full flex justify-center items-center py-20">
                                        <div className="text-gray-500 text-lg">No articles found</div>
                                    </div>
                                )}
                            </div>

                            {totalPages > 1 && (
                                <div className="flex items-center justify-center gap-5 mt-10">
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
                        </>
                    )}
                </div>
            </section>
        </>
    );
}