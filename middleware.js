import { NextResponse } from 'next/server';

export async function middleware(request) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;
  
  // Check if the path is for admin routes
  const isAdminRoute = path.startsWith('/admin');
  
  // For now, we'll skip the middleware check and handle auth in the component
  // This is a temporary solution until we can properly set up Edge-compatible JWT verification
  
  return NextResponse.next();
}

// Configure the middleware to run only for specific paths
export const config = {
  matcher: [
    '/admin/:path*',
  ],
};