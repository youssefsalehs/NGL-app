import { model, Schema } from "mongoose";
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 20,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    password: String,

    provider: {
      type: String,
      enum: ["google", "facebook", "local"],
      default: "local",
    },
    isDeleted: { type: boolean, default: false },
    isVerified: { type: boolean, default: false },
    dob: Date,
    gender: { type: String, enum: ["male", "female"] },
  },
  {
    timestamps: true,
  },
);
const User = model("User", userSchema);
export default User;
