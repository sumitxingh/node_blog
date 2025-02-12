import { Router } from "express";
import {
  createComment,
  deleteComment,
  getCommentsByPost,
} from "../controller/comment.controller";
import { commentCreateValidation } from "../validation/comment.validation";

const router = Router();

router.get("/:post_id", getCommentsByPost);
router.post("/create", commentCreateValidation, createComment);
router.delete("/delete/:id", deleteComment);

export default router;
