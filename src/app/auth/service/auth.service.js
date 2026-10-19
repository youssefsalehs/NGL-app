import { cacheProvider } from "../../../lib/cache/init.js";
import { getOtpEmailTemplate } from "../../../lib/email/emailTemplates.js";
import { mailjetProvider } from "../../../lib/email/init.js";
import { generateOtp } from "../../../lib/utils/generateOtp.js";
import { verifyGoogleToken } from "../../../lib/utils/google-auth.js";
import { AppError } from "../../../pkg/error/error.js";
import { toSeconds } from "../../../pkg/utils/time.js";
import * as userErrors from "../../user/errors.js";
import * as userRepo from "../../user/repository/user.repo.js";
import * as authErrors from "../errors.js";
import * as authRepo from "../repository/auth.repo.js";
import { hashPassword, matchPassword } from "../utils/hash.js";
import { generateAccessToken, generateRefreshToken } from "../utils/token.js";
import verifyRefreshToken from "../utils/verifyRefreshToken.js";
const enable2FAKey = `enable2FactorAuth`;
const login2FAKey = `loginCode`;
export async function register(userData) {
  const user = await authRepo.checkUserByEmail(userData.email);
  if (user) {
    throw userErrors.userAlreadyExists;
  }
  userData.password = await hashPassword(userData.password);
  const newUser = await authRepo.createUser(userData);
  const code = generateOtp();
  // await otpRepo.createOtp({
  //   code: code,
  //   email: userData.email,
  //   expiresAt: Date.now() + toMs(15, "minutes"),
  // });
  await cacheProvider.set(
    `otp:${newUser._id.toString()}`,
    code,
    toSeconds(15, "minutes"),
  );
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
  // const otp = await otpRepo.findOtpByEmail(email);
  // if (!otp) {
  //   throw authErrors.otpExpired;
  // }
  // if (code !== otp.code) {
  //   throw authErrors.wrongOtp;
  // }
  const otp = await cacheProvider.get(`otp:${user._id.toString()}`);
  if (!otp) {
    throw authErrors.otpExpired;
  }
  if (code !== otp) {
    throw authErrors.wrongOtp;
  }

  const updatedUser = await userRepo.updateUserByEmail(email, {
    isVerified: true,
  });
  await cacheProvider.del(`otp:${user._id.toString()}`);
  // await otpRepo.deleteOtpByEmail(email);
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
  if (user.twoStepVerification) {
    const code = generateOtp();
    await cacheProvider.set(
      `${login2FAKey}:${email}`,
      code,
      toSeconds(3, "minutes"),
    );
    const htmlContent = getOtpEmailTemplate(code, "login2FA");
    mailjetProvider.sendEmail(
      email,
      "Login with two step verification",
      htmlContent,
    );
    return;
  }
  const accessToken = generateAccessToken({
    id: user._id,
    email: user.email,
    name: user.name,
  });
  const refreshToken = generateRefreshToken({
    id: user._id,
  });
  await cacheProvider.set(
    `refreshToken:${user._id.toString()}`,
    refreshToken,
    toSeconds(7, "days"),
  );

  return { accessToken, refreshToken };
}
export async function verifyLoginCode(email, code) {
  const user = await authRepo.checkUserByEmail(email);
  if (!user) {
    throw userErrors.userNotFound;
  }

  const cachedCode = await cacheProvider.get(`${login2FAKey}:${email}`);
  if (!cachedCode) {
    throw authErrors.otpExpired;
  }
  if (code != cachedCode) {
    throw authErrors.wrongOtp;
  }
  const accessToken = generateAccessToken({
    id: user._id,
    email: user.email,
    name: user.name,
  });
  const refreshToken = generateRefreshToken({
    id: user._id,
  });

  await cacheProvider.del(`${login2FAKey}:${email}`);

  return { accessToken, refreshToken };
}
export async function sendOtp(email) {
  const user = await authRepo.checkUserByEmail(email);
  if (!user) {
    throw userErrors.userNotFound;
  }
  // await otpRepo.deleteOtpByEmail(email);
  const code = generateOtp();
  await cacheProvider.set(
    `otp:${user._id.toString()}`,
    code,
    toSeconds(15, "minutes"),
  );
  // await otpRepo.createOtp({
  //   code: code,
  //   email: user.email,
  //   expiresAt: Date.now() + toMs(15, "minutes"),
  // });
  const htmlContent = getOtpEmailTemplate(code, "resend");
  // await sendEmail(user.email, "New OTP - NGL", htmlContent);
  await mailjetProvider.sendEmail(user.email, "New OTP - NGL", htmlContent);
}
export async function resetPassword(email, code, newPassword) {
  const user = await authRepo.checkUserByEmail(email);
  if (!user) {
    throw userErrors.userNotFound;
  }
  if (user.isVerified === false) {
    throw userErrors.userNotVerified;
  }

  const otp = await cacheProvider.get(`otp:${user._id.toString()}`);
  if (!otp) {
    throw authErrors.otpExpired;
  }
  if (+otp.code !== +code) {
    throw authErrors.wrongOtp;
  }
  const hashedPassword = await hashPassword(newPassword);
  await userRepo.updateUserByEmail(email, { password: hashedPassword });
  await cacheProvider.del(`otp:${user._id.toString()}`);
}

