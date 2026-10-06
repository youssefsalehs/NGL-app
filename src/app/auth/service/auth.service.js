import { getOtpEmailTemplate } from "../../../lib/email/emailTemplates.js";
import { sendEmail } from "../../../lib/email/nodemailer.js";
import { generateOtp } from "../../../lib/utils/generateOtp.js";
import { toMs } from "../../../pkg/utils/time.js";
import * as userErrors from "../../user/errors.js";
import * as userRepo from "../../user/repository/user.repo.js";
import * as authErrors from "../errors.js";
import * as authRepo from "../repository/auth.repo.js";
import * as otpRepo from "../repository/otp.repo.js";
import { hashPassword, matchPassword } from "../utils/hash.js";
import { generateToken } from "../utils/token.js";
import { verifyGoogleToken } from "../../../lib/utils/google-auth.js";
import { mailjetProvider } from "../../../lib/email/init.js";
export async function register(userData) {
  const user = await authRepo.checkUserByEmail(userData.email);
  if (user) {
    throw userErrors.userAlreadyExists;
  }
  userData.password = await hashPassword(userData.password);
  const newUser = await authRepo.createUser(userData);
  const code = generateOtp();
  await otpRepo.createOtp({
    code: code,
    email: userData.email,
    expiresAt: Date.now() + toMs(15, "minutes"),
  });
  newUser.password = undefined;
  const htmlContent = getOtpEmailTemplate(code, "register");
  // await sendEmail(newUser.email, "Verify Your Email - NGL", htmlContent);
  await mailjetProvider.sendEmail(
    newUser.email,
    "Verify Your Email - NGL",
    htmlContent,
  );
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
  await otpRepo.deleteOtpByEmail(email);
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

  const isMatch = await matchPassword(password, user.password);

  if (!isMatch) {
    throw authErrors.passwordNotMatch;
  }
  return generateToken({ id: user._id, email: user.email, name: user.name });
}
export async function sendOtp(email) {
  const user = await authRepo.checkUserByEmail(email);
  if (!user) {
    throw userErrors.userNotFound;
  }
  await otpRepo.deleteOtpByEmail(email);
  const code = generateOtp();
  await otpRepo.createOtp({
    code: code,
    email: user.email,
    expiresAt: Date.now() + toMs(15, "minutes"),
  });
  const htmlContent = getOtpEmailTemplate(code, "resend");
  // await sendEmail(user.email, "New OTP - NGL", htmlContent);
  await mailjetProvider.sendEmail(user.email, "New OTP - NGL", htmlContent);
}
export async function resetPassword(email, code, newPassword) {
  const otp = await otpRepo.findOtpByEmail(email);
  if (!otp) {
    throw authErrors.otpExpired;
  }
  if (+otp.code !== +code) {
    throw authErrors.wrongOtp;
  }
  const hashedPassword = await hashPassword(newPassword);
  await userRepo.updateUserByEmail(email, { password: hashedPassword });
  await otpRepo.deleteOtpByEmail(email);
}

export async function loginWithGoogle(idToken) {
  const payload = await verifyGoogleToken(idToken);
  const user = await authRepo.checkUserByEmail(payload.email);
  console.log(user);
  if (user) {
    return generateToken({ id: user._id, email: user.email });
  }
  const newUser = await authRepo.createUser({
    name: payload.name,
    email: payload.email,
    provider: "google",
    isVerified: true,
  });
  return generateToken({ id: newUser._id, email: newUser.email });
}
