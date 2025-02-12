import { body } from "express-validator";

export const commentCreateValidation = [
  body("content").isLength({ min: 3 }).withMessage("Content is required"),
  body("post_id").isUUID().withMessage("Post is required"),
  body("user_id").isUUID().withMessage("User is required"),
];
