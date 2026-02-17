
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // refresh session if expired - required for Server Components
    // https://supabase.com/docs/guides/auth/server-side/nextjs
    const {
        data: { user },
    } = await supabase.auth.getUser()

    // Protect routes
    if (
        !user &&
        !request.nextUrl.pathname.startsWith('/login') &&
        !request.nextUrl.pathname.startsWith('/auth') &&
        request.nextUrl.pathname !== '/'
    ) {
        // If accessing protected route without user, redirect to login
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url)
    }

    // If user is logged in, check profile completion
    if (user) {
        // If on login page, redirect to dashboard or profile
        if (request.nextUrl.pathname.startsWith('/login')) {
            // Ideally check profile completion here too, but simple redirect to dashboard is okay
            // Dashboard handles profile check? Or check here.
            // Checking DB in middleware for every request can be slow.
            // Let's rely on client side or page level check for profile completion, 
            // OR check a lightweight flag in metadata if possible. 
            // For MVP, allow redirect to dashboard, dashboard can check profile.
            const url = request.nextUrl.clone()
            url.pathname = '/dashboard'
            return NextResponse.redirect(url)
        }

        // Check profile completion for protected routes
        // We can do this by checking a 'profile_complete' claim or querying DB.
        // Querying DB:
        /*
        const { data: profile } = await supabase
          .from('profiles')
          .select('completed_profile')
          .eq('id', user.id)
          .single()
        
        if (profile && !profile.completed_profile && !request.nextUrl.pathname.startsWith('/profile')) {
            const url = request.nextUrl.clone()
            url.pathname = '/profile'
            return NextResponse.redirect(url)
        }
        */
        // For performance in MVP, I'll skip DB query in middleware for every request unless critical.
        // Instead, I'll enforce it on likely entry points or main layout.
        // But the prompt says "Make sure... the next required stage is the completion of the profile."
        // I'll implement a simple check in the Dashboard layout.
    }

    return supabaseResponse
}
