import { Router } from "express";
import * as userController from "./controller/user.controller.js";
import { guard } from "../../common/auth/guard.js";
const userRouter = Router();
userRouter
  .route("/me")
  .get(guard, userController.getMe)
  .put(guard, userController.updateMe)
  .delete(guard, userController.deleteAccount);
export { userRouter };
