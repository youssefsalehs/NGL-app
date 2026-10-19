import { Types } from "mongoose";
import { z } from "zod";
const booleanPreprocessor = z.preprocess((val) => {
  if (typeof val === "string") {
    if (val === "true") return true;
    if (val === "false") return false;
  }
  return val;
}, z.boolean());
export const createMsgDto = z.object({
  content: z.string("message content is required.").trim().min(3).max(200),
  receiver: z
    .string()
    .min(1, "Receiver is required")
    .refine(
      (val) => Types.ObjectId.isValid(val),
      "Receiver must be a valid ObjectId",
    ),
  isAnonymous: booleanPreprocessor.optional(),
});

export const anonymousMessageDto = z.object({
  content: z.string("message content is required.").trim().min(3).max(200),
  receiver: z
    .string()
    .min(1, "Receiver is required")
    .refine(
      (val) => Types.ObjectId.isValid(val),
      "Receiver must be a valid ObjectId",
    ),
  isAnonymous: booleanPreprocessor.default(true),
});
export const updateMsgDto = z.object({
  content: z.string().trim().min(3).max(200).optional(),
});
