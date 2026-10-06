import jwt from "jsonwebtoken";
import { AppError } from "../../pkg/error/error.js";
import User from "../../app/user/model/user.model.js";
import * as userErrors from "../../app/user/errors.js";
export const guard = async (req, res, next) => {
  try {
    const token = req.cookies.access_token;

    if (!token) {
      return next(new AppError("Authentication token missing.", 401));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(userErrors.userNotFound);
    }
    req.user = decoded;
    next();
  } catch (error) {
    return next(new AppError("Invalid or expired token.", 403));
  }
};
