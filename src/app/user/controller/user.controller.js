import { validate } from "../../../common/validation/validation.js";
import * as userService from "../service/user.service.js";
import { updatePasswordDto, updateUserDto } from "../dto/user.dto.js";
export async function getMe(req, res, next) {
  try {
    const user = await userService.getMe(req.user.email);
    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    return next(error);
  }
}
export async function updateMe(req, res, next) {
  try {
    const data = validate(updateUserDto, req.body);
    const userEmail = req.user.email;
    const user = await userService.updateMe(userEmail, data);
    return res
      .status(200)
      .json({ success: true, message: "user details updated", data: user });
  } catch (error) {
    return next(error);
  }
}
export async function deleteAccount(req, res, next) {
  try {
    const userEmail = req.user.email;
    await userService.deleteAccount(userEmail);
    return res.sendStatus(204);
  } catch (error) {
    return next(error);
  }
}
export async function updatePassword(req, res, next) {
  try {
    const data = validate(updatePasswordDto, req.body);
    const userEmail = req.user.email;
    await userService.updatePassword(userEmail, data);
    return res
      .status(200)
      .json({ success: true, message: "user password updated" });
  } catch (error) {
    return next(error);
  }
}
