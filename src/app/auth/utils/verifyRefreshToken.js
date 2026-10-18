import jwt from "jsonwebtoken";
import { env } from "../../../lib/config/env.js";
export default function verifyRefreshToken(token) {
  return jwt.verify(token, env.jwt.refreshSecret);
}
