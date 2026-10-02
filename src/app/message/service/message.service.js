import * as authRepo from "../../auth/repository/auth.repo.js";
import * as messageRepo from "../repository/message.repo.js";
import * as userErrors from "../../user/errors.js";
import * as msgErrors from "../errors.js";
export const createMsg = async (data) => {
  const receiverUser = await authRepo.checkUserById(data.receiver);
  if (!receiverUser) {
    throw userErrors.userNotFound;
  }
  if (receiverUser.isDeleted) {
    throw userErrors.userNotFound;
  }
  if (data.sender) {
    const user = await authRepo.checkUserById(data.sender);
    if (!user) {
      data.isAnonymous = true;
    }
    if (user && user.isDeleted) {
      data.isAnonymous = true;
    }
  }

  data.sender = data.isAnonymous ? undefined : data.sender;
  data.isAnonymous = undefined;
  return await messageRepo.createMsg(data);
};
export const getSpecificMsg = async (senderId, msgId) => {
  const msg = await messageRepo.getSpecificMsgById(msgId);
  if (!msg) throw msgErrors.messageNotFound;
  if (msg.isDeleted) throw msgErrors.messageNotFound;
  if (String(msg.sender) !== String(senderId))
    throw userErrors.userNotAuthorized;

  return msg;
};

export const updateMsg = async (senderId, msgId, data) => {
  const msg = await messageRepo.getSpecificMsgById(msgId);
  if (!msg) throw msgErrors.messageNotFound;
  if (msg.isDeleted) throw msgErrors.messageNotFound;
  if (String(msg.sender) !== String(senderId))
    throw userErrors.userNotAuthorized;
  const updates = Object.assign(msg, data);
  return await messageRepo.updateMsg(msgId, updates);
};
