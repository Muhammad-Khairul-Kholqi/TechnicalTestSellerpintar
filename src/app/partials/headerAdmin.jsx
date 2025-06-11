'use client';

import { Menu } from 'lucide-react';

export default function HeaderAdmin({ title, onMenuClick }) {
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
                            <span className="font-medium text-sm text-[#1E3A8A]">K</span>
                        </div>
                        <span className="hidden text-xs sm:inline">Khairul Kholqi</span>
                    </div>
                </a>
            </div>
        </header>
    );
}
