import { body } from "express-validator";

const loginValidation = [
  body("email").isEmail().withMessage("Email is required"),
  body("password").isLength({ min: 6 }).withMessage("Password is required"),
];

const registerValidation = [
  body("email").isEmail().withMessage("Email is required"),
  body("password").isLength({ min: 6 }).withMessage("Password is required"),
  body("name").isLength({ min: 3 }).withMessage("Name is required"),
];

export { loginValidation, registerValidation };
