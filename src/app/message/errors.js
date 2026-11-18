import { AppError } from "../../pkg/error/error.js";

export const messageNotFound = new AppError("message not found.", 404);
export const anonymousMsg = new AppError(
  "cannot send request for non-anonymous message.",
  400,
);
