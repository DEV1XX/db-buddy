import mongoose from 'mongoose';
import { ENV } from './env.js';

export const connectDB = async () => {
    try {
        await mongoose.connect(ENV.APP_DB_URI, {
            serverSelectionTimeoutMS: 50000, // Optional: increase if needed
        });
        console.log("✅ Connected to MongoDB!");
    } catch (error) {
        console.error("❌ MongoDB connection error:", error.message);
        process.exit(1); // Exit the app if DB connection fails
    }
}