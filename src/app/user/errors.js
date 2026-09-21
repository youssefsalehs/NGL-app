import { AppError } from "../../common/error/error";

export const userAlreadyExists = new AppError("user already exists", 409);
export const userNotFound = new AppError("user doesn't exist", 404);
export const userAlreadyVerified = new AppError("user already verified", 400);
export const userNotVerified = new AppError("user isn't verified", 403);
