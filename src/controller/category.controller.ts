import { Request, Response } from "express";
import prismaService from "../prisma/index";

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    const newCategory = await prismaService.category.create({
      data: { name },
    });

    res
      .status(201)
      .json({ message: "Category created successfully", data: newCategory });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prismaService.category.findMany();

    res
      .status(200)
      .json({ message: "Categories retrieved successfully", data: categories });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prismaService.category.delete({ where: { unique_id: id } });

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
