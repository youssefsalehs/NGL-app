import * as userRepo from "../../user/repository/user.repo.js";
import * as messageRepo from "../repository/message.repo.js";
import * as userErrors from "../../user/errors.js";
import * as msgErrors from "../errors.js";
export const createMsg = async (data, sender, mediaFiles = []) => {
  const receiverUser = await userRepo.findUserById(data.receiver);
  if (!receiverUser || !receiverUser.isVerified) {
    throw userErrors.userNotFound;
  }

  const newMsg = await messageRepo.createMsg(data, sender, mediaFiles);
  newMsg.sender = data.isAnonymous ? null : newMsg.sender;
  return newMsg;
};
export const getSpecificMsg = async (userId, msgId) => {
  const msg = await messageRepo.getSpecificMsgById(msgId);
  if (!msg) throw msgErrors.messageNotFound;
  const isSender = String(msg.sender) === String(userId);
  const isReceiver = String(msg.receiver) === String(userId);
  if (!isSender && !isReceiver) {
    throw userErrors.userNotAuthorized;
  }
  if (msg.isAnonymous && isReceiver) {
    msg.sender = undefined;
  }
  msg.isAnonymous = undefined;
  return msg;
};

export const updateMsg = async (senderId, msgId, data) => {
  const msg = await messageRepo.getSpecificMsgById(msgId);
  if (!msg) throw msgErrors.messageNotFound;
  if (String(msg.sender) !== String(senderId))
    throw userErrors.userNotAuthorized;
  const updates = Object.assign(msg, data);
  return await messageRepo.updateMsg(msgId, updates);
};

export const getAllMsgsForUser = async (userId, query) => {
  const { data, metaData } = await messageRepo.getAllMsgsForUser(userId, query);
  const anonymizedData = data.map((msg) => {
    if (msg.isAnonymous && String(msg.receiver) === String(userId)) {
      msg.sender = undefined;
    }
    msg.isAnonymous = undefined;
    return msg;
  });
  return { data: anonymizedData, metaData };
};
