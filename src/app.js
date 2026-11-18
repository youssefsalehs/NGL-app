import "./lib/db/mongoose.js";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import globalErrorHandler from "./lib/error/error.handler.js";
import router from "./route.js";
import { correlationId } from "./lib/correlation/correlationId.js";
import { AppError } from "./pkg/error/error.js";
import { env } from "./lib/config/env.js";

export function createApp() {
  const app = express();
  app.use(cookieParser());
  app.use(
    cors({
      origin: [
        "http://localhost:4200",
        "http://localhost:5173",
        env.frontend.url,
      ],
      credentials: true,
    }),
  );
  // app.use("/uploads", express.static("uploads"));

  app.use(express.json());
  app.use(correlationId);
  app.get("/", (req, res) => {
    return res.send("welcome to LMK api");
  });
  app.use("/api/v1/", router);
  router.use((req, res, next) => {
    next(new AppError("route not found", 404));
  });
  app.use(globalErrorHandler);
  return app;
}
