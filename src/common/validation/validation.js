import { z } from "zod";
import { AppError } from "../error/error.js";
export function validate(dto, body) {
  const result = z.safeParse(dto, body);
  if (result.success === false) {
    const issues = result.error.issues;
    const messages = issues
      .map((issue) => `${issue.path[0]} : ${issue.message}`)
      .join(", ");
    throw new AppError(messages, 400);
  }
  return result.data;
}
