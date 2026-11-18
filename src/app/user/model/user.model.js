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
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    provider: {
      type: String,
      enum: ["google", "facebook", "local"],
      default: "local",
    },
    password: {
      type: String,
      minLength: 8,
      required: function () {
        return this.provider === "local";
      },
    },
    isDeleted: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    dob: Date,
    gender: { type: String, enum: ["male", "female"] },
    profilePicture: { public_id: String, secure_url: String },
    twoStepVerification: { type: Boolean, default: false },
    coverPicture: { public_id: String, secure_url: String },
  },
  {
    timestamps: true,
  },
);
const User = model("User", userSchema);
export default User;
