import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Import launch config
  const { LAUNCH_CONFIG } = await import('./config/launch');
  
  const currentTime = new Date();
  const launchTime = new Date(LAUNCH_CONFIG.LAUNCH_TIME);
  const isLaunched = currentTime >= launchTime;
  
  // Get the pathname
  const pathname = request.nextUrl.pathname;
  
  // Check if user has already been through launch (cookie)
  const hasLaunchedCookie = request.cookies.get('launch')?.value === '1';
  
  // Allow access to static assets and API routes
  if (pathname.startsWith('/_next') || 
      pathname.startsWith('/api') ||
      pathname.startsWith('/images') ||
      pathname.startsWith('/fonts') ||
      pathname.startsWith('/public') ||
      pathname.startsWith('/lottie') ||
      pathname.startsWith('/auth/callback')) {
    return NextResponse.next();
  }
  
  // If site is launched or user has launch cookie, allow access
  if (isLaunched || hasLaunchedCookie) {
    // Continue with Supabase auth logic
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
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
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

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // If there's no user and the user is trying to access a protected route,
  // redirect them to the login page
  if (!user && request.nextUrl.pathname.startsWith('/checkout')) {
    const redirectUrl = new URL('/auth/login', request.url)
    redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname)
    
    // Preserve ticket data if it exists
    const tickets = request.nextUrl.searchParams.get('tickets')
    if (tickets) {
      redirectUrl.searchParams.set('tickets', tickets)
    }
    
    return NextResponse.redirect(redirectUrl)
  }

    return supabaseResponse
  }
  
  // If not launched and not on launch page, redirect to launch
  if (pathname !== '/launch') {
    console.log('Redirecting to launch page - site not launched yet');
    return NextResponse.redirect(new URL('/launch', request.url));
  }
  
  // If on launch page and not launched, allow access
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (image files)
     * - fonts (font files)
     * - lottie (animation files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images|fonts|lottie).*)',
  ],
} 