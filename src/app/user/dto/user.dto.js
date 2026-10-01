import { z } from "zod";
export const updateUserDto = z.object({
  name: z.string().min(2).max(20).trim().optional(),
  dob: z.coerce.date().optional(),
  gender: z.enum(["male", "female"]).optional(),
});
