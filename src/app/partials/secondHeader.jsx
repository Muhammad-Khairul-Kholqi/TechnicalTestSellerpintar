'use client';
import { useEffect, useState, useRef } from "react";
import { User, LogOut } from "lucide-react";
import ConfirmModal from "@/app/utils/alert/confirmModal";
import { useAuth } from "@/app/hooks/useAuth";
import Cookies from 'js-cookie';
import axios from 'axios';

export default function SecondHeader() {
    const [profileOpen, setProfileOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const profileRef = useRef(null);
    const { logout } = useAuth();
    const [username, setUsername] = useState('');
    const [role, setRole] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [initial, setInitial] = useState('U');

    const BASE_API = process.env.NEXT_PUBLIC_BASE_API;

    const getAuthToken = () => {
        return Cookies.get('token') ||
            localStorage.getItem('token') ||
            localStorage.getItem('accessToken') ||
            localStorage.getItem('auth_token');
    };

    const handleAuthError = () => {
        Cookies.remove('token');
        localStorage.removeItem('token');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('auth_token');

        toast.error("Session expired. Please login again.");

        setTimeout(() => {
            window.location.href = '/';
        }, 2000);
    };

    useEffect(() => {
        const fetchUserProfile = async () => {
            setIsLoading(true);
            const token = getAuthToken();

            if (!token) {
                handleAuthError();
                return;
            }

            try {
                const response = await axios.get(`${BASE_API}/auth/profile`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const userData = response.data;
                setUsername(userData.username);
                setRole(userData.role);

                if (userData.username && userData.username.length > 0) {
                    setInitial(userData.username.charAt(0).toUpperCase());
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
                if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    handleAuthError();
                } else {
                    toast.error("Failed to load profile data");
                }
            }
        };

        fetchUserProfile();
    }, [BASE_API]);

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
            <header className="flex justify-center p-5 bg-white fixed top-0 left-0 right-0 border-b border-gray-100 z-50">
                <div className="w-full max-w-[1300px] flex justify-between items-center">
                    <a href="/articles/list" className="font-semibold text-md">BlogGZ.</a>

                    <div className="relative" ref={profileRef}>
                        <div
                            className="flex gap-2 items-center cursor-pointer"
                            onClick={() => setProfileOpen((prev) => !prev)}
                        >
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#BFDBFE]">
                                <span className="font-medium text-[#1E3A8A]">{initial}</span>
                            </div>
                            <span className="hidden sm:inline">{username}</span>
                        </div>

                        {profileOpen && (
                            <div className="absolute right-0 mt-4 bg-white text-black shadow-md rounded-md w-40 overflow-hidden z-50">
                                <a href="/account" className="flex items-center w-full px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                    <User className="w-4 h-4 mr-2" />
                                    My Account
                                </a>
                                <hr className="my-2 px-2 border-gray-200" />
                                <button
                                    onClick={() => setShowLogoutModal(true)}
                                    className="flex text-red-600 items-center w-full px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                >
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <ConfirmModal
                isOpen={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                onConfirm={() => {
                    setShowLogoutModal(false);
                    logout();
                }}
                title="Confirm Logout"
                description="Are you sure you want to logout?"
            />
        </>
    );
}
