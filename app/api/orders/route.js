import { NextResponse } from 'next/server';
import { createOrder } from '@/lib/db/orders';
import jwt from 'jsonwebtoken';

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

// POST - Create a new order
export async function POST(request) {
  try {
    // Check if user is authenticated
    const user = await isAuthenticated(request);
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    
    // Validate required fields
    if (!body.items || !body.items.length) {
      return NextResponse.json(
        { success: false, error: 'Order must contain at least one item' },
        { status: 400 }
      );
    }
    
    if (!body.customerInfo) {
      return NextResponse.json(
        { success: false, error: 'Customer information is required' },
        { status: 400 }
      );
    }
    
    // Process items to ensure customization data is properly structured
    const processedItems = body.items.map(item => {
      // If item has customization data, ensure all required fields are present
      if (item.customization) {
        return {
          ...item,
          customization: {
            productId: item.customization.productId,
            elements: item.customization.elements.map(element => ({
              id: element.id,
              type: element.type,
              content: element.content,
              x: element.x,
              y: element.y,
              width: element.width,
              height: element.height,
              rotation: element.rotation,
              fontSize: element.fontSize,
              fontFamily: element.fontFamily,
              color: element.color,
              zIndex: element.zIndex,
              side: element.side,
              originalImageUrl: element.originalImageUrl || null
            })),
            frontPreviewImage: item.customization.frontPreviewImage || null,
            backPreviewImage: item.customization.backPreviewImage || null,
            previewImage: item.customization.previewImage || item.customization.frontPreviewImage || null,
            originalProductImage: item.customization.originalProductImage || item.image || null
          }
        };
      }
      return item;
    });

    // Add user ID to the order data
    const orderData = {
      ...body,
      items: processedItems,
      userId: user.id,
      status: 'pending',
    };
    
    // Create the order in the database
    const result = await createOrder(orderData);
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Order created successfully',
        order: result.order
      });
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    );
  }
}