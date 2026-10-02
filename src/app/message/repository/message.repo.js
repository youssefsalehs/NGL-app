import Message from "../model/message.model.js";

export async function createMsg(data) {
  const msg = await Message.create(data);
  return msg;
}

export async function getSpecificMsgById(id) {
  const msg = await Message.findOne({ _id: id });
  return msg;
}
