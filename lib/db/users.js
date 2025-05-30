import { MongoClient, ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';

// MongoDB connection
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/";
const dbName = process.env.MONGODB_DB || "final";

// Connect to MongoDB
async function connectToDatabase() {
  const client = new MongoClient(uri);
  await client.connect();
  return client.db(dbName);
}

// Create a new user
export async function createUser(userData) {
  const db = await connectToDatabase();
  const usersCollection = db.collection('users');
  
  // Check if user already exists
  const existingUser = await usersCollection.findOne({ email: userData.email });
  if (existingUser) {
    return { success: false, error: 'User with this email already exists' };
  }
  
  // Hash the password
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  
  // Create user object
  const newUser = {
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    mobile: userData.mobile,
    password: hashedPassword,
    role: 'customer',
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  // Insert user into database
  const result = await usersCollection.insertOne(newUser);
  
  if (result.acknowledged) {
    // Return user without password
    const { password, ...userWithoutPassword } = newUser;
    return { 
      success: true, 
      user: { ...userWithoutPassword, _id: result.insertedId } 
    };
  } else {
    return { success: false, error: 'Failed to create user' };
  }
}

// Get user by email
export async function getUserByEmail(email) {
  const db = await connectToDatabase();
  const usersCollection = db.collection('users');
  return usersCollection.findOne({ email });
}

// Get user by ID
export async function getUserById(id) {
  const db = await connectToDatabase();
  const usersCollection = db.collection('users');
  return usersCollection.findOne({ _id: new ObjectId(id) });
}

// Authenticate user
export async function authenticateUser(email, password) {
  const user = await getUserByEmail(email);
  
  if (!user) {
    return { success: false, error: 'Invalid email or password' };
  }
  
  const isPasswordValid = await bcrypt.compare(password, user.password);
  
  if (!isPasswordValid) {
    return { success: false, error: 'Invalid email or password' };
  }
  
  // Return user without password
  const { password: _, ...userWithoutPassword } = user;
  return { success: true, user: userWithoutPassword };
}

// Update user
export async function updateUser(id, userData) {
  const db = await connectToDatabase();
  const usersCollection = db.collection('users');
  
  // If password is being updated, hash it
  if (userData.password) {
    userData.password = await bcrypt.hash(userData.password, 10);
  }
  
  // Add updated timestamp
  userData.updatedAt = new Date();
  
  const result = await usersCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: userData }
  );
  
  return { success: result.modifiedCount > 0 };
}

// Get all users
export async function getAllUsers() {
  const db = await connectToDatabase();
  const usersCollection = db.collection('users');
  
  // Exclude passwords from results
  const users = await usersCollection.find({}).project({ password: 0 }).toArray();
  return users;
}