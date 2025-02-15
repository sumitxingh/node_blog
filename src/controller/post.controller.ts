import { Request, Response } from "express";
import prismaService from "../prisma/index";
import { validationResult } from "express-validator";

export const createPost = async (req: Request, res: Response): Promise<any> => {
  try {
    const errors = validationResult(req);

    if (errors.array().length > 0) {
      return res.status(422).json({ errors: errors.array() });
    }

    const {
      title,
      content,
      excerpt,
      featuredImage,
      category_id,
      tags,
      status,
      user_id,
    } = req.body;

    console.log({
      title,
      content,
      excerpt,
      featuredImage,
      category_id,
      tags,
      status,
      user_id,
    });

    const slug = title.toLowerCase().replace(/ /g, "-");
    const exitSlug = await prismaService.post.findUnique({ where: { slug } });
    if (exitSlug)
      return res.status(400).json({ message: "Slug should be unique" });

    const newPost = await prismaService.post.create({
      data: {
        title,
        content,
        excerpt,
        featuredImage,
        slug,
        status,
        user_id,
        category_id,
        tags: { connect: tags.map((tagId: string) => ({ unique_id: tagId })) },
      },
    });

    res
      .status(201)
      .json({ message: "Post created successfully", data: newPost });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const posts = await prismaService.post.findMany({
      orderBy: { created_at: "desc" },
      include: {
        user: { select: { name: true } },
        tags: {
          select: {
            name: true,
            unique_id: true,
          }
        },
        Category: {
          select: {
            name: true,
            unique_id: true,
          }
        },
        Comment: {
          select: {
            unique_id: true,
            content: true,
            created_at: true,
            user: {
              select: {
                name: true,
              }
            }
          },
        },
      }
    });

    res
      .status(200)
      .json({ message: "Posts retrieved successfully", data: posts });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getPostById = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.params;
    const post = await prismaService.post.findUnique({
      where: { unique_id: id },
      include: { user: true, tags: true, Category: true, Comment: true },
    });

    if (!post) return res.status(404).json({ message: "Post not found" });

    res
      .status(200)
      .json({ message: "Post retrieved successfully", data: post });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, content, status, category_id, tags } = req.body;

    const updatedPost = await prismaService.post.update({
      where: { unique_id: id },
      data: {
        title,
        content,
        status,
        category_id,
        tags: { set: tags.map((tagId: string) => ({ unique_id: tagId })) },
      },
    });

    res
      .status(200)
      .json({ message: "Post updated successfully", data: updatedPost });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prismaService.post.delete({ where: { unique_id: id } });

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
