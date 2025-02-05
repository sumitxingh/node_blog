import { Request, Response } from "express";
import prismaService from "../prisma";
import config from "../config/config";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "@prisma/client";

class UserResponse {
  unique_id: string;
  name: string;
  email: string;

  constructor(user: User) {
    this.unique_id = user.unique_id;
    this.name = user.name;
    this.email = user.email;
  }
}

const login = async (req: Request, res: Response): Promise<any> => {
  try {
    const errors = validationResult(req);

    if (errors.array().length > 0) {
      return res.status(422).json({ errors: errors.array() });
    }
    const { email, password } = req.body;

    const existingUser = await prismaService.user.findUnique({
      where: { email },
    });

    if (!existingUser) {
      return res.status(400).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Password is incorrect" });
    }

    const userResponse = new UserResponse(existingUser);

    const token = jwt.sign(
      { id: existingUser.unique_id, email: existingUser.email },
      config.JWT_SECRET || "",
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      data: userResponse,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const register = async (req: Request, res: Response): Promise<any> => {
  try {
    const errors = validationResult(req);

    if (errors.array().length > 0) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    const existingUser = await prismaService.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prismaService.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const userResponse = new UserResponse(user);

    res.status(201).json({
      message: "Registered successfully",
      data: userResponse,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const getAllUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const users = await prismaService.user.findMany({
      select: {
        unique_id: true,
        name: true,
        email: true,
      },
    });
    
    res.status(200).json({
      message: "Get all users successfully",
      data: users,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export { login, register, getAllUser };
