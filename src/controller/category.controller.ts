import { Request, Response } from "express";
import prismaService from "../prisma";


export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    const exitingCategory = await prismaService.category.findUnique({
      where: { name }
    })

    if(exitingCategory) throw new Error("Category already exists")

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

    const getCategory = await prismaService.category.findUnique({
      where: { unique_id: id }
    })

    if(!getCategory) throw new Error("Category not found")

    await prismaService.category.delete({ where: { unique_id: id } });

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
