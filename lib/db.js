import clientPromise from './mongodb';

// Database Name from environment variables
const dbName = process.env.MONGODB_DB || 'xillusions';

// Helper function to get database
export async function getDatabase() {
  const client = await clientPromise;
  return client.db(dbName);
}

// Helper function to get a collection
export async function getCollection(collectionName) {
  const db = await getDatabase();
  return db.collection(collectionName);
}

// Generic function to fetch all documents from a collection
export async function getAllDocuments(collectionName) {
  const collection = await getCollection(collectionName);
  return collection.find({}).toArray();
}

// Generic function to fetch a document by ID
export async function getDocumentById(collectionName, id) {
  const collection = await getCollection(collectionName);
  return collection.findOne({ _id: id });
}

// Generic function to insert a document
export async function insertDocument(collectionName, document) {
  const collection = await getCollection(collectionName);
  return collection.insertOne(document);
}

// Generic function to update a document
export async function updateDocument(collectionName, id, update) {
  const collection = await getCollection(collectionName);
  return collection.updateOne({ _id: id }, { $set: update });
}

// Generic function to delete a document
export async function deleteDocument(collectionName, id) {
  const collection = await getCollection(collectionName);
  return collection.deleteOne({ _id: id });
}

// Generic function to find documents by a query
export async function findDocuments(collectionName, query) {
  const collection = await getCollection(collectionName);
  return collection.find(query).toArray();
}