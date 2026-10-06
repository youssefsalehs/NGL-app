import { Router } from "express";
import { authRouter } from "./app/auth/auth.route.js";
import { messageRouter } from "./app/message/message.route.js";
import { userRouter } from "./app/user/user.route.js";
import { AppError } from "./pkg/error/error.js";
const router = Router();
router.use("/auth", authRouter);
router.use("/message", messageRouter);
router.use("/user", userRouter);
router.use((req, res, next) => {
  next(new AppError("route not found", 404));
});
export default router;
