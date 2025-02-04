import { Request, Response } from "express";
import prismaService from "../prisma";
import dotenv from "dotenv";

dotenv.config();

const login = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;

    const existingUser = await prismaService.user.findUnique({
      where: { email },
    });

    if (!existingUser) {
      return res.status(400).json({ message: "User not found" });
    }

    // const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    const isPasswordValid = password === existingUser.password;
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Password is incorrect" });
    }

    // const token = jwt.sign(
    //   { id: existingUser.id, email: existingUser.email },
    //   process.env.JWT_SECRET as string,
    //   { expiresIn: "1h" }
    // );

    res.status(200).json({
      message: "Login successful",
      //   token,
      data: existingUser,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const register = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await prismaService.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prismaService.user.create({
      data: {
        name,
        email,
        password,
      },
    });

    res.status(201).json({
      message: "Registered successfully",
      data: user,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const getAllUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const users = await prismaService.user.findMany();
    res.status(200).json({
      message: "Get all users successfully",
      data: users,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export { login, register, getAllUser };
