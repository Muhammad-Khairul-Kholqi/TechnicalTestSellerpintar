// import {
//     NextResponse
// } from 'next/server';

// export function middleware(request) {
//     const token = request.cookies.get('token') ?.value;
//     const role = request.cookies.get('role') ?.value;
//     const pathname = request.nextUrl.pathname;

//     const protectedRoutes = ['/admin', '/articles/list'];

//     const adminRoutes = ['/admin'];

//     const userRoutes = ['/articles/list'];

//     const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
//     const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));
//     const isUserRoute = userRoutes.some(route => pathname.startsWith(route));

//     if (isProtectedRoute && !token) {
//         return NextResponse.redirect(new URL('/', request.url));
//     }

//     if (isAdminRoute && role !== 'Admin') {
//         return NextResponse.redirect(new URL('/articles/list', request.url));
//     }

//     if (isUserRoute && role === 'Admin') {
//         return NextResponse.redirect(new URL('/admin/articles', request.url));
//     }

//     if (pathname === '/' && token) {
//         if (role === 'Admin') {
//             return NextResponse.redirect(new URL('/admin/articles', request.url));
//         } else if (role === 'User') {
//             return NextResponse.redirect(new URL('/articles/list', request.url));
//         }
//     }

//     return NextResponse.next();
// }

// export const config = {
//     matcher: [
//         '/admin/:path*',
//         '/articles/list/:path*',
//         '/',
//     ]
// };