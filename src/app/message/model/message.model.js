import { model, Schema } from "mongoose";
const messageSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 20,
      trim: true,
    },
    receiver: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    sender: { type: Schema.Types.ObjectId, ref: "User" },
    isDeleted: { type: Boolean, default: false },
    isAnonymous: { type: Boolean, default: false },
    media: [String],
  },
  {
    timestamps: true,
  },
);
const Message = model("Message", messageSchema);
export default Message;
