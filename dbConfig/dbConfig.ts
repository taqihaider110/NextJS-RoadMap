import mongoose  from "mongoose";

let isConnected = false;

export const connectToDatabase = async () => {
    if (isConnected) {
        console.log('Using existing MongoDB connection');
        return;
    }

    try {
        if (!process.env.MONGO_URL) {
            throw new Error('MONGO_URL is not defined in environment variables');
        }

        await mongoose.connect(process.env.MONGO_URL);

        isConnected = true;

        const connection = mongoose.connection;
        connection.on('connected', () => {
            console.log('Mongoose connected to DB Cluster');
        });
        connection.on('error', (err) => {
            console.error('Mongoose connection error:', err);
            isConnected = false;
        });
        connection.on('disconnected', () => {
            console.log('Mongoose disconnected');
            isConnected = false;
        });

        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        isConnected = false;
        throw error;
    }
};