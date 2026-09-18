import "./common/db/mongoose.js";
import { config } from "dotenv";
config();
import express from "express";
const PORT = process.env.PORT || 5000;
const app = express();

import { authRouter } from "./app/auth/auth.route.js";
import { userRouter } from "./app/user/user.route.js";
import { messageRouter } from "./app/message/message.route.js";
import OTP from "./app/auth/model/otp.model.js";

app.use(express.json());
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/user", userRouter);

app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  return res.status(statusCode).json({
    success: false,
    message: err.message,
    stack: err.stack,
  });
});
app.listen(PORT, () => console.log(`this app is running on port ${PORT}`));
