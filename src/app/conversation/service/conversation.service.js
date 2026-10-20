import * as authRepo from "../../auth/repository/auth.repo.js";
import * as conversationRepo from "../repository/conversation.repository.js";
import * as userErrors from "../../user/errors.js";
import { AppError } from "../../../pkg/error/error.js";
export async function createConversation(user1, user2) {
  const existingConversation = await conversationRepo.getConversationByUsers(
    user1,
    user2,
  );
  if (existingConversation) {
    return existingConversation;
  }
  const newConversation = await conversationRepo.createConversation(
    user1,
    user2,
  );
  return newConversation;
}
export async function getConversation(userId, conversationId) {
  const user = await authRepo.checkUserById(userId);
  if (!user || user.isDeleted) {
    throw userErrors.userNotFound;
  }
  const conversation =
    await conversationRepo.getConversationById(conversationId);
  if (!conversation) {
    throw new AppError("Conversation not found", 404);
  }
  const isParticipant = conversation.participants.some(
    (participantId) => participantId.toString() === userId.toString(),
  );

  if (!isParticipant) {
    throw new AppError("Unauthorized access to this conversation", 403);
  }
  return conversation;
}
