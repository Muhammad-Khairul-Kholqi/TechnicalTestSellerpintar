"use client";
import ProtectedRoute from '@/app/components/ProtectedRoute';
import SecondHeader from "@/app/partials/secondHeader";
import Footer from "@/app/partials/footer";

export default function DetailArticleLayout({children}) {
    return (
        <ProtectedRoute requiredRole="User">
            <div className="min-h-screen flex flex-col">
                <SecondHeader />
                <main className="flex-grow">{children}</main>
                <Footer />
            </div>
        </ProtectedRoute>
    )
}