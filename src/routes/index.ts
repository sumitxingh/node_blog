import { Router } from "express";
const router = Router();
import userRoutes from "./user.routes";
import categoryRoutes from "./category.routes";

router.use("/user", userRoutes);
router.use("/category", categoryRoutes);

export default router;