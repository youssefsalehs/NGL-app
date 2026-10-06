import Message from "../model/message.model.js";

export async function createMsg(data, sender) {
  const msg = await Message.create({ ...data, sender });
  return msg;
}

export async function getSpecificMsgById(id) {
  const msg = await Message.findOne({ _id: id });
  return msg;
}
export async function updateMsg(id, data) {
  const msg = await Message.findByIdAndUpdate(id, data, {
    returnDocument: "after",
  });
  return msg;
}
