'use client';

import { User, Lock, Settings } from 'lucide-react';

export default function AdminAccountPage() {
    return (
        <div className="bg-white border border-gray-200 rounded-xl py-10 px-5">
            <div className='flex flex-col items-center space-y-6'>
                <h1 className="text-gray-600 text-lg font-semibold">User Profile</h1>

                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#BFDBFE]">
                    <span className="font-medium text-[#1E3A8A] text-xl">K</span>
                </div>

                <form action="" className="flex flex-col items-center space-y-4">
                    <div className="flex items-center px-5 py-2 rounded-md border border-gray-200 bg-gray-50 gap-5 w-full max-w-[700px]">
                        <div className="flex items-center gap-2 text-gray-700">
                            <User className='w-4 h-4' />
                            <span>Username:</span>
                        </div>
                        <input
                            type="text"
                            value="Khairul Kholqi"
                            className="outline-none focus:border-none"
                        />
                    </div>

                    <div className="flex items-center px-5 py-2 rounded-md border border-gray-200 bg-gray-50 gap-5 w-full max-w-[700px]">
                        <div className="flex items-center gap-2 text-gray-700">
                            <Lock className='w-4 h-4' />
                            <span>Password:</span>
                        </div>
                        <input
                            type="password"
                            value="Khairul123"
                            className="outline-none focus:border-none"
                        />
                    </div>

                    <div className="flex items-center px-5 py-2 rounded-md border border-gray-200 bg-gray-50 gap-5 w-full max-w-[700px]">
                        <div className="flex items-center gap-2 text-gray-700">
                            <Settings className='w-4 h-4' />
                            <span>Role:</span>
                        </div>
                        <input
                            type="text"
                            value="Admin"
                            className="outline-none focus:border-none"
                        />
                    </div>

                    <button className='py-2 px-5 rounded-md text-white bg-blue-500 hover:bg-blue-600 w-full cursor-pointer'>Save Changes</button>
                </form>
            </div>
        </div>
    )
}