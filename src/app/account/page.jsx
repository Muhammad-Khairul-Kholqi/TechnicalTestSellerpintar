"use client";
import { useEffect, useState, useRef } from "react";
import axios from 'axios';
import { User, Lock, Settings } from 'lucide-react';

export default function AccountPage() {
    const BASE_API = process.env.NEXT_PUBLIC_BASE_API;
    
    return (
        <div className="min-h-screen bg-white flex justify-center items-center p-5">
            <div className="w-full max-w-[1300px] flex justify-center">
                <div className="bg-white border border-gray-200 rounded-xl p-6 w-full max-w-md shadow-md mt-[70px]">
                    <div className="flex flex-col items-center space-y-6">
                        <h1 className="text-gray-600 text-lg font-semibold">User Profile</h1>

                        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#BFDBFE]">
                            <span className="font-medium text-[#1E3A8A] text-xl">K</span>
                        </div>

                        <div className="w-full space-y-4">
                            <div className="flex items-center space-x-3 border border-gray-200 rounded-lg p-3">
                                <User className="text-gray-500" />
                                <div className="flex flex-col w-full">
                                    <label className="text-sm text-gray-500 mb-1">Username</label>
                                    <span className="text-gray-700">dsfdsfsdfdsfsd</span>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3 border border-gray-200 rounded-lg p-3">
                                <Lock className="text-gray-500" />
                                <div className="flex flex-col w-full">
                                    <label className="text-sm text-gray-500 mb-1">Password</label>
                                    <span className="text-gray-700">dsfdsfsdfdsfsd</span>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3 border border-gray-200 rounded-lg p-3">
                                <Settings className="text-gray-500" />
                                <div className="flex flex-col w-full">
                                    <label className="text-sm text-gray-500 mb-1">Role</label>
                                    <span className="text-gray-700">dsfdsfsdfdsfsd</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
