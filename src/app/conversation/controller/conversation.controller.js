import * as conversationService from "../service/conversation.service.js";
export async function getConversation(req, res, next) {
  try {
    const { conversationId } = req.params;
    const conversation = await conversationService.getConversation(
      req.user.id,
      conversationId,
    );
    return res.status(200).json({
      success: true,
      data: conversation,
    });
  } catch (error) {
    return next(error);
  }
}
