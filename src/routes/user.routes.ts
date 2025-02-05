import { Router } from "express";
import { login, register, getAllUser } from "../controller/user.controller"; 
import { loginValidation, registerValidation } from "../validation/user.validation";
const router = Router();

router.post("/register", registerValidation, register);
router.post("/login", loginValidation, login);
router.get("/all", getAllUser);

export default router;
