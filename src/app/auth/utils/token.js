import { toMs } from "../../../common/utils/time.js";
import jwt from "jsonwebtoken";
export const generateToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: toMs(1, "hours"),
  });
