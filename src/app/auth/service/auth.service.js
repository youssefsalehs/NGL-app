import bcrypt from "bcrypt";
import { getOtpEmailTemplate } from "../../../common/email/emailTemplates.js";
import { sendEmail } from "../../../common/email/nodemailer.js";
import { generateOtp } from "../../../common/utils/generateOtp.js";
import { toMs } from "../../../common/utils/time.js";
import * as authRepo from "../repository/auth.repo.js";
import * as otpRepo from "../repository/otp.repo.js";
import * as userRepo from "../../user/repository/user.repo.js";
import jwt from "jsonwebtoken";
export async function register(userData) {
  const user = await authRepo.checkUserByEmail(userData.email);
  if (user) {
    const error = new Error("user already exists");
    error.status = 400;
    throw error;
  }
  const hashedPassword = await bcrypt.hash(userData.password, 12);
  userData.password = hashedPassword;
  const newUser = await authRepo.createUser(userData);
  const code = generateOtp();
  await otpRepo.createOtp({
    code: code,
    email: userData.email,
    expiresAt: Date.now() + toMs(15, "minutes"),
  });
  newUser.password = undefined;
  const htmlContent = getOtpEmailTemplate(code, "register");
  await sendEmail(newUser.email, "Verify Your Email - NGL", htmlContent);
  return newUser;
}
export async function verifyAccount(email, code) {
  const user = await authRepo.checkUserByEmail(email);
  if (!user) {
    const error = new Error("user doesn't exist");
    error.status = 404;
    throw error;
  }
  if (user.isVerified === true) {
    const error = new Error("user already verified");
    error.status = 400;
    throw error;
  }
  const otp = await otpRepo.findOtpByEmail(email);
  if (!otp) {
    const error = new Error("otp expired.");
    error.status = 400;
    throw error;
  }
  if (code !== otp.code) {
    const error = new Error("wrong otp code");
    error.status = 400;
    throw error;
  }
  const updatedUser = await userRepo.updateUserByEmail(email, {
    isVerified: true,
  });
  await otpRepo.deleteOtp(email);
  return updatedUser;
}
export async function login(email, password) {
  const user = await authRepo.checkUserByEmail(email);
  if (!user) {
    const error = new Error("user doesn't exist");
    error.status = 404;
    throw error;
  }
  if (user.isVerified === false) {
    const error = new Error("user isn't verified");
    error.status = 400;
    throw error;
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = new Error("invaild credintials");
    error.status = 400;
    throw error;
  }
  return jwt.sign(
    { id: user._id, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    {
      expiresIn: toMs(1, "hours"),
    },
  );
}
export async function sendOtp(email) {
  const user = await authRepo.checkUserByEmail(email);
  if (!user) {
    const error = new Error("user doesn't exist");
    error.status = 404;
    throw error;
  }
  await otpRepo.deleteOtp(email);
  const code = generateOtp();
  await otpRepo.createOtp({
    code: code,
    email: user.email,
    expiresAt: Date.now() + toMs(15, "minutes"),
  });
  const htmlContent = getOtpEmailTemplate(code, "resend");
  await sendEmail(user.email, "New OTP - NGL", htmlContent);
}
