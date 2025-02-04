import { Router } from "express";
import { login, register, getAllUser } from "../controller/user.controller"; // Ensure correct import

const router = Router();

// Authentication Routes
router.post("/register", register);
router.post("/login", login);
router.get("/users", getAllUser); // Optional: Secure this route with JWT middleware

export default router;
