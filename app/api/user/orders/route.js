import { NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

// MongoDB connection
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/";
const dbName = process.env.MONGODB_DB || "final";

// JWT secret key - in production, use a strong secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware to check if user is authenticated
async function isAuthenticated(request) {
  const token = request.cookies.get('auth_token')?.value;
  
  if (!token) {
    return false;
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    return false;
  }
}

// GET - Fetch user's orders
export async function GET(request) {
  try {
    // Check if user is authenticated
    const user = await isAuthenticated(request);
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const client = new MongoClient(uri);
    
    try {
      await client.connect();
      const db = client.db(dbName);
      const ordersCollection = db.collection('orders');
      
      // Get query parameters
      const { searchParams } = new URL(request.url);
      const limit = parseInt(searchParams.get('limit') || '10');
      
      // Find orders for this user, sorted by createdAt descending (newest first)
      const orders = await ordersCollection
        .find({ userId: user.id })
        .sort({ createdAt: -1 })
        .limit(limit)
        .toArray();
      
      // Convert MongoDB _id to id for frontend compatibility
      const formattedOrders = orders.map(order => ({
        ...order,
        id: order._id.toString()
      }));
      
      return NextResponse.json({
        success: true,
        orders: formattedOrders
      });
    } finally {
      await client.close();
    }
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}