import { Router } from "express";
import {
  createPost,
  deletePost,
  getAllPosts,
  getLatestPosts,
  getPostById,
  updatePost,
} from "../controller/post.controller";
import {
  postCreateValidation,
  postUpdateValidation,
} from "../validation/post.validation";
import authorize from "../middleware/authorizeMiddlware";

const router = Router();

router.get("/all", authorize, getAllPosts);
router.get("/latest", getLatestPosts);
router.post("/create", authorize, postCreateValidation, createPost);
router.get("/:id", getPostById);
router.patch("/:id", authorize, postUpdateValidation, updatePost);
router.delete("/:id", authorize, deletePost);

export default router;
