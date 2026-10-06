import { AppError } from "../../pkg/error/error.js";

export const messageNotFound = new AppError("message not found.", 404);
