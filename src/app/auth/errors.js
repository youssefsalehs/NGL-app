export const otpExpired = new Error("otp expired.");
otpExpired.status = 400;

export const wrongOtp = new Error("wrong otp code");
wrongOtp.status = 400;

export const passwordNotMatch = new Error("invaild credintials");
passwordNotMatch.status = 400;
