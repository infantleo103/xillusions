import { NextResponse } from 'next/server';
import { getUserById } from '@/lib/db/users';
import jwt from 'jsonwebtoken';

// JWT secret key - in production, use a strong secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(request) {
  try {
    // Get the token from cookies
    const token = request.cookies.get('auth_token')?.value;
    
    if (!token) {
      return NextResponse.json({ success: false, message: 'Not authenticated' });
    }
    
    try {
      // Verify the token
      const decoded = jwt.verify(token, JWT_SECRET);
      
      // Get user from database
      const user = await getUserById(decoded.userId);
      
      if (!user) {
        return NextResponse.json({ success: false, message: 'User not found' });
      }
      
      // Return user data without password
      const { password, ...userWithoutPassword } = user;
      
      return NextResponse.json({ 
        success: true, 
        user: userWithoutPassword
      });
    } catch (err) {
      // Token verification failed
      return NextResponse.json({ success: false, message: 'Invalid token' });
    }
  } catch (error) {
    console.error('Session error:', error);
    return NextResponse.json(
      { success: false, error: 'An error occurred while checking session' },
      { status: 500 }
    );
  }
}