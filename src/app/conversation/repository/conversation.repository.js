import Conversation from "../model/conversation.model.js";

export async function getConversationById(id) {
  return await Conversation.findById(id).populate({
    path: "messages",
    options: { sort: { createdAt: 1 } },
  });
}
export async function getConversationByUsers(user1, user2) {
  return await Conversation.findOne({
    participants: {
      $all: [user1, user2],
      $size: 2,
    },
  });
}
export async function createConversation(user1, user2) {
  return await Conversation.create({
    participants: [user1, user2],
  });
}

export async function addNewMessageToConversation(conversationId, messageId) {
  const updatedConversation = await Conversation.findByIdAndUpdate(
    conversationId,
    {
      $push: { messages: messageId },
    },
    {
      returnDocument: "after",
    },
  );

  return updatedConversation;
}
