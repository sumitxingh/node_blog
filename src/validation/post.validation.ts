import { PostStatus } from "@prisma/client";
import { body } from "express-validator";

export const postCreateValidation = [
  body("title").isLength({ min: 3 }).withMessage("Title is required"),
  body("content").isLength({ min: 10 }).withMessage("Content is required"),
  body("excerpt").isLength({ min: 10 }).withMessage("Excerpt is required"),
  body("featuredImage").isURL().withMessage("Featured Image is required"),
  body("category_id").isUUID().withMessage("Category is required"),
  body("tags").isArray({ min: 1 }).withMessage("Tags are required"),
  body("status").isIn(Object.values(PostStatus)).withMessage("Status is required"),
  body("user_id").isUUID().withMessage("User is required"),
]