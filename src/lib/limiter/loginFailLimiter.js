import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import { toMs } from "../../pkg/utils/time.js";
import { AppError } from "../../pkg/error/error.js";

export default function loginFailLimiter() {
  const limiter = rateLimit({
    windowMs: toMs(5, "minutes"),
    limit: 5,
    standardHeaders: "draft-8",
    skipSuccessfulRequests: true,
    keyGenerator: (req, res) => {
      let ip = ipKeyGenerator(req.ip);

      if (ip === "::1" || ip === "::ffff:127.0.0.1") {
        ip = "127.0.0.1";
      }
      return ip;
    },
    handler: function (_req, _res, next) {
      next(
        new AppError(
          "Too many failed login attempts. Please try again after 5 minutes.",
          429,
        ),
      );
    },
  });

  return limiter;
}
