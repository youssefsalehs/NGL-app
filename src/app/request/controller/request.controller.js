import * as requestService from "../service/request.service.js";

export async function getRequestsBySender(req, res, next) {
  try {
    const senderId = req.user.id;
    const query = req.query;
    const { data, metaData } = await requestService.getRequestsBySender(
      senderId,
      query,
    );

    return res.status(200).json({
      success: true,
      data,
      metaData,
    });
  } catch (error) {
    return next(error);
  }
}

export async function createRequest(req, res, next) {
  try {
    const { msgId } = req.params;
    const receiverId = req.user.id;
    await requestService.createRequest(receiverId, msgId);

    return res.status(201).json({
      success: true,
      message: "identity request created",
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
    const query = req.query;
    const { data, metaData } = await requestService.getRequestsByReceiver(
      receiverId,
      query,
    );

    return res.status(200).json({
      success: true,
      data,
      metaData,
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
