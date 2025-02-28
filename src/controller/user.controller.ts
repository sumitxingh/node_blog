import { Request, Response } from "express";

import config from "../config/config";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "@prisma/client";
import prismaService from "../prisma";

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

const generateToken = (user: User): { access_token: string, refresh_token: string } => {
  const refreshToken = jwt.sign({
    id: user.unique_id
  }, config.REFRESH_JWT_SECRET,
    { expiresIn: '7d' })

  const accesToken = jwt.sign({
    id: user.unique_id,
    email: user.email
  }, config.JWT_SECRET,
    { expiresIn: '1h' })

  return {
    access_token: accesToken,
    refresh_token: refreshToken
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

    const token = generateToken(existingUser)

    res.cookie("refresh_token", token.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })


    res.status(200).json({
      message: "Login successful",
      access_token: token.access_token,
      user: userResponse,
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

const refreshToken = async (req: Request, res: Response): Promise<any> => {
  try {
    let refreshToken = req.cookies.refresh_token as string;

    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }
    const decodeToken = jwt.decode(refreshToken as string);
    if (!decodeToken) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const user = await prismaService.user.findUnique({
      where: {
        unique_id: (decodeToken as jwt.JwtPayload)?.id,
      },
    });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const token = generateToken(user);

    const userResponse = new UserResponse(user)

    res.cookie("refresh_token", token.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })

    res.status(200).json({
      message: "Refresh token successful",
      access_token: token.access_token,
      user: userResponse
    });

  } catch (error: any) {
    console.error("Refresh Token Error", error);
    res.status(500).json({ message: error.message || "Error in refresh token" })
  }
}

const logOut = async (req: Request, res: Response) => {
  res.clearCookie("refresh_token");
  res.status(200).json({ message: "Logout successful" });
}

export { login, register, getAllUser, refreshToken, logOut };
