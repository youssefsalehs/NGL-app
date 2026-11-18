import { AppError } from "../../../pkg/error/error.js";
import * as msgErrors from "../../message/errors.js";
import * as messageRepo from "../../message/repository/message.repo.js";
import * as requestRepo from "../repository/request.repository.js";
import * as userErrors from "../../user/errors.js";
import * as requestErrors from "../errors.js";
export async function createRequest(receiverId, messageId) {
  const originalMessage = await messageRepo.getSpecificMsgById(messageId);
  if (!originalMessage || originalMessage.isDeleted) {
    throw msgErrors.messageNotFound;
  }
  if (!originalMessage.isAnonymous) {
    throw msgErrors.anonymousMsg;
  }
  if (originalMessage.sender.toString() === receiverId.toString()) {
    throw userErrors.userNotAuthorized;
  }
  const senderId = originalMessage.sender;
  if (!senderId) {
    throw requestNotKnown;
  }
  const existingReq = await requestRepo.checkRequest(
    messageId,
    originalMessage.sender,
    originalMessage.receiver,
  );
  if (existingReq) {
    throw requestErrors.requestAlreadyCreated;
  }
  const request = await requestRepo.createRequest({
    message: messageId,
    receiver: receiverId,
    sender: senderId,
    status: "pending",
    isActive: true,
  });
  await messageRepo.updateMsg(messageId, { hasRequestedReveal: true });
  request.sender = undefined;
  return request;
}

export async function getRequestsBySender(senderId, query) {
  const { data, metaData } = await requestRepo.getRequestsBySender(
    senderId,
    query,
  );
  return { data, metaData };
}

export async function updateRequestStatus(requestId, status) {
  const request = await requestRepo.getRequestById(requestId);
  if (!request) {
    throw requestErrors.requestNotFound;
  }
  if (!request.isActive) {
    throw requestErrors.requestNoLongerActive;
  }
  const updated = await requestRepo.updateRequestStatus(requestId, {
    status,
  });

  return updated;
}

export async function getRequestsByReceiver(receiverId, query) {
  const { data, metaData } = await requestRepo.getRequestsByReceiver(
    receiverId,
    query,
  );
  const filteredRequests = data.map((request) => {
    if (
      request.isActive ||
      (request.status == "rejected" && request.isActive === false)
    ) {
      request.sender = undefined;
    }
    return request;
  });
  return { data: filteredRequests, metaData };
}
export async function getRequestById(requestId, userId) {
  const request = await requestRepo.getRequestById(requestId);
  if (!request) {
    throw requestErrors.requestNotFound;
  }
  if (
    request.receiver.toString() !== userId.toString() &&
    request.sender.toString() !== userId.toString()
  ) {
    throw userErrors.userNotAuthorized;
  }
  if (
    !request.isActive &&
    request.status === "rejected" &&
    request.receiver.toString() === userId.toString()
  ) {
    request.sender = undefined;
  }
  return request;
}
