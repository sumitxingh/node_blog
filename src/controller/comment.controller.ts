import { Request, Response } from "express";
import prismaService from "../prisma/index";

export const createComment = async (req: Request, res: Response) => {
  try {
    const { content, user_id, post_id } = req.body;

    const newComment = await prismaService.comment.create({
      data: { content, user_id, post_id },
    });

    res
      .status(201)
      .json({ message: "Comment added successfully", data: newComment });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getCommentsByPost = async (req: Request, res: Response) => {
  try {
    const { post_id } = req.params;

    const comments = await prismaService.comment.findMany({
      where: { post_id: Number(post_id) },
      include: { user: { select: { name: true } } },
    });

    res
      .status(200)
      .json({ message: "Comments retrieved successfully", data: comments });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prismaService.comment.delete({ where: { unique_id: id } });

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
