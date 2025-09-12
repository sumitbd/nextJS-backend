import * as mongoose from "mongoose";

const MONGO_URI = process.env.MONGODB_URI;

const connection = async () => {
    const connectionState = mongoose.connection.readyState;

    if (connectionState === 1) {
        console.log("Already connected");
        return;
    }

    if (connectionState === 2) {
        console.log("Connecting...");
        return;
    }

    try {
        mongoose.connect(MONGO_URI, {
            dbName: "nextjs15restapi",
            bufferCommands: true,
        })
        console.log("Connected to MongoDB");

    } catch (err: any) {
        console.error(err);
        throw new Error(err.message);
    }
};

export default connection;


