import { Router } from "express";
import { createComment, getCommentsByPost } from "../controller/comment.controller";

const router = Router();

router.get("/all", getCommentsByPost);
router.post("/create", createComment);


export default router;
