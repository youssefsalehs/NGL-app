import { Router } from "express";
import * as messageController from "./controller/message.controller.js";
import { guard } from "../../lib/auth/guard.js";
const messageRouter = Router();
messageRouter.route("/").post(messageController.createMsg);
messageRouter
  .route("/:msgId")
  .get(guard, messageController.getSpecificMsg)
  .put(guard, messageController.updateMsg);
export { messageRouter };
