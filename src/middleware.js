import { NextResponse } from "next/server";

export function middleware(request) {
    const response = NextResponse.next();
    // Inject pathname as a header so layout.js can conditionally show Navbar/Footer
    response.headers.set("x-pathname", request.nextUrl.pathname);
    return response;
}

export const config = {
    // Run on all routes except static files and Next.js internals
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
