import { NextResponse } from 'next/server';
import { toggleProductStatus, getProduct } from '@/lib/db/products';

// Toggle product stock status (admin only)
export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Check if product exists first
    const existingProduct = await getProduct(id);
    if (!existingProduct) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    const result = await toggleProductStatus(id);
    
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    // Get the updated product to return the new status
    const updatedProduct = await getProduct(id);

    return NextResponse.json({ 
      success: true, 
      message: `Product status updated to ${updatedProduct.inStock ? 'in stock' : 'out of stock'}`,
      inStock: updatedProduct.inStock,
      data: {
        id: updatedProduct._id.toString(),
        inStock: updatedProduct.inStock
      }
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { success: false, error: 'An error occurred while updating product status' },
      { status: 500 }
    );
  }
}

// Alternative POST method for toggle (some clients prefer POST for state changes)
export async function POST(request, { params }) {
  return PATCH(request, { params });
}