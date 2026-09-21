import bcrypt from "bcrypt";
import { getOtpEmailTemplate } from "../../../common/email/emailTemplates.js";
import { sendEmail } from "../../../common/email/nodemailer.js";
import { generateOtp } from "../../../common/utils/generateOtp.js";
import { toMs } from "../../../common/utils/time.js";
import * as authRepo from "../repository/auth.repo.js";
import * as otpRepo from "../repository/otp.repo.js";
import * as userRepo from "../../user/repository/user.repo.js";
import * as userErrors from "../../user/errors.js";
import * as authErrors from "../errors.js";
import jwt from "jsonwebtoken";
export async function register(userData) {
  const user = await authRepo.checkUserByEmail(userData.email);
  if (user) {
    throw userErrors.userAlreadyExists;
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
    throw userErrors.userNotFound;
  }
  if (user.isVerified === true) {
    throw userErrors.userAlreadyVerified;
  }
  const otp = await otpRepo.findOtpByEmail(email);
  if (!otp) {
    throw authErrors.otpExpired;
  }
  if (code !== otp.code) {
    throw authErrors.wrongOtp;
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
    throw userErrors.userNotFound;
  }
  if (user.isVerified === false) {
    throw userErrors.userNotVerified;
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw authErrors.passwordNotMatch;
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
    throw userErrors.userNotFound;
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
