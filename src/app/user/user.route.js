import { Router } from "express";
import * as userController from "./controller/user.controller.js";
import { guard } from "../../lib/auth/guard.js";
import { withCache } from "../../lib/cache/withCache.js";
import { toSeconds } from "../../pkg/utils/time.js";
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
export { userRouter };
