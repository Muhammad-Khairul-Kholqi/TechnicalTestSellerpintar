"use client";
import { useEffect, useState, useRef } from "react";
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { MoveLeft, Image, ChevronDown } from "lucide-react";
import { Editor } from '@tinymce/tinymce-react';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

export default function EditArticlePage() {
    const params = useParams();
    const id = params.id;
    const router = useRouter();
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
    const [initialData, setInitialData] = useState(null);
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

    const fetchArticle = async () => {
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

            const response = await axios.get(`${BASE_API}/articles/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const article = response.data?.data || response.data;

            if (!article) {
                throw new Error("Article data not found in response");
            }

            setInitialData(article);
            setTitle(article.title);
            setDescription(article.content);
            setSelectedCategory(article.category?.name || "Select Category");
            setSelectedCategoryId(article.categoryId);
            setUploadedImageUrl(article.imageUrl || "");
        } catch (error) {
            console.error("Error fetching article:", error);
            if (error.response?.status === 404) {
                setErrorMessage("Article not found");
            } else if (error.response?.status === 401) {
                setErrorMessage("Session expired. Please login again.");
            } else {
                setErrorMessage("Failed to load article data");
            }
        }
    };

    useEffect(() => {
        fetchCategories();
        if (id) fetchArticle();
    }, [id]);

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
            return uploadedImageUrl;
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
                if (error.response.status === 401) {
                    const possibleKeys = ['token', 'authToken', 'accessToken', 'jwt'];
                    possibleKeys.forEach(key => {
                        localStorage.removeItem(key);
                        sessionStorage.removeItem(key);
                    });
                    throw new Error("Authentication failed. Please login again.");
                } else if (error.response.status === 413) {
                    throw new Error("File too large. Please choose a smaller image.");
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

        const token = getAuthToken();
        if (!token) {
            setErrorMessage("Please login first to edit the article");
            return;
        }

        if (!validateToken(token)) {
            setErrorMessage("Your session has expired. Please login again");
            return;
        }

        setLoading(true);
        setErrorMessage("");

        try {
            const imageUrl = await uploadImage();

            const updatedData = {
                title: title.trim(),
                content: description,
                categoryId: selectedCategoryId,
                ...(imageUrl && { imageUrl })
            };

            const response = await axios.put(
                `${BASE_API}/articles/${id}`,
                updatedData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    timeout: 30000,
                }
            );

            if (response.status === 200) {
                toast.success("Article updated successfully!");
                setTimeout(() => router.push('/admin/articles'), 1500);
            }
        } catch (error) {
            console.error("Error updating article:", error);

            let errorMsg = "Failed to update article";
            if (error.response?.status === 400) {
                const errorData = error.response.data;
                if (errorData?.message) {
                    errorMsg = `Bad Request: ${errorData.message}`;
                } else if (errorData?.errors) {
                    const errors = Object.values(errorData.errors).flat().join(', ');
                    errorMsg = `Validation Error: ${errors}`;
                }
            } else if (error.response?.status === 404) {
                errorMsg = "Article not found";
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
                <a
                    onClick={() => router.push('/admin/articles')}
                    className='flex items-center gap-2 text-gray-700 hover:text-black duration-300 group mb-4 cursor-pointer'
                >
                    <MoveLeft className='w-4 h-4 group-hover:-translate-x-2 duration-300' />
                    <span>Edit Article</span>
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

                            {fileName ? (
                                <p className="mt-2 text-sm text-gray-600">
                                    Selected: <span className="font-medium">{fileName}</span>
                                </p>
                            ) : uploadedImageUrl ? (
                                <p className="mt-2 text-sm text-gray-600">
                                    Current image: <a
                                        href={uploadedImageUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 hover:underline"
                                    >
                                        View
                                    </a>
                                </p>
                            ) : null}

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
                        <button
                            onClick={() => router.push('/admin/articles')}
                            className="w-full text-center cursor-pointer bg-white hover:bg-gray-100 border border-gray-200 text-black font-medium py-2 px-4 rounded-md transition-colors"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-md transition-colors"
                        >
                            {loading ? "Saving Changes..." : "Save Changes"}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}