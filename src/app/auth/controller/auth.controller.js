import { validate } from "../../../lib/validation/validation.js";
import {
  enable2StepVerificationDto,
  loginDto,
  registerDto,
  resetPasswordDto,
  sendOtpDto,
  verifyAccountDto,
  verifyEnable2StepVerificationDto,
  verifyLoginDto,
} from "../dto/auth.dto.js";
import * as authService from "../service/auth.service.js";
import generateTokens from "../utils/generateTokens.js";
export async function register(req, res, next) {
  try {
    const data = validate(registerDto, req.body);
    const newUser = await authService.register(data);

    return res.status(201).json({
      success: true,
      message: "user created successfully",
      user: newUser,
    });
  } catch (error) {
    return next(error);
  }
}
export async function verifyAccount(req, res, next) {
  try {
    const data = validate(verifyAccountDto, req.body);
    const { email, code } = data;
    const updatedUser = await authService.verifyAccount(email, code);

    return res.status(200).json({
      success: true,
      message: "user verified successfully",
      data: updatedUser,
    });
  } catch (error) {
    return next(error);
  }
}
//controllers for  ordinary login && 2 step verification login
export async function login(req, res, next) {
  try {
    const data = validate(loginDto, req.body);
    const { email, password } = data;
    const tokens = await authService.login(email, password);
    if (!tokens) {
      return res.status(200).json({
        success: true,
        message: "an OTP code is sent to your email to complete login",
      });
    }
    generateTokens(res, tokens.accessToken, tokens.refreshToken);

    return res.status(200).json({
      success: true,
      message: "user logged in successfully",
    });
  } catch (error) {
    return next(error);
  }
}
export async function verifyLoginCode(req, res, next) {
  try {
    const data = validate(verifyLoginDto, req.body);
    const { email, code } = data;
    const { accessToken, refreshToken } = await authService.verifyLoginCode(
      email,
      code,
    );
    generateTokens(res, accessToken, refreshToken);
    return res.status(200).json({
      success: true,
      message: "user logged in  successfully",
    });
  } catch (error) {
    return next(error);
  }
}

export async function sendOtp(req, res, next) {
  try {
    const data = validate(sendOtpDto, req.body);
    const { email } = data;
    await authService.sendOtp(email);
    return res.status(200).json({
      success: true,
      message: "a new email is sent with a new otp",
    });
  } catch (error) {
    return next(error);
  }
}
export async function resetPassword(req, res, next) {
  try {
    const data = validate(resetPasswordDto, req.body);
    const { email, newPassword, code } = data;
    await authService.resetPassword(email, code, newPassword);

    return res.status(200).json({
      success: true,
      message: "Password successfully reset.",
    });
  } catch (error) {
    return next(error);
  }
}
export async function googleLogin(req, res, next) {
  try {
    const { idToken } = req.body;
    const { accessToken, refreshToken } =
      await authService.loginWithGoogle(idToken);

    generateTokens(res, accessToken, refreshToken);

    return res.status(200).json({
      success: true,
      message: "user log in success",
    });
  } catch (error) {
    return next(error);
  }
}
export async function refresh(req, res, next) {
  try {
    const token = req.cookies.refresh_token;
    const { accessToken, refreshToken } = await authService.refresh(token);
    generateTokens(res, accessToken, refreshToken);
    return res
      .status(200)
      .json({ success: true, message: "Token refreshed successfully" });
  } catch (error) {
    return next(error);
  }
}

//controllers for enabling 2 step verification
export async function enable2StepVerification(req, res, next) {
  try {
    const data = validate(enable2StepVerificationDto, req.body);
    await authService.enable2StepVerification(data.email);
    return res.status(200).json({
      success: true,
      message: "Enabling two step verification request code is sent",
    });
  } catch (error) {
    return next(error);
  }
}
export async function verifyEnable2StepVerification(req, res, next) {
  try {
    const data = validate(verifyEnable2StepVerificationDto, req.body);
    const { email, code } = data;
    await authService.verifyEnable2StepVerification(email, code);

    return res.status(200).json({
      success: true,
      message: "Two step verification is enabled now",
    });
  } catch (error) {
    return next(error);
  }
}
