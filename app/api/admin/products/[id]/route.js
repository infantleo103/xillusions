import { NextResponse } from 'next/server';
import { getProduct, updateProduct, deleteProduct } from '@/lib/db/products';

// Get a specific product by ID (admin view)
export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const product = await getProduct(id);
    
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      data: product 
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

// Update a specific product (admin only)
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Validate required fields if they are being updated
    if (body.name !== undefined && !body.name.trim()) {
      return NextResponse.json(
        { success: false, error: 'Product name cannot be empty' },
        { status: 400 }
      );
    }

    if (body.price !== undefined && (isNaN(body.price) || parseFloat(body.price) <= 0)) {
      return NextResponse.json(
        { success: false, error: 'Price must be a positive number' },
        { status: 400 }
      );
    }

    // Clean up the update data
    const cleanUpdateData = {};
    Object.keys(body).forEach(key => {
      if (body[key] !== undefined) {
        if (typeof body[key] === 'string') {
          cleanUpdateData[key] = body[key].trim();
        } else {
          cleanUpdateData[key] = body[key];
        }
      }
    });

    const result = await updateProduct(id, cleanUpdateData);
    
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Product updated successfully',
      data: result
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { success: false, error: 'An error occurred while updating the product' },
      { status: 500 }
    );
  }
}

// Delete a specific product (admin only)
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const result = await deleteProduct(id);
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { success: false, error: 'An error occurred while deleting the product' },
      { status: 500 }
    );
  }
}