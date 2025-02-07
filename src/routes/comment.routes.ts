import { Router } from "express";
import { createComment, deleteComment, getCommentsByPost } from "../controller/comment.controller";


const router = Router();

router.get("/:post_id", getCommentsByPost)
router.post("/create", createComment);
router.delete("/delete/:id", deleteComment);

export default router;
