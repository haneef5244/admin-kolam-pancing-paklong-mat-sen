import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const exceptions = [
    '/home',
    '/scan-qr',
    '/booking-pengguna',
    '/booking-manual',
    '/urus-tempahan'
]
export async function middleware(request) {
    if (exceptions.filter(e => request.nextUrl.pathname.startsWith(e)) == 0) {
        return NextResponse.next();
    }
    const token = cookies().get('token');
    const tokenValue = token?.value;

    if (!tokenValue) {
        const url = request.nextUrl.clone()
        url.pathname = '/'
        return NextResponse.redirect(url);
    } else {
        const requestHeaders = new Headers(request.headers);
        requestHeaders.set('x-url', request.url);

        return NextResponse.next({
            request: {
                // Apply new request headers
                headers: requestHeaders,
            }
        });
    }
}