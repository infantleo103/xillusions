import { NextResponse } from 'next/server';
import { getOrderById } from '@/lib/db/orders';
import jwt from 'jsonwebtoken';

// JWT secret key - in production, use a strong secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware to check if user is admin
async function isAdmin(request) {
  const token = request.cookies.get('auth_token')?.value;
  
  if (!token) {
    return false;
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded.role === 'admin';
  } catch (error) {
    return false;
  }
}

// GET - Fetch a single order by ID
export async function GET(request, { params }) {
  try {
    // Check if user is admin
    const adminCheck = await isAdmin(request);
    
    if (!adminCheck) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }
    
    const { id } = params;
    
    // Get order from database
    const order = await getOrderById(id);
    
    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}