export async function loginWithGoogle(idToken) {
  const payload = await verifyGoogleToken(idToken);
  const user = await authRepo.checkUserByEmail(payload.email);
  const accessToken = generateAccessToken({
    id: user._id,
    email: user.email,
    name: user.name,
  });
  const refreshToken = generateRefreshToken({
    id: user._id,
  });
  await cacheProvider.set(
    `refreshToken:${user._id.toString()}`,
    refreshToken,
    toSeconds(7, "days"),
  );
  if (user) {
    return { accessToken, refreshToken };
  }
  const newUser = await authRepo.createUser({
    name: payload.name,
    email: payload.email,
    provider: "google",
    isVerified: true,
  });
  return { accessToken, refreshToken };
}
export async function refresh(token) {
  if (!token) {
    throw authErrors.noRefreshToken;
  }

  const payload = verifyRefreshToken(token);
  const user = await userRepo.findUserById(payload.id);
  if (!user || !user.isVerified) {
    throw userErrors.userNotFound;
  }

  const storedToken = await cacheProvider.get(
    `refreshToken:${payload.id.toString()}`,
  );
  if (!storedToken) {
    throw authErrors.tokenRevoked;
  }

  const accessToken = generateAccessToken({
    id: user._id,
    email: user.email,
    name: user.name,
  });
  const refreshToken = generateRefreshToken({
    id: user._id,
  });
  await cacheProvider.set(
    `refreshToken:${user._id.toString()}`,
    refreshToken,
    toSeconds(7, "days"),
  );

  return { accessToken, refreshToken };
}

export async function enable2StepVerification(email) {
  const user = await authRepo.checkUserByEmail(email);
  if (!user) return;
  if (user.twoStepVerification) {
    throw new AppError("two step verification already enabled");
  }
  const code = generateOtp();
  await cacheProvider.set(
    `${enable2FAKey}:${email}`,
    code,
    toSeconds(3, "minutes"),
  );
  const htmlContent = getOtpEmailTemplate(code, "enable2FA");
  mailjetProvider.sendEmail(email, "Enable two step verification", htmlContent);
}
export async function verifyEnable2StepVerification(email, code) {
  const user = await authRepo.checkUserByEmail(email);
  //for safety
  if (!user) {
    throw authErrors.wrongOtp;
  }

  const cachedCode = await cacheProvider.get(`${enable2FAKey}:${email}`);
  if (!cachedCode) {
    throw authErrors.otpExpired;
  }
  if (cachedCode != code) {
    throw authErrors.wrongOtp;
  }

  await userRepo.updateUserByEmail(email, { twoStepVerification: true });
  await cacheProvider.del(`${enable2FAKey}:${email}`);
}
