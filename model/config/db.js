const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 30000,         
    });
    console.log(`Database Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Database connection error:", error);
  }
};

module.exports = connectDB;

