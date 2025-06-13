'use client';
import { useEffect, useState, useRef } from "react";
import { User, LogOut } from "lucide-react";
import ConfirmModal from "@/app/utils/alert/confirmModal";
import { useAuth } from "@/app/hooks/useAuth";
import Cookies from 'js-cookie';
import axios from 'axios';
import { Menu } from 'lucide-react';

export default function HeaderAdmin({ title, onMenuClick }) {
    const [profileOpen, setProfileOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const profileRef = useRef(null);
    const { logout } = useAuth();
    const [username, setUsername] = useState('');
    const [role, setRole] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [initial, setInitial] = useState('A');

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

    return (
        <header className="sticky top-0 bg-white z-30 border-b border-[#F6F6F6]">
            <div className="flex items-center justify-between px-6 py-2">
                <div className="flex gap-2 items-center">
                    <button
                        onClick={onMenuClick}
                        className="lg:hidden p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
                    >
                        <Menu className='w-5 h-5' />
                    </button>
                    <h1 className="text-lg font-bold ml-2 text-black">{title}</h1>
                </div>

                <a
                    href="/admin/account"
                    className="flex items-center gap-4 hover:bg-gray-50 p-2 rounded-md"
                >
                    <div
                        className="flex gap-2 items-center cursor-pointer"
                    >
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#BFDBFE]">
                            <span className="font-medium text-sm text-[#1E3A8A]">{initial}</span>
                        </div>
                        <span className="hidden text-xs sm:inline">{username}</span>
                    </div>
                </a>
            </div>
        </header>
    );
}
