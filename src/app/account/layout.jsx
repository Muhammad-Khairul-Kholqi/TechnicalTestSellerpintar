"use client";
import SecondHeader from "@/app/partials/secondHeader";
import Footer from "@/app/partials/footer";
import ProtectedRoute from '@/app/components/ProtectedRoute';

export default function AccountLayout({ children }) {
    return (
        <ProtectedRoute requiredRole="User">
            <div className="min-h-screen flex flex-col">
                <SecondHeader />
                <main className="flex-grow">{children}</main>
                <Footer />
            </div>
        </ProtectedRoute>
    );
}
