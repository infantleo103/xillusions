import { ObjectId } from 'mongodb';
import { getCollection, getAllDocuments, getDocumentById, insertDocument, updateDocument, deleteDocument } from '../db';

/**
 * Get all categories with optional filtering
 * @param {Object} filters - Optional filters for the query
 * @param {string} filters.search - Search term for name or description
 * @param {string} filters.status - Filter by status (active/inactive)
 * @returns {Promise<Array>} Array of categories
 */
export async function getCategories(filters = {}) {
  try {
    const collection = await getCollection('categories');
    
    // Build the query based on filters
    const query = {};
    
    if (filters.search) {
      query.$or = [
        { name: { $regex: filters.search, $options: 'i' } },
        { description: { $regex: filters.search, $options: 'i' } }
      ];
    }
    
    if (filters.status) {
      query.status = filters.status;
    }
    
    // Execute the query
    return collection.find(query).toArray();
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
}

/**
 * Get a category by ID
 * @param {string} id - Category ID
 * @returns {Promise<Object>} Category object
 */
export async function getCategory(id) {
  try {
    return getDocumentById('categories', new ObjectId(id));
  } catch (error) {
    console.error('Error fetching category:', error);
    throw error;
  }
}

/**
 * Get a category by slug
 * @param {string} slug - Category slug
 * @returns {Promise<Object>} Category object
 */
export async function getCategoryBySlug(slug) {
  try {
    const collection = await getCollection('categories');
    return collection.findOne({ slug });
  } catch (error) {
    console.error('Error fetching category by slug:', error);
    throw error;
  }
}

/**
 * Create a new category
 * @param {Object} categoryData - Category data
 * @param {string} categoryData.name - Category name
 * @param {string} categoryData.slug - Category slug
 * @param {string} [categoryData.description] - Category description
 * @param {string} [categoryData.image] - Category image URL
 * @param {string} [categoryData.status="active"] - Category status
 * @returns {Promise<Object>} Created category
 */
export async function createCategory(categoryData) {
  try {
    // Validate required fields
    if (!categoryData.name || !categoryData.slug) {
      throw new Error('Name and slug are required');
    }
    
    // Check if slug already exists
    const existingCategory = await getCategoryBySlug(categoryData.slug);
    if (existingCategory) {
      throw new Error('A category with this slug already exists');
    }
    
    // Add timestamps and default values
    const category = {
      ...categoryData,
      status: categoryData.status || 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await insertDocument('categories', category);
    return { ...category, _id: result.insertedId };
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
}

/**
 * Update a category
 * @param {string} id - Category ID
 * @param {Object} categoryData - Category data to update
 * @returns {Promise<Object>} Update result
 */
export async function updateCategory(id, categoryData) {
  try {
    // If slug is being updated, check if it already exists
    if (categoryData.slug) {
      const existingCategory = await getCategoryBySlug(categoryData.slug);
      if (existingCategory && existingCategory._id.toString() !== id.toString()) {
        throw new Error('A category with this slug already exists');
      }
    }
    
    // Add updated timestamp
    const category = {
      ...categoryData,
      updatedAt: new Date()
    };
    
    const result = await updateDocument('categories', new ObjectId(id), category);
    return result;
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
}

/**
 * Delete a category
 * @param {string} id - Category ID
 * @returns {Promise<Object>} Delete result
 */
export async function deleteCategory(id) {
  try {
    return deleteDocument('categories', new ObjectId(id));
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
}

/**
 * Toggle category status (active/inactive)
 * @param {string} id - Category ID
 * @returns {Promise<Object>} Update result with new status
 */
export async function toggleCategoryStatus(id) {
  try {
    const category = await getCategory(id);
    if (!category) {
      throw new Error('Category not found');
    }
    
    const newStatus = category.status === 'active' ? 'inactive' : 'active';
    
    const result = await updateDocument(
      'categories', 
      new ObjectId(id), 
      { 
        status: newStatus,
        updatedAt: new Date()
      }
    );
    
    return { ...result, status: newStatus };
  } catch (error) {
    console.error('Error toggling category status:', error);
    throw error;
  }
}

/**
 * Get active categories
 * @returns {Promise<Array>} Array of active categories
 */
export async function getActiveCategories() {
  try {
    const collection = await getCollection('categories');
    return collection.find({ status: 'active' }).toArray();
  } catch (error) {
    console.error('Error fetching active categories:', error);
    throw error;
  }
}