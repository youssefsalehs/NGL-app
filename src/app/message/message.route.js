import { Router } from "express";
import { guard } from "../../lib/auth/guard.js";
import { uploadArrayOfFiles } from "../../lib/media/multer.js";
import * as messageController from "./controller/message.controller.js";
const messageRouter = Router();
messageRouter
  .route("/")
  .post(guard, uploadArrayOfFiles("media", 5), messageController.createMsg)
  .get(guard, messageController.getAllMsgsForUser);
messageRouter
  .route("/anonymous")
  .post(uploadArrayOfFiles("media", 5), messageController.createMsg);
messageRouter
  .route("/:msgId")
  .get(guard, messageController.getSpecificMsg)
  .put(guard, messageController.updateMsg);
export { messageRouter };
