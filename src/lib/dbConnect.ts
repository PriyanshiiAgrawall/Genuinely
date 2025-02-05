import mongoose from "mongoose";

type connectionType = {
    isConnected: number | null,
}
const connection: connectionType = {
    isConnected: null,
}
//void means i dont care what data is being returned
async function dbConnect(): Promise<void> {
    //check if alredy connected
    if (connection.isConnected !== null) {
        console.log("db is already connected");
        return;
    }
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || "", {
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
            //in mongoose 6+ we do not need them they are deafult behaviour
        })

        connection.isConnected = db.connection.readyState;

        console.log("DB connected succesfully");
    }
    catch (err) {

        console.error("db connection failed", err);
        process.exit(1);


    }
}

export default dbConnect;