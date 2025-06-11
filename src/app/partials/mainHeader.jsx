"use client";
import { useEffect, useState, useRef } from "react";
import Background from "@/app/assets/bg-header.jpg";
import { ChevronDown, Search, User, LogOut } from "lucide-react";

export default function MainHeader() {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [scrolled, setScrolled] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    const profileRef = useRef(null);

    const categories = [
        "All", "Design", "Development", "News", "Interviews",
        "Design", "Development", "News", "Interviews"
    ];

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

    return (
        <>
            <div
                className={`fixed px-5 top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-white text-black shadow-md" : "bg-transparent text-white"
                    }`}
            >
                <div className="w-full max-w-[1300px] mx-auto flex justify-between items-center py-3">
                    <a href="/home" className="font-semibold text-md">BlogGZ.</a>

                    <div className="relative" ref={profileRef}>
                        <div
                            className="flex gap-2 items-center cursor-pointer"
                            onClick={() => setProfileOpen((prev) => !prev)}
                        >
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#BFDBFE]">
                                <span className="font-medium text-[#1E3A8A]">K</span>
                            </div>
                            <span className="hidden sm:inline">Khairul Kholqi</span>
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
                        <h1 className="xl:text-4xl lg:text-3xl md:text-2xl sm:text-xl font-medium text-center">
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

                            <div className="flex items-center bg-gray-100 px-3 py-2 rounded-md w-full sm:w-[70%]">
                                <Search className="text-gray-600 h-4 w-4 mr-2" />
                                <input
                                    type="text"
                                    placeholder="Search articles..."
                                    className="bg-transparent outline-none w-full text-gray-800"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
}
