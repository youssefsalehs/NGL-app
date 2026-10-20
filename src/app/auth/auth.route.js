import { Router } from "express";
import * as authController from "./controller/auth.controller.js";
import { idempotency } from "../../lib/idempotency/idempotency.js";
import { toSeconds } from "../../pkg/utils/time.js";
import { guard } from "../../lib/auth/guard.js";
import loginFailLimiter from "../../lib/limiter/loginFailLimiter.js";
const authRouter = Router();
const loginLimiter = loginFailLimiter();
authRouter.post(
  "/register",
  idempotency(toSeconds(15, "minutes")),
  authController.register,
);
authRouter.patch(
  "/verify",
  idempotency(toSeconds(3, "minutes")),
  authController.verifyAccount,
);
// endpoints belong to ordinar login or two step verification login
authRouter.post("/login", loginLimiter, authController.login);
authRouter.post(
  "/verify-login",
  idempotency(toSeconds(3, "minutes")),
  authController.verifyLoginCode,
);

authRouter.post("/refresh", guard, authController.refresh);
authRouter.post(
  "/send-otp",
  idempotency(toSeconds(15, "minutes")),
  authController.sendOtp,
);
authRouter.patch(
  "/reset-password",
  idempotency(toSeconds(3, "minutes")),
  authController.resetPassword,
);
authRouter.post("/google-login", authController.googleLogin);
// endpoints to enable two step verification
authRouter.post(
  "/enable-2-step-verification",
  idempotency(toSeconds(3, "minutes")),
  authController.enable2StepVerification,
);
authRouter.post(
  "/verify-code-enable-2-step-verification",
  idempotency(toSeconds(3, "minutes")),
  authController.verifyEnable2StepVerification,
);

export { authRouter };
