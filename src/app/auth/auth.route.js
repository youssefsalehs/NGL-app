import { Router } from "express";
import * as authController from "./controller/auth.controller.js";
import { idempotency } from "../../lib/idempotency/idempotency.js";
const authRouter = Router();
authRouter.post("/register", authController.register);
authRouter.patch("/verify", authController.verifyAccount);
authRouter.post("/login", authController.login);
authRouter.post("/send-otp", idempotency(), authController.sendOtp);
authRouter.patch(
  "/reset-password",
  idempotency(),
  authController.resetPassword,
);
authRouter.post("/google-login", authController.googleLogin);
export { authRouter };
