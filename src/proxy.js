import { NextResponse } from 'next/server'
import { auth } from './lib/auth'
import { headers } from 'next/headers'

export async function proxy(request) { 
    const { pathname } = request.nextUrl
    const isDashboardRoute = pathname.startsWith('/dashboard')

    const session = await auth.api.getSession({
        headers: await headers(),
        query: isDashboardRoute ? { disableCookieCache: true } : {}
    })

   
    if (!session) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

   
    if (session?.user?.role === "seller") {
        return NextResponse.redirect(new URL('/pricing', request.url))
    }

   
    if (isDashboardRoute) {
        const role = session?.user?.role;

      
        if (role === "buyer" && !pathname.startsWith('/dashboard/buyer')) {
            return NextResponse.redirect(new URL('/dashboard/buyer', request.url))
        }


        if (role === "seller" && !pathname.startsWith('/dashboard/seller')) {
            return NextResponse.redirect(new URL('/dashboard/seller', request.url))
        }


        if (role === "admin" && !pathname.startsWith('/dashboard/admin')) {
            return NextResponse.redirect(new URL('/dashboard/admin', request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
   
    matcher: ['/products/:id', '/products/:id/:slug', '/dashboard/seller'],
}