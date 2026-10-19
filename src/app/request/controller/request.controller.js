import * as requestService from "../service/request.service.js";

export async function getRequestsBySender(req, res, next) {
  try {
    const senderId = req.user.id;
    const requests = await requestService.getRequestsBySender(senderId);

    return res.status(200).json({
      success: true,
      data: requests,
    });
  } catch (error) {
    return next(error);
  }
}

export async function createRequest(req, res, next) {
  try {
    const { messageId } = req.body;
    const receiverId = req.user.id;
    const request = await requestService.createRequest(receiverId, messageId);

    return res.status(201).json({
      success: true,
      message: "identity request created",
      data: request,
    });
  } catch (error) {
    return next(error);
  }
}

export async function updateRequestStatus(req, res, next) {
  try {
    const { requestId } = req.params;
    const { status } = req.body;

    const updated = await requestService.updateRequestStatus(requestId, status);

    return res.status(200).json({
      success: true,
      message: `request ${status}`,
      data: updated,
    });
  } catch (error) {
    return next(error);
  }
}

export async function getRequestsByReceiver(req, res, next) {
  try {
    const receiverId = req.user.id;
    const requests = await requestService.getRequestsByReceiver(receiverId);

    return res.status(200).json({
      success: true,
      data: requests,
    });
  } catch (error) {
    return next(error);
  }
}

export async function getRequestById(req, res, next) {
  try {
    const { requestId } = req.params;
    const userId = req.user.id;
    const request = await requestService.getRequestById(requestId, userId);

    return res.status(200).json({
      success: true,
      data: request,
    });
  } catch (error) {
    return next(error);
  }
}
