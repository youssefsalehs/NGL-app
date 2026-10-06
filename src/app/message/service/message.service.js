import * as userRepo from "../../user/repository/user.repo.js";
import * as messageRepo from "../repository/message.repo.js";
import * as userErrors from "../../user/errors.js";
import * as msgErrors from "../errors.js";
export const createMsg = async (data, sender) => {
  const receiverUser = await userRepo.findUserById(data.receiver);
  if (!receiverUser) {
    throw userErrors.userNotFound;
  }
  return await messageRepo.createMsg(data, sender);
};
export const getSpecificMsg = async (senderId, msgId) => {
  const msg = await messageRepo.getSpecificMsgById(msgId);
  if (!msg) throw msgErrors.messageNotFound;
  if (String(msg.sender) !== String(senderId))
    throw userErrors.userNotAuthorized;

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
  return { data, metaData };
};
