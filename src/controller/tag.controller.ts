import { Request, Response } from "express";
import prismaService from "../prisma";

export const createTag = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    const exitingTag = await prismaService.tag.findUnique({
      where: { name },
    });

    if (exitingTag) throw new Error("Tag already exists");

    const newTag = await prismaService.tag.create({
      data: { name },
    });

    res.status(201).json({ message: "Tag created successfully", data: newTag });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllTags = async (req: Request, res: Response) => {
  try {
    const tags = await prismaService.tag.findMany();

    res
      .status(200)
      .json({ message: "Tags retrieved successfully", data: tags });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTag = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const exitingTag = await prismaService.tag.findUnique({
      where: { unique_id: id }
    });

    if (!exitingTag) throw new Error("Tag not found");

    await prismaService.tag.delete({ where: { unique_id: id } });

    res.status(200).json({ message: "Tag deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
