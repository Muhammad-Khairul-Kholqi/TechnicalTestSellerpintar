"use client";
import { useState } from "react";
import { MoveLeft, Image, ChevronDown } from "lucide-react";
import { Editor } from '@tinymce/tinymce-react';

export default function EditArticlePage() {
    const [fileName, setFileName] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [description, setDescription] = useState("");

    const categories = [
        "All", "Design", "Development", "News", "Interviews",
        "Design", "Development", "News", "Interviews"
    ];

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && isValidImage(file)) {
            setFileName(file.name);
            setErrorMessage("");
        } else {
            setFileName("");
            setErrorMessage("Only PNG and JPG image files are allowed.");
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && isValidImage(file)) {
            setFileName(file.name);
            setErrorMessage("");
        } else {
            setFileName("");
            setErrorMessage("Only PNG and JPG image files are allowed.");
        }
    };

    const isValidImage = (file) => {
        const allowedTypes = ["image/png", "image/jpeg"];
        return allowedTypes.includes(file.type);
    };

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-5">
            <a href='/admin/articles' className='flex items-center gap-2 text-gray-700 hover:text-black duration-300 group mb-4'>
                <MoveLeft className='w-4 h-4 group-hover:-translate-x-2 duration-300' />
                <span>Edit Article</span>
            </a>

            <div className="flex flex-col items-start space-y-5">
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
                            name="ProductImageFile"
                            accept=".png,.jpg,.jpeg"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                    </div>
                    {errorMessage && (
                        <p className="mt-2 text-xs text-red-500">{errorMessage}</p>
                    )}
                </div>

                <div className="w-full">
                    <label className="block text-sm font-medium text-gray-500 mb-2">
                        Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        placeholder="Input title"
                        className="w-full bg-white border border-gray-200 rounded-md outline-none p-2"
                    />
                </div>

                <div className="w-full">
                    <label className="block text-sm font-medium text-gray-500 mb-2">
                        Category <span className="text-red-500">*</span>
                    </label>
                    <div className="relative w-full">
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
                                        {categories.map((category, index) => (
                                            <li
                                                key={`${category}-${index}`}
                                                className="px-4 py-2 hover:bg-blue-100 rounded-md cursor-pointer"
                                                onClick={() => {
                                                    setSelectedCategory(category);
                                                    setDropdownOpen(false);
                                                }}
                                            >
                                                {category}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="w-full">
                    <label className="block text-sm font-medium text-gray-500 mb-2">
                        Description <span className="text-red-500">*</span>
                    </label>

                    <div className="rounded-md overflow-hidden">
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

                <div className="w-full pt-4 grid lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-1 items-center gap-4">
                    <a
                        href="/admin/articles"
                        className="w-full text-center cursor-pointer bg-white hover:bg-gray-100 border border-gray-200 text-black font-medium py-2 px-4 rounded-md transition-colors"
                    >
                        Cancel
                    </a>

                    <button
                        type="button"
                        className="w-full cursor-pointer bg-gray-300 hover:bg-gray-400 text-black font-medium py-2 px-4 rounded-md transition-colors"
                    >
                        Preview
                    </button>

                    <button
                        type="button"
                        className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}