import { PostStatus } from "@prisma/client";
import { body } from "express-validator";

export const postCreateValidation = [
  body("title").isLength({ min: 3 }).withMessage("Title is required"),
  body("content").isLength({ min: 10 }).withMessage("Content is required"),
  body("excerpt")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage("Excerpt must be a string"),
  body("featured_image")
    .optional({ checkFalsy: true })
    .isURL()
    .withMessage("Featured Image must be a valid URL"),
  body("category_id")
    .optional({ checkFalsy: true })
    .isUUID()
    .withMessage("Category ID must be a valid UUID"),
  body("tags")
    .optional({ checkFalsy: true })
    .isArray()
    .withMessage("Tags must be an array"),
  body("status")
    .isIn(Object.values(PostStatus))
    .withMessage(
      `Status must be one of: ${Object.values(PostStatus).join(", ")}`
    ),
];

export const postUpdateValidation = [
  body("title").optional({ checkFalsy: true }).isLength({ min: 3 }),
  body("content").optional({ checkFalsy: true }).isLength({ min: 10 }),
  body("featured_image")
    .optional({ checkFalsy: true })
    .isURL()
    .withMessage("Featured Image must be a valid URL"),
  body("category_id")
    .optional({ checkFalsy: true })
    .isUUID()
    .withMessage("Category ID must be a valid UUID"),
  body("tags")
    .optional({ checkFalsy: true })
    .isArray()
    .withMessage("Tags must be an array"),
  body("status")
    .optional({ checkFalsy: true })
    .isIn(Object.values(PostStatus))
    .withMessage(
      `Status must be one of: ${Object.values(PostStatus).join(", ")}`
    ),
];
