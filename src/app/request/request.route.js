import { Router } from "express";
import * as requestController from "./controller/request.controller.js";
import { guard } from "../../lib/auth/guard.js";

const requestRouter = Router();

requestRouter.route("/").post(guard, requestController.createRequest);

requestRouter
  .route("/sender")
  .get(guard, requestController.getRequestsBySender);
requestRouter
  .route("/receiver")
  .get(guard, requestController.getRequestsByReceiver);
requestRouter.patch(
  "/:requestId",
  guard,
  requestController.updateRequestStatus,
);
requestRouter.get("/:requestId", guard, requestController.getRequestById);

export { requestRouter };
