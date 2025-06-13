"use client";
import { User, Settings } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';

export default function AccountPage() {
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
                if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    handleAuthError();
                } else {
                    toast.error("Failed to load profile data");
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserProfile();
    }, [BASE_API]);

    if (isLoading) {
        return (
            <div className="bg-white flex items-center justify-center px-5 py-10 rounded-xl mt-[70px]">
                <div className="bg-white border border-gray-200 rounded-xl p-6 w-full max-w-md shadow-md flex justify-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white flex justify-center items-center p-5">
            <div className="w-full max-w-[1300px] flex justify-center">
                <div className="bg-white border border-gray-200 rounded-xl p-6 w-full max-w-md shadow-md mt-[70px]">
                    <div className="flex flex-col items-center space-y-6">
                        <h1 className="text-gray-600 text-lg font-semibold">User Profile</h1>

                        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#BFDBFE]">
                            <span className="font-medium text-[#1E3A8A] text-xl">{initial}</span>
                        </div>

                        <div className="w-full space-y-4">
                            <div className="flex items-center space-x-3 border border-gray-200 rounded-lg p-3">
                                <User className="text-gray-500" />
                                <div className="flex flex-col w-full">
                                    <label className="text-sm text-gray-500 mb-1">Username</label>
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="outline-none text-gray-700 bg-transparent placeholder:text-gray-400"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center space-x-3 border border-gray-200 rounded-lg p-3">
                                <Settings className="text-gray-500" />
                                <div className="flex flex-col w-full">
                                    <label className="text-sm text-gray-500 mb-1">Role</label>
                                    <input
                                        type="text"
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                        placeholder="Enter your role"
                                        className="outline-none text-gray-700 bg-transparent placeholder:text-gray-400"
                                        disabled
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
