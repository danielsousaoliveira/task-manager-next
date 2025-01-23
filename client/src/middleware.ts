import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/profile", "/tasks"];

export default async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;
    const isProtectedRoute = protectedRoutes.includes(path);

    const token = req.cookies.get("token")?.value;

    if (isProtectedRoute && !token) {
        return NextResponse.redirect(new URL("/login", req.nextUrl));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
