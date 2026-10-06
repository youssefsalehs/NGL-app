import { toMs } from "../../../pkg/utils/time.js";
import { validate } from "../../../lib/validation/validation.js";
import {
  loginDto,
  registerDto,
  resetPasswordDto,
  sendOtpDto,
  verifyAccountDto,
} from "../dto/auth.dto.js";
import * as authService from "../service/auth.service.js";
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
export async function login(req, res, next) {
  try {
    const data = validate(loginDto, req.body);
    const { email, password } = data;
    const token = await authService.login(email, password);
    res.cookie("access_token", token, {
      httpOnly: true,
      maxAge: toMs(1, "hours"),
    });

    return res.status(200).json({
      success: true,
      message: "user logged in successfully",
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
  } catch (error) {}
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
    const token = await authService.loginWithGoogle(idToken);

    res.cookie("access_token", token, {
      httpOnly: true,
      maxAge: toMs(1, "hours"),
    });

    return res.status(200).json({
      success: true,
      message: "user log in success",
    });
  } catch (error) {
    return next(error);
  }
}
