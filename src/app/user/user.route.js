import { Router } from "express";
import * as userController from "./controller/user.controller.js";
import { guard } from "../../lib/auth/guard.js";
import { withCache } from "../../lib/cache/withCache.js";
import { toSeconds } from "../../pkg/utils/time.js";
import { uploadSingleFile } from "../../lib/media/multer.js";
import {
  allowedFields,
  fileValidation,
} from "../../lib/media/file.validation.js";
const userRouter = Router();
userRouter
  .route("/me")
  .get(guard, userController.getMe)
  .put(guard, userController.updateMe)
  .delete(guard, userController.deleteAccount);
userRouter.patch("/update-password", guard, userController.updatePassword);
//for testing caching
userRouter.get(
  "/",
  withCache(toSeconds(1, "days")),
  userController.getAllUsers,
);
userRouter.post(
  "/upload-profile-picture",
  guard,
  uploadSingleFile("profilePicture", allowedFields.images),
  fileValidation(),
  userController.uploadProfilePicture,
);
userRouter.post(
  "/upload-cover-picture",
  guard,
  uploadSingleFile("coverPicture", allowedFields.images),
  fileValidation(),
  userController.uploadCoverPicture,
);
export { userRouter };
