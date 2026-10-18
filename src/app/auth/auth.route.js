import { Router } from "express";
import * as authController from "./controller/auth.controller.js";
import { idempotency } from "../../lib/idempotency/idempotency.js";
import { toSeconds } from "../../pkg/utils/time.js";
import { guard } from "../../lib/auth/guard.js";
const authRouter = Router();
authRouter.post(
  "/register",
  idempotency(toSeconds(15, "minutes")),
  authController.register,
);
authRouter.patch(
  "/verify",
  idempotency(toSeconds(15, "minutes")),
  authController.verifyAccount,
);
authRouter.post("/login", authController.login);
authRouter.post("/refresh", guard, authController.refresh);
authRouter.post(
  "/send-otp",
  idempotency(toSeconds(15, "minutes")),
  authController.sendOtp,
);
authRouter.patch(
  "/reset-password",
  idempotency(),
  authController.resetPassword,
);
authRouter.post("/google-login", authController.googleLogin);
export { authRouter };
