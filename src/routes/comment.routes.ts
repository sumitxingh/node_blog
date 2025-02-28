import { Router } from "express";
import {
  createComment,
  deleteComment,
  getCommentsByPost,
} from "../controller/comment.controller";
import { commentCreateValidation } from "../validation/comment.validation";
import authorize from "../middleware/authorizeMiddlware";

const router = Router();

router.get("/:post_id", getCommentsByPost);
router.post("/create", commentCreateValidation, authorize, createComment);
router.delete("/:id", authorize, deleteComment);

export default router;
