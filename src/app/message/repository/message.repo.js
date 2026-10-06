import Message from "../model/message.model.js";

export async function createMsg(data, sender) {
  const msg = await Message.create({ ...data, sender });
  return msg;
}

export async function getSpecificMsgById(id) {
  const msg = await Message.findOne({ _id: id, isDeleted: false });
  return msg;
}
export async function updateMsg(id, data) {
  const msg = await Message.findByIdAndUpdate(id, data, {
    returnDocument: "after",
  });
  return msg;
}
export async function getAllMsgsForUser(userId, query) {
  const page = +query.page || 1;
  const limit = +query.limit || 10;
  const skip = (page - 1) * limit;
  const msgs = await Message.find({ receiver: userId }, {}, { limit, skip });
  const totalMsgs = await Message.countDocuments({
    receiver: userId,
    isDeleted: false,
  });
  console.log(msgs, totalMsgs);
  return {
    data: msgs,
    metaData: {
      currentPage: page,
      total: totalMsgs,
      totalPages: Math.ceil(totalMsgs / limit),
      limit,
    },
  };
}
