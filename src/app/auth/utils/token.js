import { env } from "../../../lib/config/env.js";
import { toMs } from "../../../pkg/utils/time.js";
import jwt from "jsonwebtoken";
export const generateToken = (payload) =>
  jwt.sign(payload, env.jwt.secret, {
    expiresIn: toMs(1, "hours"),
  });
