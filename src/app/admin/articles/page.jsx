"use client";
import { useState } from "react";
import { ChevronDown, Search, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import ImageDummy from "@/app/assets/bg-header.jpg";

export default function ArticlePage() {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("All");

    const categories = [
        "All", "Design", "Development", "News", "Interviews",
        "Design", "Development", "News", "Interviews"
    ];

    return (
        <div className="bg-white border border-gray-200 rounded-xl">
            <div className="p-5">
                <h2 className="font-medium">Total Article: 25</h2>
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
                        <tr className="border-b border-gray-200">
                            <td scope="row" className="px-6 py-4">
                                1
                            </td>
                            <td scope="row" className="px-6 py-4">
                                <img
                                    src={ImageDummy.src}
                                    alt=""
                                    className="w-full max-w-[100px] h-full rounded-sm group-hover:scale-105 duration-300"
                                />
                            </td>
                            <td className="px-6 py-4 text-gray-500">
                                The Future of Work: Remote-First Teams and Digital Tools
                            </td>
                            <td className="px-6 py-4 text-gray-500">
                                Technology
                            </td>
                            <td className="px-6 py-4 text-gray-500">
                                April 13, 2025 10:55:12
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center justify-center gap-3 h-full">
                                    <a href="" className="text-blue-500 hover:text-blue-600 hover:underline">Preview</a>
                                    <a href="/admin/articles/edit" className="text-blue-500 hover:text-blue-600 hover:underline">Edit</a>
                                    <a href="#" className="text-red-500 hover:text-red-600 hover:underline">Delete</a>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="flex items-center justify-center gap-5 py-5">
                <div className="flex items-center gap-2 cursor-pointer text-gray-700 hover:text-black">
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                </div>

                <div className="flex items-center gap-2 cursor-pointer text-gray-700 hover:text-black">
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                </div>
            </div>
        </div>
    );
}
