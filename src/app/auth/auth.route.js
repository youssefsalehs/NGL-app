import { Router } from "express";
import * as authController from "./controller/auth.controller.js";
const authRouter = Router();
authRouter.post("/register", authController.register);
authRouter.patch("/verify", authController.verifyAccount);
// authRouter.post("/login");
// authRouter.post("/send-otp");
export { authRouter };
