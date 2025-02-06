import { Router } from "express";
const router = Router();

import userRoutes from "./user.routes";
import categoryRoutes from "./category.routes";
import tagRoutes from "./tag.routes";

router.use("/user", userRoutes);
router.use("/category", categoryRoutes);
router.use("/tag", tagRoutes);

export default router;
