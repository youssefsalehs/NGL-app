import { config } from "dotenv";
import express from "express";
import "./common/db/mongoose.js";
import cors from "cors";
config();
import { authRouter } from "./app/auth/auth.route.js";
import { messageRouter } from "./app/message/message.route.js";
import { userRouter } from "./app/user/user.route.js";
import { logger } from "./common/logger/logger.js";
import cookieParser from "cookie-parser";

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cookieParser());
app.use(cors({ origin: ["http://localhost:4200"] }));

app.use(express.json());
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/user", userRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const isOperational = err.isOperational || false;
  logger.error(err.message, err);
  return res.status(statusCode).json({
    success: false,
    message: isOperational ? err.message : "Something went wrong!",
    stack: err.stack,
  });
});
app.listen(PORT, () => logger.info(`this app is running on port ${PORT}`));
