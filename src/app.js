import "./lib/db/mongoose.js";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import globalErrorHandler from "./lib/error/error.handler.js";
import router from "./route.js";

export function createApp() {
  const app = express();

  app.use(cookieParser());
  app.use(cors({ origin: ["http://localhost:4200"] }));

  app.use(express.json());
  app.use("/api/v1/", router);
  app.use(globalErrorHandler);
  return app;
}
