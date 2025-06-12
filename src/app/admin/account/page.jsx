'use client';

import { User, Lock, Settings, Save } from 'lucide-react';

export default function AdminAccountPage() {
    return (
        <div className="bg-white flex items-center justify-center px-5 py-10 rounded-xl">
            <div className="bg-white border border-gray-200 rounded-xl p-6 w-full max-w-md shadow-md">
                <div className="flex flex-col items-center space-y-6">
                    <h1 className="text-gray-600 text-lg font-semibold">User Profile</h1>

                    <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#BFDBFE]">
                        <span className="font-medium text-[#1E3A8A] text-xl">K</span>
                    </div>

                    <form className="w-full space-y-4">
                        <div className="flex items-center space-x-3 border border-gray-200 rounded-lg p-3">
                            <User className="text-gray-500" />
                            <div className="flex flex-col w-full">
                                <label className="text-sm text-gray-500 mb-1">Username</label>
                                <input
                                    type="text"
                                    placeholder="Enter your username"
                                    className="outline-none text-gray-700 bg-transparent placeholder:text-gray-400"
                                />
                            </div>
                        </div>

                        <div className="flex items-center space-x-3 border border-gray-200 rounded-lg p-3">
                            <Lock className="text-gray-500" />
                            <div className="flex flex-col w-full">
                                <label className="text-sm text-gray-500 mb-1">Password</label>
                                <input
                                    type="password"
                                    placeholder="Enter your password"
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
                                    placeholder="Enter your role"
                                    className="outline-none text-gray-700 bg-transparent placeholder:text-gray-400"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full cursor-pointer mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200"
                        >
                            Save Changes
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
