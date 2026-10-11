import multer, { diskStorage } from "multer";
import crypto from "crypto";
import { AppError } from "../../pkg/error/error.js";
import { allowedFields } from "./file.validation.js";
export const upload = (allowedTypes = allowedFields.images) =>
  multer({
    fileFilter: function (req, file, cb) {
      if (!allowedTypes.includes(file.mimetype)) {
        cb(new AppError("invalid file format.", 400), false);
      }
      cb(null, true);
    },
    storage: diskStorage({
      destination: "uploads",
      filename: function (req, file, cb) {
        cb(null, `${crypto.randomUUID()}-${file.originalname}`);
      },
    }),
  });

export const uploadSingleFile = (
  fileName,
  allowedTypes = allowedFields.images,
) => upload(allowedTypes).single(fileName);
export const uploadArrayOfFiles = (
  name,
  maxNo,
  allowedTypes = allowedFields.images,
) => upload(allowedTypes).array(name, maxNo);
export const uploadFields = (fields) => upload().fields(fields);
