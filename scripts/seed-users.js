const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

// MongoDB connection
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/";
const dbName = process.env.MONGODB_DB || "final";

async function seedUsers() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(dbName);
    const usersCollection = db.collection('users');
    
    // Check if users already exist
    const existingUsers = await usersCollection.countDocuments();
    
    if (existingUsers > 0) {
      console.log('Users collection already has data. Skipping seeding.');
      return;
    }
    
    // Hash passwords
    const adminPassword = await bcrypt.hash('password123', 10);
    const userPassword = await bcrypt.hash('password123', 10);
    
    // Create admin user
    const adminUser = {
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@xillusions.com',
      mobile: '+1234567890',
      password: adminPassword,
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Create regular user
    const regularUser = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      mobile: '+9876543210',
      password: userPassword,
      role: 'customer',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Insert users
    const result = await usersCollection.insertMany([adminUser, regularUser]);
    
    console.log(`${result.insertedCount} users inserted successfully`);
  } catch (error) {
    console.error('Error seeding users:', error);
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

// Run the seed function
seedUsers().catch(console.error);