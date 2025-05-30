import { NextResponse } from 'next/server';

export async function POST() {
  // Create response
  const response = NextResponse.json({
    success: true,
    message: 'Logged out successfully'
  });
  
  // Clear the auth cookie
  response.cookies.set({
    name: 'auth_token',
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(0), // Expire immediately
    sameSite: 'strict',
    path: '/'
  });
  
  return response;
}