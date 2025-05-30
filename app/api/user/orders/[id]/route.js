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

// GET - Fetch a specific order by ID
export async function GET(request, { params }) {
  try {
    // Check if user is authenticated
    const user = await isAuthenticated(request);
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { id } = params;
    const client = new MongoClient(uri);
    
    try {
      await client.connect();
      const db = client.db(dbName);
      const ordersCollection = db.collection('orders');
      
      // Find the order by ID
      let objectId;
      try {
        objectId = new ObjectId(id);
      } catch (error) {
        return NextResponse.json(
          { success: false, error: 'Invalid order ID' },
          { status: 400 }
        );
      }
      
      const order = await ordersCollection.findOne({ _id: objectId });
      
      if (!order) {
        return NextResponse.json(
          { success: false, error: 'Order not found' },
          { status: 404 }
        );
      }
      
      // Check if the order belongs to the authenticated user
      if (order.userId !== user.id && user.role !== 'admin') {
        return NextResponse.json(
          { success: false, error: 'You do not have permission to view this order' },
          { status: 403 }
        );
      }
      
      // Convert MongoDB _id to id for frontend compatibility
      const formattedOrder = {
        ...order,
        id: order._id.toString()
      };
      
      return NextResponse.json({
        success: true,
        order: formattedOrder
      });
    } finally {
      await client.close();
    }
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}