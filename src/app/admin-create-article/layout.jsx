'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { User } from 'lucide-react';

export default function CreateArticleLayout({ children, title = "Dashboard" }) {
    const pathname = usePathname();
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    return (
        <div>
            <div
                id="overlay"
                className={`${isSidebarOpen ? '' : 'hidden'} fixed inset-0 bg-black/50 lg:hidden z-40`}
                onClick={closeSidebar}
            />

            <aside className={`fixed top-0 left-0 h-screen w-[250px] bg-[#2563EB] transform transition-transform duration-300 border-r border-[#F6F6F6] z-50 flex flex-col
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
            >
                <div>
                    <div className="py-6 px-8">
                        <span className="font-semibold text-md text-white">BlogGZ.</span>
                    </div>

                    <nav className="p-4">
                        <ul className="space-y-2">
                            <li>
                                <a
                                    href="/dashboard"
                                    className={`flex items-center p-3 rounded-lg hover:bg-[#3B82F6] text-white transition-all 
                                    ${pathname.startsWith('/dashboard') ? 'bg-[#FE5F00] text-white' : ''}`}
                                >
                                    <User className='w-4 h-4' />
                                    <span className="ml-2">Articles</span>
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/product"
                                    className={`flex items-center p-3 rounded-lg hover:bg-[#3B82F6] text-white transition-all 
                                    ${pathname.startsWith('/product') ? 'bg-[#FE5F00] text-white' : ''}`}
                                >
                                    <User className='w-4 h-4' />
                                    <span className="ml-2">Category</span>
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/category"
                                    className={`flex items-center p-3 rounded-lg hover:bg-[#3B82F6] text-white transition-all 
                                    ${pathname.startsWith('/category') ? 'bg-[#FE5F00] text-white' : ''}`}
                                >
                                    <User className='w-4 h-4' />
                                    <span className="ml-2">Lgout</span>
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </aside>

            <div className="lg:ml-[250px] min-h-screen">
                <header className="sticky top-0 bg-white z-30 border-b border-[#F6F6F6]">
                    <div className="flex items-center justify-between px-6 py-4">
                        <div className="flex items-center">
                            <button
                                id="hamburger"
                                onClick={toggleSidebar}
                                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <User className='w-4 h-4' />
                            </button>
                            <h1 className="text-lg font-bold ml-2 text-black">{title}</h1>
                        </div>

                        <a
                            href="/profile"
                            className="flex items-center gap-4 hover:bg-gray-50 p-2 rounded-md"
                        >
                            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                                <User className='w-4 h-4' />
                            </div>
                        </a>
                    </div>
                </header>

                <main className="p-6 bg-[#F6F6F6] min-h-[calc(100vh-4rem)]">
                    {children}
                </main>
            </div>
        </div>
    );
}
