import { logger } from "../../pkg/logger/logger.js";

export default function globalErrorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const isOperational = err.isOperational || false;
  logger.error(err.message, {
    stack: err.stack,
    correlationId: req.correlationId,
  });
  return res.status(statusCode).json({
    success: false,
    message: isOperational ? err.message : "Something went wrong!",
  });
}
