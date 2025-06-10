"use client";
import { useEffect, useState, useRef } from "react";
import { User, LogOut } from "lucide-react";

export default function HeaderDetailArticle() {
    const [profileOpen, setProfileOpen] = useState(false);
    const profileRef = useRef(null);

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
        <header className="flex justify-center p-5 bg-white fixed top-0 left-0 right-0 border-b border-gray-100">
            <div className="w-full max-w-[1300px] flex justify-between items-center">
                <span className="font-semibold text-md">BlogGZ.</span>

                <div className="relative" ref={profileRef}>
                    <div
                        className="flex gap-2 items-center cursor-pointer"
                        onClick={() => setProfileOpen((prev) => !prev)}
                    >
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#BFDBFE]">
                            <span className="text-black font-medium text-[#1E3A8A]">K</span>
                        </div>
                        <span className="hidden sm:inline">Khairul Kholqi</span>
                    </div>

                    {profileOpen && (
                        <div className="absolute right-0 mt-4 bg-white text-black shadow-md rounded-md w-40 overflow-hidden z-50">
                            <a href="" className="flex items-center w-full px-4 py-2 hover:bg-gray-100">
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
        </header>
    )
}