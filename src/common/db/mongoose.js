import mongoose from "mongoose";
import { config } from "dotenv";

config();
console.log(process.env.MONGODB_URL);
mongoose.connect(process.env.MONGODB_URL);
