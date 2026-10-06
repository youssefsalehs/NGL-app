import { z } from "zod";
export const createMsgDto = z.object({
  content: z.string("message content is required.").trim().min(3).max(200),
  receiver: z.string().min(1, "Receiver is required"),
});
export const updateMsgDto = z.object({
  content: z.string().trim().min(3).max(200).optional(),
});
