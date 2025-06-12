'use client';
import { usePathname } from 'next/navigation';
import { useState, useMemo } from 'react';
import HeaderAdmin from '@/app/partials/headerAdmin';
import Sidebar from '@/app/partials/sidebar';
import ProtectedRoute from '@/app/components/ProtectedRoute';

export default function AdminLayout({ children }) {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();

    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setSidebarOpen(false);

    const pageTitle = useMemo(() => {
        if (pathname.includes('/admin/articles')) return 'Articles';
        if (pathname.includes('/admin/articles/add')) return 'Articles';
        if (pathname.includes('/admin/articles/edit')) return 'Articles';
        if (pathname.includes('/admin/categories')) return 'Categories';
        if (pathname.includes('/admin/categories/add')) return 'Categories';
        if (pathname.includes('/admin/categories/edit')) return 'Categories';
        if (pathname.includes('/admin/account')) return 'Account';
        return 'Admin Page';
    }, [pathname]);

    return (
        <ProtectedRoute requiredRole="Admin">
            <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

            <div className="lg:ml-[250px] min-h-screen">
                <HeaderAdmin title={pageTitle} onMenuClick={toggleSidebar} />

                <main className="p-6 bg-[#F3F4F6] min-h-[calc(100vh-4rem)]">
                    {children}
                </main>
            </div>
        </ProtectedRoute>
    );
}
