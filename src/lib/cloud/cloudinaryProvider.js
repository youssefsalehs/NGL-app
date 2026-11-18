import { CloudinaryProvider } from "../../pkg/cloud/cloudinary.js";
import { env } from "../config/env.js";

export const cloudinaryProvider = new CloudinaryProvider({
  cloudName: env.cloudinary.cloudName,
  apiKey: env.cloudinary.apiKey,
  apiSecret: env.cloudinary.apiSecret,
});
