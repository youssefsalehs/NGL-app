import { model, Schema } from "mongoose";
const otpSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    code: { type: String, required: true, length: 6 },

    expiresAt: { type: Date, index: { expires: 0 } },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  },
);
const Otp = model("Otp", otpSchema);
export default Otp;
