import mongoose from "mongoose";

type connectionType = {
    isConnected: number | null,
}
const connection: connectionType = {
    isConnected: null,
}

mongoose.connection?.on("disconnected", () => {
    console.log("Mongoose connection lost. Resetting...");
    connection.isConnected = null;
});

async function dbConnect(): Promise<void> {
    // Check if already connected
    if (connection.isConnected !== null) {
        if (mongoose.connection.readyState === 1) {
            console.log("DB is already connected");
            return;
        } else {
            console.log("DB connection lost. Attempting to reconnect...");
            connection.isConnected = null;
        }
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || "");

        // Only set isConnected if the connection was successful
        if (db.connection.readyState === 1) {
            connection.isConnected = db.connection.readyState;
            console.log("DB connected successfully");
        } else {
            console.log("DB connection attempt failed");
            connection.isConnected = null;
        }
    } catch (err) {
        console.error("DB connection failed", err);
        process.exit(1);
    }
}

export default dbConnect;
