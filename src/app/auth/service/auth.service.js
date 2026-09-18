import bcrypt from "bcrypt";
import { getOtpEmailTemplate } from "../../../common/email/emailTemplates.js";
import { sendEmail } from "../../../common/email/nodemailer.js";
import { generateOtp } from "../../../common/utils/generateOtp.js";
import { toMs } from "../../../common/utils/time.js";
import * as authRepo from "../repository/auth.repo.js";
import * as otpRepo from "../repository/otp.repo.js";
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
  await authRepo.verifyAccount(email);
  await otpRepo.deleteOtp(email);
}
