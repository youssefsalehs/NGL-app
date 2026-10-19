import { AppError } from "../../../pkg/error/error.js";
import * as msgErrors from "../../message/errors.js";
import * as messageRepo from "../../message/repository/message.repo.js";
import * as requestRepo from "../repository/request.repository.js";

export const requestNotKnown = new AppError(
  "message sender is not known.",
  404,
);

export async function createRequest(receiverId, messageId) {
  const originalMessage = await messageRepo.getSpecificMsgById(messageId);
  if (!originalMessage || originalMessage.isDeleted) {
    throw msgErrors.messageNotFound;
  }
  if (!originalMessage.isAnonymous) {
    throw new AppError("cannot send request for non-anonymous message.", 400);
  }
  if (originalMessage.sender.toString() === receiverId.toString()) {
    throw new AppError("cannot send request to yourself.", 400);
  }
  const senderId = originalMessage.sender;
  if (!senderId) {
    throw requestNotKnown;
  }

  const request = await requestRepo.createRequest({
    messageId,
    receiver: receiverId,
    sender: senderId,
    status: "pending",
    isActive: true,
  });
  request.sender = undefined;
  return request;
}

export async function getRequestsBySender(senderId) {
  const requests = await requestRepo.getRequestsBySender(senderId);
  return requests;
}

export async function updateRequestStatus(requestId, status) {
  const request = await requestRepo.getRequestById(requestId);
  if (!request) {
    throw new AppError("request not found.", 404);
  }
  if (!request.isActive) {
    throw new AppError("request is no longer active.", 400);
  }
  const updated = await requestRepo.updateRequestStatus(requestId, {
    status,
  });

  return updated;
}

export async function getRequestsByReceiver(receiverId) {
  const requests = await requestRepo.getRequestsByReceiver(receiverId);
  const filteredRequests = requests.map((request) => {
    if (
      request.isActive ||
      (request.status == "rejected" && request.isActive === false)
    ) {
      request.sender = undefined;
    }
    return request;
  });
  return filteredRequests;
}
export async function getRequestById(requestId, userId) {
  const request = await requestRepo.getRequestById(requestId);
  if (!request) {
    throw new AppError("request not found.", 404);
  }
  if (
    request.receiver.toString() !== userId.toString() &&
    request.sender.toString() !== userId.toString()
  ) {
    throw new AppError("you are not authorized to view this request.", 403);
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
