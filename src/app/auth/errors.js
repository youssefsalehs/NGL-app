import { AppError } from "../../common/error/error.js";
export const otpExpired = new AppError("otp expired.", 404);
export const wrongOtp = new AppError("wrong otp code", 400);
export const passwordNotMatch = new AppError("invaild credintials", 403);
