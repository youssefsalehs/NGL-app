import * as authRepo from "../../auth/repository/auth.repo.js";
import * as userRepo from "../repository/user.repo.js";
export async function getMe(email) {
  const user = await authRepo.checkUserByEmail(email);
  user.password = undefined;
  return user;
}
export async function updateMe(email, data) {
  const user = await authRepo.checkUserByEmail(email);
  const updates = Object.assign(user, data);
  const updatedUser = await userRepo.updateUserByEmail(email, updates);
  updatedUser.password = undefined;
  return updatedUser;
}
