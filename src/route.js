import { Router } from "express";
import { authRouter } from "./app/auth/auth.route.js";
import { messageRouter } from "./app/message/message.route.js";
import { userRouter } from "./app/user/user.route.js";
import { AppError } from "./pkg/error/error.js";
import { requestRouter } from "./app/request/request.route.js";
import { conversationRouter } from "./app/conversation/conversation.route.js";
const router = Router();
router.use("/auth", authRouter);
router.use("/message", messageRouter);
router.use("/user", userRouter);
router.use("/request", requestRouter);
router.use("/conversation", conversationRouter);
router.use((req, res, next) => {
  next(new AppError("route not found", 404));
});
export default router;
