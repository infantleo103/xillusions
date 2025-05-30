import { NextResponse } from 'next/server';
import { getProductById, updateProduct, deleteProduct, toggleProductStatus } from '@/lib/db/products';

// Get a specific product by ID
export async function GET(request, { params }) {
  try {
    const id = params.id;
    const product = await getProductById(id);
    
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

// Update a product
export async function PUT(request, { params }) {
  try {
    const id = params.id;
    const body = await request.json();
    
    const result = await updateProduct(id, body);
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Product updated successfully',
      data: result.product
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// Delete a product
export async function DELETE(request, { params }) {
  try {
    const id = params.id;
    const result = await deleteProduct(id);
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
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
      { success: false, error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}

// Toggle product stock status (PATCH method)
export async function PATCH(request, { params }) {
  try {
    const id = params.id;
    const { action } = await request.json();
    
    if (action === 'toggleStatus') {
      const result = await toggleProductStatus(id);
      
      if (!result.success) {
        return NextResponse.json(
          { success: false, error: result.error },
          { status: 404 }
        );
      }
      
      return NextResponse.json({ 
        success: true, 
        message: 'Product status toggled successfully',
        inStock: result.inStock
      });
    }
    
    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update product status' },
      { status: 500 }
    );
  }
}