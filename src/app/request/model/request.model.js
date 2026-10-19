import { model, Schema } from "mongoose";

const requestSchema = new Schema(
  {
    messageId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Message",
    },
    receiver: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    sender: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

const Request = model("Request", requestSchema);
export default Request;
