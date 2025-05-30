import { ObjectId } from 'mongodb';
import { getCollection, getAllDocuments, getDocumentById, insertDocument, updateDocument, deleteDocument } from '../db';

// Get all products with optional filtering
export async function getProducts(filters = {}) {
  try {
    const collection = await getCollection('products');
    
    // Build the query based on filters
    const query = {};
    
    if (filters.search) {
      query.$or = [
        { name: { $regex: filters.search, $options: 'i' } },
        { description: { $regex: filters.search, $options: 'i' } }
      ];
    }
    
    if (filters.category && filters.category !== 'all') {
      query.category = filters.category;
    }
    
    if (filters.productFor && filters.productFor !== 'all') {
      query.productFor = filters.productFor;
    }
    
    if (filters.inStock !== undefined) {
      query.inStock = filters.inStock;
    }
    
    // Execute the query
    return collection.find(query).toArray();
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

// Get a product by ID
export async function getProduct(id) {
  try {
    return getDocumentById('products', new ObjectId(id));
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
}

// Create a new product
export async function createProduct(productData) {
  try {
    // Add timestamps
    const product = {
      ...productData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await insertDocument('products', product);
    return { ...product, _id: result.insertedId };
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
}

// Update a product
export async function updateProduct(id, productData) {
  try {
    // Add updated timestamp
    const product = {
      ...productData,
      updatedAt: new Date()
    };
    
    const result = await updateDocument('products', new ObjectId(id), product);
    return result;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
}

// Delete a product
export async function deleteProduct(id) {
  try {
    return deleteDocument('products', new ObjectId(id));
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
}

// Toggle product stock status
export async function toggleProductStatus(id) {
  try {
    const product = await getProduct(id);
    if (!product) {
      throw new Error('Product not found');
    }
    
    const result = await updateDocument(
      'products', 
      new ObjectId(id), 
      { 
        inStock: !product.inStock,
        updatedAt: new Date()
      }
    );
    
    return result;
  } catch (error) {
    console.error('Error toggling product status:', error);
    throw error;
  }
}

// Get featured products
export async function getFeaturedProducts(limit = 8) {
  try {
    const collection = await getCollection('products');
    return collection.find({ featured: true, inStock: true }).limit(limit).toArray();
  } catch (error) {
    console.error('Error fetching featured products:', error);
    throw error;
  }
}

// Get products by category
export async function getProductsByCategory(category, limit = 12) {
  try {
    const collection = await getCollection('products');
    return collection.find({ category, inStock: true }).limit(limit).toArray();
  } catch (error) {
    console.error('Error fetching products by category:', error);
    throw error;
  }
}

// Get new arrivals
export async function getNewArrivals(limit = 8) {
  try {
    const collection = await getCollection('products');
    return collection.find({ inStock: true }).sort({ createdAt: -1 }).limit(limit).toArray();
  } catch (error) {
    console.error('Error fetching new arrivals:', error);
    throw error;
  }
}

// Get customizable products
export async function getCustomizableProducts(limit = 8) {
  try {
    const collection = await getCollection('products');
    return collection.find({ productFor: 'customization', inStock: true }).limit(limit).toArray();
  } catch (error) {
    console.error('Error fetching customizable products:', error);
    throw error;
  }
}

// Search products
export async function searchProducts(query, limit = 20) {
  try {
    const collection = await getCollection('products');
    return collection.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } }
      ],
      inStock: true
    }).limit(limit).toArray();
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
}