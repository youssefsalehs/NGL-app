import { validate } from "../../../common/validation/validation.js";
import * as messageDTOS from "../dto/message.dto.js";
import * as messageService from "../service/message.service.js";
export async function createMsg(req, res, next) {
  try {
    const data = validate(messageDTOS.createMsgDto, req.body);
    const msg = await messageService.createMsg(data);
    return res.status(201).json({
      success: true,
      message: "msg is created successfully",
      data: msg,
    });
  } catch (error) {
    return next(error);
  }
}
export async function getSpecificMsg(req, res, next) {
  try {
    const { msgId } = req.params;
    const senderId = req.user.id;
    const msg = await messageService.getSpecificMsg(senderId, msgId);
    return res.status(200).json({
      success: true,
      data: msg,
    });
  } catch (error) {
    return next(error);
  }
}
export async function updateMsg(req, res, next) {
  try {
    const { msgId } = req.params;
    const senderId = req.user.id;
    const data = validate(messageDTOS.updateMsgDto, req.body);
    const msg = await messageService.updateMsg(senderId, msgId, data);
    return res.status(200).json({
      success: true,
      message: "msg is created successfully",
      data: msg,
    });
  } catch (error) {
    return next(error);
  }
}
