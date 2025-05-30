import { NextResponse } from 'next/server';
import { searchProducts } from '@/lib/products';

export async function GET(request) {
  try {
    // Get query and limit from query parameters
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    
    if (!query) {
      return NextResponse.json(
        { success: false, error: 'Search query is required' },
        { status: 400 }
      );
    }
    
    const products = await searchProducts(query, limit);
    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to search products' },
      { status: 500 }
    );
  }
}