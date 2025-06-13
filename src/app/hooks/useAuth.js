'use client';
import {
    useState,
    useEffect,
    useCallback
} from 'react';
import {
    useRouter
} from 'next/navigation';
import Cookies from 'js-cookie';

export const useAuth = (requiredRole = null) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    const logout = useCallback(() => {
        // Hapus dari cookies
        Cookies.remove('token');
        Cookies.remove('role');

        // Hapus dari localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('auth_token');

        setUser(null);
        setIsAuthenticated(false);
        router.push('/');
    }, [router]);
      

    useEffect(() => {
        const checkAuth = () => {
            const token = Cookies.get('token');
            const role = Cookies.get('role');

            if (!token) {
                setIsAuthenticated(false);
                setUser(null);
                setLoading(false);

                if (requiredRole) {
                    router.push('/');
                }
                return;
            }

            const userData = {
                token,
                role
            };

            setUser(userData);
            setIsAuthenticated(true);

            if (requiredRole && role !== requiredRole) {
                if (role === 'Admin') {
                    router.push('/admin/articles');
                } else if (role === 'User') {
                    router.push('/articles/list');
                } else {
                    logout();
                }
                return;
            }

            setLoading(false);
        };

        checkAuth();
    }, [requiredRole, router, logout]);

    const hasRole = useCallback((role) => {
        return user ?.role === role;
    }, [user]);

    const isAdmin = useCallback(() => hasRole('Admin'), [hasRole]);
    const isUser = useCallback(() => hasRole('User'), [hasRole]);

    return {
        user,
        loading,
        isAuthenticated,
        logout,
        hasRole,
        isAdmin,
        isUser
    };
};