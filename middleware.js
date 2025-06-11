// middleware.js (letakkan di root folder project)
import {
    NextResponse
} from 'next/server';

export function middleware(request) {
    const token = request.cookies.get('token') ?.value;
    const role = request.cookies.get('role') ?.value;
    const pathname = request.nextUrl.pathname;

    // Routes yang memerlukan autentikasi
    const protectedRoutes = ['/admin', '/articles/list'];

    // Routes khusus admin
    const adminRoutes = ['/admin'];

    // Routes khusus user
    const userRoutes = ['/articles/list'];

    // Cek apakah user mengakses halaman yang dilindungi
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
    const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));
    const isUserRoute = userRoutes.some(route => pathname.startsWith(route));

    // Jika mengakses halaman yang dilindungi tapi tidak ada token
    if (isProtectedRoute && !token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Jika user biasa mencoba akses halaman admin
    if (isAdminRoute && role !== 'Admin') {
        return NextResponse.redirect(new URL('/articles/list', request.url));
    }

    // Jika admin mencoba akses halaman user (opsional)
    if (isUserRoute && role === 'Admin') {
        return NextResponse.redirect(new URL('/admin/articles', request.url));
    }

    // Redirect ke halaman yang sesuai jika user sudah login tapi akses halaman login
    if (pathname === '/login' && token) {
        if (role === 'Admin') {
            return NextResponse.redirect(new URL('/admin/articles', request.url));
        } else if (role === 'User') {
            return NextResponse.redirect(new URL('/articles/list', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        // Protect admin routes
        '/admin/:path*',
        // Protect user routes
        '/articles/list/:path*',
        // Check login page
        '/login',
        // Add other routes that need protection
    ]
};