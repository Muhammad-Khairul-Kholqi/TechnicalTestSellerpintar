"use client";

import React, { useState } from 'react';
import { Mail, LockKeyhole, Eye, EyeOff } from 'lucide-react';

const RightContent = () => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <section className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 bg-white">
            <div className="w-full max-w-md">
                <h1 className="mb-2 text-2xl font-semibold text-gray-700">Welcome Back!</h1>
                <p className="mb-6 text-gray-500">Start reading our best articles!</p>

                <div className="space-y-6">
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
                                name="username"
                                placeholder="Enter your username"
                                className="w-full pl-12 pr-4 py-2 border-2 border-gray-200 rounded-md focus:border-gray-300 focus:outline-none transition-colors duration-200"
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
                                name="password"
                                placeholder="Enter your password"
                                className="w-full pl-12 pr-12 py-2 border-2 border-gray-200 rounded-md focus:border-gray-300 focus:outline-none transition-colors duration-200"
                                required
                            />
                            <span
                                onClick={togglePassword}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </span>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full cursor-pointer bg-blue-500 text-white font-semibold py-2 px-6 rounded-md hover:bg-blue-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Signin
                    </button>

                    <div className="text-right mt-2">
                        <p className="text-gray-600">
                            Don't have an account?{' '}
                            <a href="/registration" className="text-blue-500 hover:text-blue-600 font-semibold transition-colors">
                                Registration here
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default RightContent;