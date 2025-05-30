import { NextResponse } from 'next/server';
import { getCustomizableProducts } from '@/lib/products';

export async function GET(request) {
  try {
    // Get limit from query parameters
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '8', 10);
    
    const products = await getCustomizableProducts(limit);
    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch customizable products' },
      { status: 500 }
    );
  }
}