import { Router } from "express";
import { createCommentLike, createPostLike, deleteCommentLike, deletePostLike } from "../controller/like.controller";
import authorize from "../middleware/authorizeMiddlware";

const router = Router();



router.post("/comment", authorize, createCommentLike);
router.post("/post", authorize, createPostLike);

router.delete("/comment/:like_id", authorize, deleteCommentLike);
router.delete("/post/:like_id", authorize, deletePostLike);


export default router;

