import { AppError } from "../../pkg/error/error.js";

export const requestAlreadyCreated = new AppError(
  "request already created",
  400,
);

export const requestNotFound = new AppError("request not found.", 404);
export const requestNoLongerActive = new AppError(
  "request is no longer active.",
  400,
);
