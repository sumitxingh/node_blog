import prismaService from "../prisma";
import { Request, Response } from "express";

export const createCommentLike = async (req: Request, res: Response): Promise<any> => {
  try {
    const { comment_id, user } = req.body;

    const alreadyLiked = await prismaService.commentLike.findFirst({
      where: { comment_id, user_id: user.id },
    });

    if (alreadyLiked) return res.status(400).json({ message: "Comment already liked" });

    const comment = await prismaService.comment.findUnique({
      where: { unique_id: comment_id },
    });

    if (!comment) return res.status(400).json({ message: "Comment not found" });

    const like = await prismaService.commentLike.create({
      data: { comment_id, user_id: user.id },
    });

    res.status(201).json({ message: "Comment liked successfully", data: like });

  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};


export const createPostLike = async (req: Request, res: Response): Promise<any> => {
  try {
    const { post_id, user } = req.body;

    const alreadyLiked = await prismaService.postLike.findFirst({
      where: { post_id, user_id: user.id },
    });

    if (alreadyLiked) return res.status(400).json({ message: "Post already liked" });

    const post = await prismaService.post.findUnique({
      where: { unique_id: post_id },
    });

    if (!post) return res.status(400).json({ message: "Post not found" });

    const like = await prismaService.postLike.create({
      data: { post_id, user_id: user.id },
    });

    res.status(201).json({ message: "Post liked successfully", data: like });

  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCommentLike = async (req: Request, res: Response): Promise<any> => {
  try {
    const { like_id } = req.params;

    const existingLike = await prismaService.commentLike.findUnique({
      where: { unique_id: like_id },
    });

    if (!existingLike) return res.status(400).json({ message: "Like not found" });

    const like = await prismaService.commentLike.delete({
      where: { unique_id: like_id },
    });

    res.status(200).json({ message: "Like removed successfully", data: like });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deletePostLike = async (req: Request, res: Response): Promise<any> => {
  try {
    const { like_id } = req.params;

    const existingLike = await prismaService.postLike.findUnique({
      where: { unique_id: like_id },
    });

    if (!existingLike) return res.status(400).json({ message: "Like not found" });

    const like = await prismaService.postLike.delete({
      where: { unique_id: like_id },
    });

    res.status(200).json({ message: "Like removed successfully", data: like });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

