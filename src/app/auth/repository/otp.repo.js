import OTP from "../model/otp.model.js";

export async function createOtp(otpData) {
  const newOtp = await OTP.create(otpData);
  return newOtp;
}

export async function findOtpByEmail(email) {
  const Otp = await OTP.findOne({ email: email });
  return Otp;
}
export async function deleteOtp(email) {
  return await OTP.deleteMany({
    email: email,
  });
}
