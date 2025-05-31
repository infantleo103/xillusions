import { NextResponse } from 'next/server';
import { updateUser, getUserById } from '@/lib/db/users';
import jwt from 'jsonwebtoken';

// JWT secret key - in production, use a strong secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function PUT(request) {
  try {
    // Get the token from cookies
    const token = request.cookies.get('auth_token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' }, 
        { status: 401 }
      );
    }
    
    try {
      // Verify the token
      const decoded = jwt.verify(token, JWT_SECRET);
      
      // Get the updated user data from the request
      const updatedUserData = await request.json();
      
      // Update the user in the database
      const result = await updateUser(decoded.userId, {
        name: updatedUserData.name,
        mobile: updatedUserData.mobile,
        address: updatedUserData.address,
      });
      
      if (!result.success) {
        return NextResponse.json(
          { success: false, error: 'Failed to update user' }, 
          { status: 400 }
        );
      }
      
      // Get the updated user from the database
      const updatedUser = await getUserById(decoded.userId);
      
      if (!updatedUser) {
        return NextResponse.json(
          { success: false, error: 'User not found' }, 
          { status: 404 }
        );
      }
      
      // Return user without password
      const { password, ...userWithoutPassword } = updatedUser;
      
      return NextResponse.json({ 
        success: true, 
        user: userWithoutPassword 
      });
    } catch (err) {
      // Token verification failed
      return NextResponse.json(
        { success: false, error: 'Invalid token' }, 
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}