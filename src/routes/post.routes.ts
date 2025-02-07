import { Router } from "express";
import {
  createPost,
  deletePost,
  getAllPosts,
  getPostById,
  updatePost,
} from "../controller/post.controller";
import { postCreateValidation } from "../validation/post.validation";

const router = Router();

router.get("/all", getAllPosts);
router.post("/create", postCreateValidation, createPost);
// router.get("/:id", getPostById);
// router.patch("/:id", updatePost);
// router.delete("/:id", deletePost);

export default router;
