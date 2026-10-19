import { z } from "zod";
export const registerDto = z.object({
  name: z.string().min(2).max(20).trim(),
  email: z.email().toLowerCase().trim(),
  password: z.string().min(8).max(16).trim(),
  dob: z.coerce.date().optional(),
  gender: z.enum(["male", "female"]).optional(),
});
export const verifyAccountDto = z.object({
  email: z.email().toLowerCase().trim(),
  code: z.string().length(6),
});
export const loginDto = z.object({
  email: z.email().toLowerCase().trim(),
  password: z.string().min(8).max(16).trim(),
});
export const sendOtpDto = z.object({
  email: z.email().toLowerCase().trim(),
});
export const enable2StepVerificationDto = z.object({
  email: z.email().toLowerCase().trim(),
});
export const resetPasswordDto = z.object({
  email: z.email().toLowerCase().trim(),
  code: z.string().length(6),
  newPassword: z.string().min(8).max(16).trim(),
});
export const verifyEnable2StepVerificationDto = z.object({
  email: z.string().toLowerCase().trim(),
  code: z.string().length(6),
});

export const verifyLoginDto = z.object({
  email: z.string().toLowerCase().trim(),
  code: z.string().length(6),
});
