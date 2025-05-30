const { MongoClient } = require('mongodb');

// MongoDB connection
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/";
const dbName = process.env.MONGODB_DB || "final";

async function initCounters() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(dbName);
    const countersCollection = db.collection('counters');
    
    // Check if order counter already exists
    const orderCounter = await countersCollection.findOne({ _id: 'orderNumber' });
    
    if (!orderCounter) {
      // Initialize order counter
      await countersCollection.insertOne({
        _id: 'orderNumber',
        seq: 0
      });
      console.log('Order number counter initialized');
    } else {
      console.log('Order number counter already exists:', orderCounter);
    }
    
  } catch (error) {
    console.error('Error initializing counters:', error);
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

// Run the initialization function
initCounters().catch(console.error);