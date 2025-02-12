import { Router } from "express";
import {
  createPost,
  deletePost,
  getAllPosts,
  getPostById,
  updatePost,
} from "../controller/post.controller";
import {
  postCreateValidation,
  postUpdateValidation,
} from "../validation/post.validation";
import authorize from "../middleware/authorizeMiddlware";

const router = Router();

router.get("/all", getAllPosts);
router.post("/create", authorize, postCreateValidation, createPost);
router.get("/:id", getPostById);
router.patch("/:id", postUpdateValidation, updatePost);
router.delete("/:id", deletePost);

export default router;
