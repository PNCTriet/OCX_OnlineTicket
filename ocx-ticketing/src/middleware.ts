import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Import launch config
  const { LAUNCH_CONFIG } = await import('./config/launch');
  
  const currentDate = new Date();
  
  // Check if current time is before launch date
  const isBeforeLaunch = currentDate < LAUNCH_CONFIG.LAUNCH_DATE;
  
  // Get the pathname
  const pathname = request.nextUrl.pathname;
  
  // Check if we've already redirected to prevent loops
  const hasRedirected = request.cookies.get('launch-redirect')?.value;
  
  // Debug logging
  console.log('Middleware check:', {
    currentDate: currentDate.toISOString(),
    launchDate: LAUNCH_CONFIG.LAUNCH_DATE.toISOString(),
    isBeforeLaunch,
    pathname,
    hasRedirected,
    shouldRedirectToLaunch: isBeforeLaunch && pathname !== '/launch',
    shouldRedirectToHome: !isBeforeLaunch && pathname === '/launch'
  });
  
  // Allow access to launch page and static assets
  if (pathname === '/launch' || 
      pathname.startsWith('/_next') || 
      pathname.startsWith('/api') ||
      pathname.startsWith('/images') ||
      pathname.startsWith('/fonts') ||
      pathname.startsWith('/public') ||
      pathname.startsWith('/lottie')) {
    return NextResponse.next();
  }
  
  // If before launch and not on launch page, redirect to launch
  if (isBeforeLaunch && pathname !== '/launch' && hasRedirected !== 'to-launch') {
    console.log('Redirecting to launch page');
    const response = NextResponse.redirect(new URL('/launch', request.url));
    response.cookies.set('launch-redirect', 'to-launch', { maxAge: 60 }); // 1 minute
    return response;
  }
  
  // If after launch and on launch page, redirect to home
  if (!isBeforeLaunch && pathname === '/launch' && hasRedirected !== 'to-home') {
    console.log('Redirecting to home page');
    const response = NextResponse.redirect(new URL('/', request.url));
    response.cookies.set('launch-redirect', 'to-home', { maxAge: 60 }); // 1 minute
    return response;
  }

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

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 