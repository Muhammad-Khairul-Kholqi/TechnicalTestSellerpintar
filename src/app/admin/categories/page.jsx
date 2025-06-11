"use client";
import { useState } from "react";
import { Search, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import AddCategoryModal from "@/app/admin/categories/components/addCategoryModal";
import EditCategoryModal from "@/app/admin/categories/components/editCategoryModal";

export default function CategoriesPage() {
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editCategory, setEditCategory] = useState(null);

    const handleEditClick = (category) => {
        setEditCategory(category);
        setShowEditModal(true);
    };

    return (
        <>
            <div className="bg-white border border-gray-200 rounded-xl">
                <div className="p-5">
                    <h2 className="font-medium">Total Category: 25</h2>
                </div>

                <hr className="border-0.5 border-gray-100" />

                <div className="px-5 pt-5 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div className="flex items-center bg-white border border-gray-200 px-3 py-2 rounded-md w-full lg:max-w-[300px] md:max-w-[300px]">
                        <Search className="text-gray-600 h-4 w-4 mr-2" />
                        <input
                            type="text"
                            placeholder="Search by category"
                            className="bg-transparent outline-none w-full text-gray-800"
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
                            <tr className="border-b border-gray-200">
                                <td scope="row" className="px-6 py-4">
                                    1
                                </td>
                                <td className="px-6 py-4 text-gray-500">
                                    Technology
                                </td>
                                <td className="px-6 py-4 text-gray-500">
                                    April 13, 2025 10:55:12
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-start gap-3 h-full">
                                        <a href="" className="text-blue-500 hover:text-blue-600 hover:underline">Preview</a>
                                        <button
                                            onClick={() => handleEditClick({ id: 1, name: "Technology" })}
                                            className="text-blue-500 hover:text-blue-600 hover:underline cursor-pointer"
                                        >
                                            Edit
                                        </button>
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

            {showAddModal && (
                <AddCategoryModal onClose={() => setShowAddModal(false)} />
            )}

            {showEditModal && (
                <EditCategoryModal
                    category={editCategory}
                    onClose={() => setShowEditModal(false)}
                />
            )}
        </>
    );
}
