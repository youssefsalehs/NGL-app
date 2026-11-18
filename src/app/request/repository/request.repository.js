import Request from "../model/request.model.js";

export async function createRequest(data) {
  const request = await Request.create(data);
  return request;
}
export async function checkRequest(msgId, sender, receiver) {
  const requests = await Request.findOne({
    message: msgId,
    receiver,
    sender,
  });
  return requests;
}
export async function getRequestsBySender(senderId, query = {}) {
  const page = +query.page || 1;
  const limit = +query.limit || 10;
  const skip = (page - 1) * limit;

  const filter = { sender: senderId, isActive: true };

  const requests = await Request.find(filter, {}, { limit, skip })
    .populate("receiver", "username profilePicture")
    .populate("message", "content media");

  const totalRequests = await Request.countDocuments(filter);

  return {
    data: requests,
    metaData: {
      currentPage: page,
      total: totalRequests,
      totalPages: Math.ceil(totalRequests / limit),
      limit,
    },
  };
}

export async function getRequestsByReceiver(receiverId, query = {}) {
  const page = +query.page || 1;
  const limit = +query.limit || 10;
  const skip = (page - 1) * limit;

  const filter = { receiver: receiverId };

  const requests = await Request.find(filter, {}, { limit, skip })
    .populate("sender", "username profilePicture")
    .populate("message", "content media");

  const totalRequests = await Request.countDocuments(filter);

  return {
    data: requests,
    metaData: {
      currentPage: page,
      total: totalRequests,
      totalPages: Math.ceil(totalRequests / limit),
      limit,
    },
  };
}
export async function getRequestById(id) {
  const request = await Request.findById(id)
    .populate("sender", "username profilePicture")
    .populate("receiver", "username profilePicture")
    .populate("message", "content media");
  return request;
}

export async function updateRequestStatus(id, data) {
  const request = await Request.findByIdAndUpdate(
    id,
    { ...data, isActive: false },
    {
      returnDocument: "after",
    },
  );
  return request;
}
