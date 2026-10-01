import { z } from "zod";
export const updateUserDto = z.object({
  name: z.string().min(2).max(20).trim().optional(),
  dob: z.coerce.date().optional(),
  gender: z.enum(["male", "female"]).optional(),
});
export const updatePasswordDto = z.object({
  password: z.string().min(8).max(16).trim(),
  newPassword: z.string().min(8).max(16).trim(),
});
