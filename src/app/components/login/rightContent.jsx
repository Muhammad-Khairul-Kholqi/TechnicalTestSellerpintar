"use client";

import React, { useState } from 'react';
import { Mail, LockKeyhole, Eye, EyeOff } from 'lucide-react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RightContent = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const router = useRouter();

    const togglePassword = () => {
        setShowPassword(!showPassword);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_API}/auth/login`, {
                username,
                password
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = response.data;

            Cookies.set('token', data.token, { path: '/' });
            Cookies.set('role', data.role, { path: '/' });

            toast.success('Login successful! Redirecting...');
            setTimeout(() => {
                if (data.role === 'Admin') {
                    router.push('/admin/articles');
                } else if (data.role === 'User') {
                    router.push('/articles/list');
                }
            }, 1500);

        } catch (err) {
            const status = err?.response?.status;
            const msg = err?.response?.data?.message || 'An error occurred during login.';

            let errorMessage = '';
            if (status === 401) {
                errorMessage = "The username or password you entered is incorrect. Please try again.";
            } else {
                errorMessage = msg;
            }

            toast.error(errorMessage);
            setError(errorMessage);

        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 bg-white">
            <form onSubmit={handleLogin} className="w-full max-w-md space-y-6">
                <div>
                    <h1 className="mb-2 text-2xl font-semibold text-gray-700">Welcome Back!</h1>
                    <p className="mb-6 text-gray-500">Start reading our best articles!</p>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-500">
                        Username <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                            <Mail className="w-5 h-5" />
                        </span>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                            className="w-full pl-12 pr-4 py-2 border-2 border-gray-200 rounded-md outline-none"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-500">
                        Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                            <LockKeyhole className="w-5 h-5" />
                        </span>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            className="w-full pl-12 pr-12 py-2 border-2 border-gray-200 rounded-md outline-none"
                            required
                        />
                        <span
                            onClick={togglePassword}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </span>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full cursor-pointer bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600 transition-all"
                >
                    {loading ? 'Signing in...' : 'Signin'}
                </button>

                <div className="text-right mt-2">
                    <p className="text-gray-600">
                        Don't have an account?{' '}
                        <a href="/registration" className="text-blue-500 hover:text-blue-600 font-semibold">
                            Registration here
                        </a>
                    </p>
                </div>
            </form>

            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
        </section>
    );
};

export default RightContent;
