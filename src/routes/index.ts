import { Router } from "express";
const router = Router();
import userRoutes from "./user.routes";

router.use("/user", userRoutes);

router.get("/", (req, res) => {
    res.json({ message: "hello form routes" });
 })

export default router;