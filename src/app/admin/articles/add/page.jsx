"use client";
import { useEffect, useState, useRef } from "react";
import axios from 'axios';
import { MoveLeft, Image, ChevronDown } from "lucide-react";
import { Editor } from '@tinymce/tinymce-react';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

export default function CreateArticlePage() {
    const [fileName, setFileName] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("Select Category");
    const [selectedCategoryId, setSelectedCategoryId] = useState("");
    const [categories, setCategories] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [uploadedImageUrl, setUploadedImageUrl] = useState("");
    const dropdownRef = useRef(null);

    const BASE_API = process.env.NEXT_PUBLIC_BASE_API;

    const getAuthToken = () => {
        const possibleKeys = ['token', 'authToken', 'accessToken', 'jwt', 'access_token', 'bearerToken'];

        for (const key of possibleKeys) {
            const token = localStorage.getItem(key);
            if (token && token.trim() !== '') {
                return token;
            }
        }

        for (const key of possibleKeys) {
            const token = sessionStorage.getItem(key);
            if (token && token.trim() !== '') {
                return token;
            }
        }

        const cookies = document.cookie.split(';');
        for (const cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            if (possibleKeys.includes(name) && value && value.trim() !== '') {
                return value;
            }
        }

        return null;
    };

    const validateToken = (token) => {
        if (!token) return false;

        if (token.length < 10) return false;

        if (token.includes('.')) {
            const parts = token.split('.');
            if (parts.length === 3) {
                try {
                    const payload = JSON.parse(atob(parts[1]));
                    const now = Math.floor(Date.now() / 1000);

                    if (payload.exp && payload.exp < now) {
                        console.warn('Token has expired');
                        return false;
                    }

                    return true;
                } catch (e) {
                    console.warn('Invalid JWT format');
                    return false;
                }
            }
        }

        return true; 
    };

    const fetchCategories = async () => {
        try {
            const token = getAuthToken();

            if (!token) {
                setErrorMessage("Authentication required. Please login first.");
                return;
            }

            if (!validateToken(token)) {
                setErrorMessage("Invalid or expired token. Please login again.");
                return;
            }

            const response = await axios.get(`${BASE_API}/categories`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const data = response.data;
            setCategories(data.data || []);
        } catch (error) {
            console.error("Error fetching categories:", error);
            if (error.response?.status === 401) {
                setErrorMessage("Session expired. Please login again.");
            } else {
                setErrorMessage("Failed to load categories");
            }
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleCategoryChange = (category) => {
        setSelectedCategory(category.name);
        setSelectedCategoryId(category.id);
        setDropdownOpen(false);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && isValidImage(file)) {
            setFileName(file.name);
            setSelectedFile(file);
            setErrorMessage("");
        } else {
            setFileName("");
            setSelectedFile(null);
            setErrorMessage("Only PNG and JPG image files are allowed.");
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && isValidImage(file)) {
            setFileName(file.name);
            setSelectedFile(file);
            setErrorMessage("");
        } else {
            setFileName("");
            setSelectedFile(null);
            setErrorMessage("Only PNG and JPG image files are allowed.");
        }
    };

    const isValidImage = (file) => {
        const allowedTypes = ["image/png", "image/jpeg"];
        return allowedTypes.includes(file.type);
    };

    const uploadImage = async () => {
        if (!selectedFile) {
            throw new Error("No image selected");
        }

        try {
            const token = getAuthToken();

            if (!token) {
                throw new Error("No authentication token found. Please login again.");
            }

            if (!validateToken(token)) {
                throw new Error("Invalid or expired authentication token. Please login again.");
            }

            const formData = new FormData();
            formData.append('image', selectedFile);

            const response = await axios.post(`${BASE_API}/upload`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                timeout: 30000, 
            });

            return response.data.imageUrl;
        } catch (error) {
            console.error("Error uploading image:", error);

            if (error.response) {
                console.error("Response status:", error.response.status);
                console.error("Response data:", error.response.data);

                if (error.response.status === 401) {
                    const possibleKeys = ['token', 'authToken', 'accessToken', 'jwt'];
                    possibleKeys.forEach(key => {
                        localStorage.removeItem(key);
                        sessionStorage.removeItem(key);
                    });
                    throw new Error("Authentication failed. Please login again.");
                } else if (error.response.status === 403) {
                    throw new Error("Access denied. Admin privileges required to upload images.");
                } else if (error.response.status === 413) {
                    throw new Error("File too large. Please choose a smaller image.");
                } else if (error.response.status === 500) {
                    throw new Error("Server error occurred during upload. Please try again.");
                } else {
                    throw new Error(`Upload failed: ${error.response.data?.message || error.response.data?.error || 'Unknown error'}`);
                }
            } else if (error.code === 'ECONNABORTED') {
                throw new Error("Upload timeout. Please try again with a smaller file.");
            } else {
                throw new Error(`Failed to upload image: ${error.message}`);
            }
        }
    };

    const validateArticleData = (data) => {
        const errors = [];

        if (!data.title || typeof data.title !== 'string' || data.title.trim().length === 0) {
            errors.push("Title is required and must be a non-empty string");
        }

        if (!data.content || typeof data.content !== 'string' || data.content.trim().length === 0) {
            errors.push("Content is required and must be a non-empty string");
        }

        if (!data.categoryId) {
            errors.push("Category ID is required");
        }

        const categoryExists = categories.find(cat => cat.id == data.categoryId);

        if (!categoryExists && categories.length > 0) {
            errors.push(`Category ID ${data.categoryId} does not exist in available categories: ${categories.map(c => c.id).join(', ')}`);
        }

        return errors;
    };

    const handleSubmit = async () => {
        if (!title.trim()) {
            setErrorMessage("Title is required");
            return;
        }

        if (!selectedCategoryId) {
            setErrorMessage("Please select a category");
            return;
        }

        if (!description.trim()) {
            setErrorMessage("Description is required");
            return;
        }

        if (!selectedFile) {
            setErrorMessage("Please select a thumbnail image");
            return;
        }

        const token = getAuthToken();
        if (!token) {
            setErrorMessage("Please login first to create an article");
            return;
        }

        if (!validateToken(token)) {
            setErrorMessage("Your session has expired. Please login again");
            return;
        }

        await fetchCategories();

        setLoading(true);
        setErrorMessage("");

        try {
            const imageUrl = await uploadImage();
            setUploadedImageUrl(imageUrl);

            const categoryId = selectedCategoryId;

            const selectedCat = categories.find(cat => cat.id == categoryId);

            if (!selectedCat) {
                setErrorMessage(`Selected category (ID: ${categoryId}) not found. Please refresh and try again.`);
                setLoading(false);
                return;
            }

            let articleData = {
                title: title.trim(),
                content: description,
                categoryId: selectedCat.id,
            };

            if (imageUrl) {
                articleData.imageUrl = imageUrl; 
            }

            const validationErrors = validateArticleData(articleData);
            if (validationErrors.length > 0) {
                setErrorMessage(`Validation failed: ${validationErrors.join(', ')}`);
                setLoading(false);
                return;
            }

            const response = await axios.post(`${BASE_API}/articles`, articleData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                timeout: 30000,
            });

            if (response.status === 200 || response.status === 201) {
                toast.success("Article created successfully!");
                setTitle("");
                setDescription("");
                setSelectedCategory("Select Category");
                setSelectedCategoryId("");
                setSelectedFile(null);
                setFileName("");
                setUploadedImageUrl("");

                window.location.href = '/admin/articles';
            }
        } catch (error) {
            console.error("Error in handleSubmit:", error);
            console.error("Error response:", error.response?.data);
            console.error("Error status:", error.response?.status);
            console.error("Error headers:", error.response?.headers);

            let errorMsg = "Failed to create article";

            if (error.response?.status === 400) {
                const errorData = error.response.data;

                if (errorData?.message) {
                    errorMsg = `Bad Request: ${errorData.message}`;
                } else if (errorData?.error) {
                    errorMsg = `Bad Request: ${errorData.error}`;
                } else if (errorData?.errors) {
                    const errors = Array.isArray(errorData.errors)
                        ? errorData.errors.join(', ')
                        : Object.values(errorData.errors).flat().join(', ');
                    errorMsg = `Validation Error: ${errors}`;
                } else {
                    errorMsg = "Bad Request: Please check your input data";
                }
            } else if (error.response?.status === 422) {
                const errorData = error.response.data;
                if (errorData?.errors) {
                    const errors = Object.values(errorData.errors).flat().join(', ');
                    errorMsg = `Validation Error: ${errors}`;
                } else {
                    errorMsg = errorData?.message || "Validation failed";
                }
            } else if (error.message.includes("authentication") || error.message.includes("login")) {
                errorMsg = error.message;
            } else if (error.response?.data?.message) {
                errorMsg = error.response.data.message;
            } else if (error.message) {
                errorMsg = error.message;
            }

            setErrorMessage(errorMsg);
        } finally {
            setLoading(false);
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

            <div className="bg-white border border-gray-200 rounded-xl p-5">
                <a href='/admin/articles' className='flex items-center gap-2 text-gray-700 hover:text-black duration-300 group mb-4'>
                    <MoveLeft className='w-4 h-4 group-hover:-translate-x-2 duration-300' />
                    <span>Create Article</span>
                </a>

                <div className="flex flex-col items-start space-y-5">
                    {errorMessage && (
                        <div className="w-full p-3 bg-red-100 border border-red-300 text-red-700 rounded-md">
                            {errorMessage}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-2">
                            Thumbnails <span className="text-red-500">*</span>
                        </label>
                        <div
                            id="dropzone"
                            className="relative flex flex-col items-center justify-center w-full max-w-md h-36 border-2 border-dashed border-gray-300 rounded-md cursor-pointer text-gray-400 hover:border-blue-500 transition-colors"
                            onClick={() => document.getElementById('fileInput').click()}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={handleDrop}
                        >
                            <span className="h-10 w-10 mb-2 text-gray-400 flex items-center justify-center">
                                <Image className="w-8 h-8" />
                            </span>
                            <p className="text-sm text-center px-4">
                                Drag and drop image here or <span className="text-blue-500 font-medium">click to upload</span>
                            </p>
                            {fileName && (
                                <p className="mt-2 text-sm text-gray-600">
                                    Selected: <span className="font-medium">{fileName}</span>
                                </p>
                            )}
                            <input
                                type="file"
                                id="fileInput"
                                name="image"
                                accept=".png,.jpg,.jpeg"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </div>
                    </div>

                    <div className="w-full">
                        <label className="block text-sm font-medium text-gray-500 mb-2">
                            Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Input title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-md outline-none p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                    </div>

                    <div className="w-full">
                        <label className="block text-sm font-medium text-gray-500 mb-2">
                            Category <span className="text-red-500">*</span>
                        </label>
                        <div className="relative w-full" ref={dropdownRef}>
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="w-full cursor-pointer px-3 py-2 bg-white border border-gray-200 text-gray-800 rounded-md flex justify-between items-center focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            >
                                <span className={selectedCategoryId ? "text-gray-800" : "text-gray-400"}>
                                    {selectedCategory}
                                </span>
                                <ChevronDown
                                    className={`h-4 w-4 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                                />
                            </button>

                            {dropdownOpen && (
                                <div className="absolute top-full left-0 w-full mt-1 z-10 rounded-md shadow-lg bg-white border border-gray-200 overflow-hidden">
                                    <div className="max-h-[200px] overflow-y-auto scrollbar-hide">
                                        {categories.length > 0 ? (
                                            <ul className="text-gray-800 py-1">
                                                {categories.map((category) => (
                                                    <li
                                                        key={category.id}
                                                        className="px-4 py-2 hover:bg-blue-100 cursor-pointer transition-colors"
                                                        onClick={() => handleCategoryChange(category)}
                                                    >
                                                        {category.name}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <div className="px-4 py-2 text-gray-500">
                                                No categories available
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="w-full">
                        <label className="block text-sm font-medium text-gray-500 mb-2">
                            Description <span className="text-red-500">*</span>
                        </label>

                        <div className="rounded-md overflow-hidden border border-gray-200">
                            <Editor
                                apiKey="0jau07xbmv94l5td1mq8yarhafmbzhukmkua2dipbjqurtds"
                                value={description}
                                onEditorChange={(content) => setDescription(content)}
                                init={{
                                    height: 300,
                                    menubar: false,
                                    plugins: [
                                        'advlist', 'autolink', 'lists', 'link', 'charmap',
                                        'anchor', 'searchreplace', 'visualblocks', 'code',
                                        'insertdatetime', 'media', 'table', 'help', 'wordcount'
                                    ],
                                    toolbar: 'undo redo | blocks | ' +
                                        'bold italic forecolor | alignleft aligncenter ' +
                                        'alignright alignjustify | bullist numlist outdent indent | ' +
                                        'removeformat | help',
                                    content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; font-size: 14px }',
                                    placeholder: 'Write your article description...',
                                    branding: false,
                                    resize: false,
                                    statusbar: false,
                                    skin: 'oxide',
                                    content_css: 'default'
                                }}
                            />
                        </div>
                    </div>

                    <div className="w-full pt-4 grid lg:grid-cols-2 md:grid-cols-3 sm:grid-cols-1 items-center gap-4">
                        <a
                            href="/admin/articles"
                            className="w-full text-center cursor-pointer bg-white hover:bg-gray-100 border border-gray-200 text-black font-medium py-2 px-4 rounded-md transition-colors"
                        >
                            Cancel
                        </a>

                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={loading}
                            className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-md transition-colors"
                        >
                            {loading ? "Creating..." : "Create Article"}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}