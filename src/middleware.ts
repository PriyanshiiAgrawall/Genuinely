//config -  kha kha pe middleware run kare

import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";


export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET, cookieName: "next-auth.session-token" });
    console.log("hello", token);
    const url = request.nextUrl;

    if (
        token &&
        (url.pathname === '/sign-in' ||
            url.pathname === '/sign-up' ||
            url.pathname === '/' ||
            url.pathname.startsWith('/verify')) &&
        url.pathname !== '/dashboard'
    ) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    if (!token && url.pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/sign-in', request.url));
    }
    return NextResponse.next();
}




export const config = {
    matcher: [
        "/sign-in",
        "/sign-up",
        "/dashboard/:path*",
        "/",

    ]
}
