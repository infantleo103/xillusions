import { NextResponse } from 'next/server';
import { getProducts, createProduct, updateProduct, deleteProduct } from '@/lib/db/products';

// Get all products (admin view - includes all products regardless of stock status)
export async function GET(request) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || 'all';
    const productFor = searchParams.get('productFor') || 'all';
    const inStock = searchParams.get('inStock') !== null 
      ? searchParams.get('inStock') === 'true' 
      : undefined;
    
    // Build filters object (admin can see all products)
    const filters = {
      search,
      category: category !== 'all' ? category : undefined,
      productFor: productFor !== 'all' ? productFor : undefined
    };
    
    const products = await getProducts(filters);
    
    // Transform products to match the expected format
    const transformedProducts = products.map(product => ({
      id: product._id.toString(),
      name: product.name,
      category: product.category || 'general',
      price: product.price,
      originalPrice: product.originalPrice || product.price,
      description: product.description || '',
      stock: product.stock || 0,
      image: product.image || '',
      frontImage: product.frontImage || product.image || '',
      backImage: product.backImage || '',
      badge: product.badge || '',
      productFor: product.productFor === 'customization' ? 'customization' : 'sale',
      rating: product.rating || 0,
      reviews: product.reviews || 0,
      featured: product.featured || false,
      customizable: product.productFor === 'customization',
      inStock: product.inStock !== undefined ? product.inStock : true,
      sizes: product.sizes || [],
      colors: product.colors || [],
      createdAt: product.createdAt || new Date().toISOString(),
      updatedAt: product.updatedAt || new Date().toISOString()
    }));
    
    return NextResponse.json({ 
      success: true, 
      products: transformedProducts,
      data: transformedProducts // For compatibility with client-products.js
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// Create a new product (admin only)
export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validate the request body
    if (!body.name || !body.price) {
      return NextResponse.json(
        { success: false, error: 'Name and price are required' },
        { status: 400 }
      );
    }

    // Validate price is a positive number
    if (isNaN(body.price) || parseFloat(body.price) <= 0) {
      return NextResponse.json(
        { success: false, error: 'Price must be a positive number' },
        { status: 400 }
      );
    }

    // Set default values for required fields
    const productData = {
      name: body.name.trim(),
      description: body.description?.trim() || '',
      price: parseFloat(body.price),
      image: body.image?.trim() || '',
      category: body.category || 'general',
      productFor: body.productFor || 'all',
      inStock: body.inStock !== undefined ? body.inStock : true,
      featured: body.featured !== undefined ? body.featured : false,
      rating: body.rating || 0,
      reviews: body.reviews || 0,
      stock: body.stock || 0,
      costPrice: body.costPrice || 0,
      tags: body.tags || [],
      specifications: body.specifications || {},
      variants: body.variants || [],
      dimensions: body.dimensions || {},
      weight: body.weight || 0,
      material: body.material || '',
      color: body.color || '',
      size: body.size || '',
      brand: body.brand || '',
      sku: body.sku || `SKU-${Date.now()}`,
      barcode: body.barcode || '',
      warranty: body.warranty || '',
      returnPolicy: body.returnPolicy || '',
      shippingInfo: body.shippingInfo || {},
      seoTitle: body.seoTitle || body.name,
      seoDescription: body.seoDescription || body.description,
      seoKeywords: body.seoKeywords || [],
      metaData: body.metaData || {}
    };
    
    const product = await createProduct(productData);
    
    // Transform the response to match the expected format
    const transformedProduct = {
      id: product._id.toString(),
      name: product.name,
      category: product.category,
      price: product.price,
      originalPrice: product.originalPrice || product.price,
      description: product.description,
      stock: product.stock,
      image: product.image,
      frontImage: product.frontImage || product.image,
      backImage: product.backImage || '',
      badge: product.badge || '',
      productFor: product.productFor === 'customization' ? 'customization' : 'sale',
      rating: product.rating,
      reviews: product.reviews,
      featured: product.featured,
      customizable: product.productFor === 'customization',
      inStock: product.inStock,
      sizes: product.sizes || [],
      colors: product.colors || [],
      createdAt: product.createdAt,
      updatedAt: product.updatedAt
    };
    
    return NextResponse.json({ 
      success: true, 
      message: 'Product created successfully',
      product: transformedProduct,
      data: transformedProduct // For compatibility with client-products.js
    }, { status: 201 });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { success: false, error: 'An error occurred while saving the product' },
      { status: 500 }
    );
  }
}

// Update a product (admin only)
export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Validate required fields if they are being updated
    if (updateData.name !== undefined && !updateData.name.trim()) {
      return NextResponse.json(
        { success: false, error: 'Product name cannot be empty' },
        { status: 400 }
      );
    }

    if (updateData.price !== undefined && (isNaN(updateData.price) || parseFloat(updateData.price) <= 0)) {
      return NextResponse.json(
        { success: false, error: 'Price must be a positive number' },
        { status: 400 }
      );
    }

    // Clean up the update data
    const cleanUpdateData = {};
    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        if (typeof updateData[key] === 'string') {
          cleanUpdateData[key] = updateData[key].trim();
        } else {
          cleanUpdateData[key] = updateData[key];
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

// Delete a product (admin only)
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
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