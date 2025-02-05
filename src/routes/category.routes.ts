import { Router } from "express";
import { createCategory, deleteCategory, getAllCategories } from "../controller/category.controller";

const router = Router();

router.get("/all", getAllCategories);
router.post("/create", createCategory);
router.delete("/delete/:id", deleteCategory);

export default router;
