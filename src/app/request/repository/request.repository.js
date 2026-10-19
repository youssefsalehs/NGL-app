import Request from "../model/request.model.js";

export async function createRequest(data) {
  const request = await Request.create(data);
  return request;
}

export async function getRequestsBySender(senderId) {
  const requests = await Request.find({ sender: senderId, isActive: true });
  return requests;
}
export async function getRequestsByReceiver(receiverId) {
  const requests = await Request.find({ receiver: receiverId });
  return requests;
}
export async function getRequestById(id) {
  const request = await Request.findById(id);
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
