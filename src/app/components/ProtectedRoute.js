import { useAuth } from "@/app/hooks/useAuth";
import {
    Lock,
    AlertTriangle
} from 'lucide-react';

const ProtectedRoute = ({ children, requiredRole = null, fallback = null }) => {
    const { user, loading, isAuthenticated } = useAuth(requiredRole);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return fallback || (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-700 mb-4">Access Denied</h2>
                    <p className="text-gray-500">Please login to access this page.</p>
                </div>
            </div>
        );
    }

    if (requiredRole && user?.role !== requiredRole) {
        return fallback || (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-700 mb-4">Access Denied</h2>
                    <p className="text-gray-500">You dont have permission to access this page.</p>
                </div>
            </div>
        );
    }

    return children;
};

export default ProtectedRoute;