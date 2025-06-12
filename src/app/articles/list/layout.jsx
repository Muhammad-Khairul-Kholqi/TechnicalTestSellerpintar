"use client";
import Footer from "@/app/partials/footer";
import ProtectedRoute from '@/app/components/ProtectedRoute';

export default function LayoutArticle({ children }) {
    return (
        <>
            <ProtectedRoute requiredRole="User">
                <div className="flex flex-col min-h-screen">
                    <main className="flex-grow">{children}</main>
                    <Footer />
                </div>
            </ProtectedRoute>
        </>
    );
}
