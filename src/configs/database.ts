require("dotenv").config();
import mongoose from "mongoose";

export const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log("Database connected...");
    } catch (error) {
        console.log("Database connection error...", error);
    }
}