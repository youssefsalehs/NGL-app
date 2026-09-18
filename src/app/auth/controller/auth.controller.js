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
    await authService.verifyAccount(email, code);

    return res.status(201).json({
      success: true,
      message: "user verified successfully",
    });
  } catch (error) {
    return next(error);
  }
}
