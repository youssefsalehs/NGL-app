import { env } from "../../../lib/config/env.js";
import { toMs } from "../../../pkg/utils/time.js";
import jwt from "jsonwebtoken";
export const generateAccessToken = (payload) =>
  jwt.sign(payload, env.jwt.accessSecret, {
    expiresIn: toMs(1, "hours"),
  });

export const generateRefreshToken = (payload) =>
  jwt.sign(payload, env.jwt.refreshSecret, {
    expiresIn: toMs(7, "days"),
  });
