export const userAlreadyExists = new Error("user already exists");
userAlreadyExists.status = 400;

export const userNotFound = new Error("user doesn't exist");
userNotFound.status = 404;
export const userAlreadyVerified = new Error("user already verified");
userAlreadyVerified.status = 400;

export const userNotVerified = new Error("user isn't verified");
userNotVerified.status = 400;
