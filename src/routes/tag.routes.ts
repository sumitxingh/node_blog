import { Router } from "express";
import { createTag, deleteTag, getAllTags } from "../controller/tag.controller";

const router = Router();

router.get("/all", getAllTags);
router.post("/create", createTag);
router.delete("/:id", deleteTag);

export default router;
