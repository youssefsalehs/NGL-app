import { config } from "dotenv";
import express from "express";
import "./common/db/mongoose.js";
config();
const PORT = process.env.PORT || 5000;
const app = express();

import { authRouter } from "./app/auth/auth.route.js";
import { messageRouter } from "./app/message/message.route.js";
import { userRouter } from "./app/user/user.route.js";

app.use(express.json());
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/user", userRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const isOperational = err.isOperational || false;
  return res.status(statusCode).json({
    success: false,
    message: isOperational ? err.message : "Something went wrong!",
  });
});
app.listen(PORT, () => console.log(`this app is running on port ${PORT}`));
