import { Router } from "express";
import * as conversationController from "./controller/conversation.controller.js";
const conversationRouter = Router();
import { guard } from "../../lib/auth/guard.js";
conversationRouter.get(
  "/:conversationId",
  guard,
  conversationController.getConversation,
);
export { conversationRouter };
