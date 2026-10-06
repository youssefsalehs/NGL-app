import { Types } from "mongoose";
import { z } from "zod";
export const createMsgDto = z.object({
  content: z.string("message content is required.").trim().min(3).max(200),
  receiver: z
    .string()
    .min(1, "Receiver is required")
    .refine(
      (val) => Types.ObjectId.isValid(val),
      "Receiver must be a valid ObjectId",
    ),
});
export const updateMsgDto = z.object({
  content: z.string().trim().min(3).max(200).optional(),
});
