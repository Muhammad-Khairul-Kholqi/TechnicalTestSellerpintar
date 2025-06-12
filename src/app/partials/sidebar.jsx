'use client';
import { useState } from "react";
import { usePathname } from 'next/navigation';
import { Newspaper, Tag, LogOut } from 'lucide-react';
import ConfirmModal from "@/app/utils/alert/confirmModal";
import { useAuth } from "@/app/hooks/useAuth";

export default function Sidebar({ isOpen, onClose }) {
    const pathname = usePathname();
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const { logout } = useAuth();

    return (
        <>
            <div
                id="overlay"
                className={`${isOpen ? '' : 'hidden'} fixed inset-0 bg-black/50 lg:hidden z-40`}
                onClick={onClose}
            />

            <aside className={`fixed top-0 left-0 h-screen w-[250px] bg-[#2563EB] transform transition-transform duration-300 z-50 flex flex-col
                ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
            >
                <div className="py-6 px-8">
                    <span className="font-semibold text-md text-white">BlogGZ.</span>
                </div>

                <nav className="p-4">
                    <ul className="space-y-2">
                        <li>
                            <a
                                href="/admin/articles"
                                className={`flex items-center p-3 rounded-lg hover:bg-[#3B82F6] text-white transition-all 
                                ${pathname.startsWith('/admin/articles') ? 'bg-[#3B82F6]' : ''}`}
                            >
                                <Newspaper className='w-4 h-4' />
                                <span className="ml-2">Articles</span>
                            </a>
                        </li>
                        <li>
                            <a
                                href="/admin/categories"
                                className={`flex items-center p-3 rounded-lg hover:bg-[#3B82F6] text-white transition-all 
                                ${pathname.startsWith('/admin/categories') ? 'bg-[#3B82F6]' : ''}`}
                            >
                                <Tag className='w-4 h-4' />
                                <span className="ml-2">Category</span>
                            </a>
                        </li>
                        <li>
                            <button className="flex items-center p-3 rounded-lg hover:bg-[#3B82F6] w-full text-white transition-all cursor-pointer" onClick={() => setShowLogoutModal(true)}>
                                <LogOut className='w-4 h-4' />
                                <span className="ml-2">Logout</span>
                            </button>
                        </li>
                    </ul>
                </nav>
            </aside>

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
