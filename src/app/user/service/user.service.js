import { cloudinaryProvider } from "../../../lib/cloud/cloudinaryProvider.js";
import { passwordNotMatch, samePassword } from "../../auth/errors.js";
import * as authRepo from "../../auth/repository/auth.repo.js";
import { hashPassword, matchPassword } from "../../auth/utils/hash.js";
import { noCoverPic, noProfilePic, userNotFound } from "../errors.js";
import * as userRepo from "../repository/user.repo.js";

export async function getMe(email) {
  const user = await authRepo.checkUserByEmail(email);
  user.password = undefined;
  return user;
}
export async function getAllUsers() {
  const users = await userRepo.getAllUsers();
  return users;
}
export async function updateMe(email, data) {
  const user = await authRepo.checkUserByEmail(email);

  const updates = Object.assign(user, data);
  const updatedUser = await userRepo.updateUserByEmail(email, updates);
  updatedUser.password = undefined;
  return updatedUser;
}
export async function deleteAccount(email) {
  const user = await authRepo.checkUserByEmail(email);
  if (user.isDeleted) {
    throw userNotFound;
  }
  await userRepo.updateUserByEmail(email, { isDeleted: true });
}
export async function updatePassword(email, data) {
  const user = await authRepo.checkUserByEmail(email);
  const isMatch = await matchPassword(data.password, user.password);
  if (!isMatch) throw passwordNotMatch;
  const isSamePassword = await matchPassword(data.newPassword, user.password);
  if (isSamePassword) {
    throw samePassword;
  }
  const hashedPassword = await hashPassword(data.newPassword);
  await userRepo.updateUserByEmail(email, { password: hashedPassword });
}
export async function uploadProfilePicture(file, userId) {
  const user = await userRepo.findUserById(userId);
  if (!user) {
    throw userNotFound;
  }
  const { public_id, secure_url } = await cloudinaryProvider.uploadFile(
    file,
    `users/${userId}/profile-pictures`,
  );

  await userRepo.updateUserByEmail(user.email, {
    profilePicture: { public_id, secure_url },
  });
}
export async function uploadCoverPicture(file, userId) {
  const user = await userRepo.findUserById(userId);
  if (!user) {
    throw userNotFound;
  }
  const { public_id, secure_url } = await cloudinaryProvider.uploadFile(
    file,
    `users/${userId}/cover-pictures`,
  );

  await userRepo.updateUserByEmail(user.email, {
    coverPicture: { public_id, secure_url },
  });
}
export async function deleteProfilePicture(userId) {
  const user = await userRepo.findUserById(userId);
  console.log(user);
  if (!user) {
    throw userNotFound;
  }
  if (!user.profilePicture) {
    throw noProfilePic;
  }
  await cloudinaryProvider.deleteFile(user.profilePicture.public_id);

  await userRepo.updateUserByEmail(user.email, {
    profilePicture: undefined,
  });
}
export async function deleteCoverPicture(userId) {
  const user = await authRepo.checkUserById(userId);

  if (!user) {
    throw userNotFound;
  }
  if (!user.coverPicture) {
    throw noCoverPic;
  }
  await cloudinaryProvider.deleteFile(user.coverPicture.public_id);

  await userRepo.updateUserByEmail(user.email, {
    coverPicture: undefined,
  });
}

export async function getUserByUsername(username) {
  const user = await userRepo.findUserByUsername(username);
  if (!user) {
    throw userNotFound;
  }
  return user;
}
