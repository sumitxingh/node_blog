import { Request, Response } from "express";
import prismaService from "../prisma";

export const createComment = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { content, post_id, user } = req.body;

    const user_id = user.id;

    const post = await prismaService.post.findUnique({
      where: { unique_id: post_id },
    });

    if (!post) return res.status(400).json({ message: "Post not found" });

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
    const { user } = req.body;

    const user_id = user.id;


    const comments = await prismaService.comment.findMany({
      orderBy: { id: "desc" },
      where: { post_id: post_id, parent_id: null },
      include: {
        _count: {
          select: {
            likes: true,
          },
        },
        likes: {
          where: {
            user_id: user_id,
          },
          select: {
            user_id: true,
          },
        },
        user: { select: { name: true } },
        children: {
          include: {
            _count: {
              select: {
                likes: true,
              },
            },
            user: { select: { name: true } },
          },
          orderBy: { id: "desc" },
        },
      },
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
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const updateComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const comment = await prismaService.comment.update({
      where: { unique_id: id },
      data: { content },
    });

    res.status(200).json({ message: "Comment updated successfully", data: comment });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const nestedComment = async (req: Request, res: Response): Promise<any> => {
  try {
    const { comment_id, content, user } = req.body;

    const user_id = user.id;

    const comment = await prismaService.comment.findUnique({
      where: { unique_id: comment_id },
    });

    if (!comment) return res.status(400).json({ message: "Comment not found" });

    const newComment = await prismaService.comment.create({
      data: { content, user_id, post_id: comment.post_id, parent_id: comment_id },
    });

    res.status(201).json({ message: "reply comment added successfully", data: newComment });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
