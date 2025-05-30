import { ObjectId } from 'mongodb';
import { getCollection, getDocumentById, insertDocument, updateDocument, deleteDocument } from './db';
import bcrypt from 'bcryptjs';

// Get all users
export async function getUsers() {
  try {
    const collection = await getCollection('users');
    // Exclude password from results
    return collection.find({}).project({ password: 0 }).toArray();
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

// Get a user by ID
export async function getUser(id) {
  try {
    const collection = await getCollection('users');
    return collection.findOne({ _id: new ObjectId(id) }, { projection: { password: 0 } });
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
}

// Get a user by email
export async function getUserByEmail(email) {
  try {
    const collection = await getCollection('users');
    return collection.findOne({ email });
  } catch (error) {
    console.error('Error fetching user by email:', error);
    throw error;
  }
}

// Create a new user
export async function createUser(userData) {
  try {
    // Check if user already exists
    const existingUser = await getUserByEmail(userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    // Create user object with hashed password
    const user = {
      ...userData,
      password: hashedPassword,
      role: userData.role || 'customer', // Default role
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await insertDocument('users', user);
    
    // Return user without password
    const { password, ...userWithoutPassword } = user;
    return { ...userWithoutPassword, _id: result.insertedId };
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

// Update a user
export async function updateUser(id, userData) {
  try {
    // If password is being updated, hash it
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }
    
    // Add updated timestamp
    userData.updatedAt = new Date();
    
    const result = await updateDocument('users', new ObjectId(id), userData);
    return result;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

// Delete a user
export async function deleteUser(id) {
  try {
    return deleteDocument('users', new ObjectId(id));
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}

// Authenticate a user
export async function authenticateUser(email, password) {
  try {
    const user = await getUserByEmail(email);
    
    if (!user) {
      return null;
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return null;
    }
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    console.error('Error authenticating user:', error);
    throw error;
  }
}