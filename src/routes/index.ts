import { Router } from "express";
const router = Router();

import userRoutes from "./user.routes";
import categoryRoutes from "./category.routes";
import tagRoutes from "./tag.routes";
import postRoutes from "./post.routes";
import commentRoutes from "./post.routes";

router.use("/user", userRoutes);
router.use("/category", categoryRoutes);
router.use("/tag", tagRoutes);
router.use("/post", postRoutes);
router.use("/comment", commentRoutes);

export default router;
