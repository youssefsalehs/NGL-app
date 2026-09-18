import { toMs } from "../../../common/utils/time.js";
import * as authService from "../service/auth.service.js";
export async function register(req, res, next) {
  try {
    const newUser = await authService.register(req.body);

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
    const { email, code } = req.body;
    const updatedUser = await authService.verifyAccount(email, code);

    return res.status(201).json({
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
    const { email, password } = req.body;
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
