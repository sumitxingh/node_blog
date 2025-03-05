import { Request, Response } from "express";

import { validationResult } from "express-validator";
import prismaService from "../prisma";

export const createPost = async (req: Request, res: Response): Promise<any> => {
  try {
    const errors = validationResult(req);

    if (errors.array().length > 0) {
      return res.status(422).json({ errors: errors.array() });
    }
    const user_id = req.body.user.id;

    const {
      title,
      content,
      excerpt,
      featured_image,
      category_id,
      tags,
      status,
      description,
    } = req.body;

    console.log({
      title,
      content,
      excerpt,
      featured_image,
      category_id,
      tags,
      status,
      user_id,
      description,
    });

    const slug = title.toLowerCase().replace(/ /g, "-");
    const exitSlug = await prismaService.post.findUnique({ where: { slug } });
    if (exitSlug)
      return res.status(400).json({ message: "Slug should be unique" });

    if (category_id) {
      const category = await prismaService.category.findUnique({
        where: { unique_id: category_id },
      });
      if (!category)
        return res.status(400).json({ message: "Category not found" });
    }

    if (tags?.length) {
      const tagsExist = await prismaService.tag.findMany({
        where: { unique_id: { in: tags } },
      });
      if (tagsExist.length !== tags.length)
        return res.status(400).json({ message: "Tag not found" });
    }

    const newPost = await prismaService.post.create({
      data: {
        title,
        content,
        excerpt,
        featured_image,
        slug,
        status,
        user_id,
        category_id: category_id,
        description,
        tags: tags?.length
          ? { connect: tags.map((tagId: string) => ({ unique_id: tagId })) }
          : undefined,
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
    const { search, page = 1, limit = 10 } = req.body;
    const user_id = req.body.user.id;

    const posts = await prismaService.post.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { created_at: "desc" },
      where: {
        user_id: user_id,
      },
      omit: {
        user_id: true,
        category_id: true,
      },
    });

    const totalPosts = await prismaService.post.count({
      where: {
        user_id: user_id,
      },
    });

    res.status(200).json({
      message: "Posts retrieved successfully",
      data: {
        posts,
        total_posts: totalPosts,
        total_pages: Math.ceil(totalPosts / limit),
        page_number: page,
      },
    });
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
    const user_id = req.body.user.id;
    const post = await prismaService.post.findUnique({
      where: { unique_id: id },
      include: {
        user: { select: { name: true } },
        tags: {
          select: {
            name: true,
            unique_id: true,
          },
        },
        Category: {
          select: {
            name: true,
            unique_id: true,
          },
        },
        Comment: {
          select: {
            unique_id: true,
            content: true,
            created_at: true,
            user: {
              select: {
                name: true,
              },
            },
          },
        },
        PostLike: {
          where: {
            user_id: user_id,
          },
          select: {
            user_id: true,
            unique_id: true,
          },
        },
        _count: {
          select: {
            PostLike: true,
            Comment: true,
          },
        },
      },
    });

    if (!post) return res.status(404).json({ message: "Post not found by this id" });

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
    const { title, content, status, category_id, tags, featured_image } =
      req.body;

    const updatedPost = await prismaService.post.update({
      where: { unique_id: id },
      data: {
        title,
        content,
        featured_image,
        status,
        category_id,
        tags: tags?.length
          ? {
            set: tags.map((tagId: string) => ({ unique_id: tagId })),
          }
          : undefined,
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

export const getLatestPosts = async (req: Request, res: Response) => {
  try {
    const latestPosts = await prismaService.post.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { created_at: "desc" },
      take: 5,
      include: {
        user: { select: { name: true } },
        tags: {
          select: {
            name: true,
            unique_id: true,
          },
        },
        Category: {
          select: {
            name: true,
            unique_id: true,
          },
        },
      },
    });

    res.status(200).json({ message: "Latest posts retrieved successfully", data: latestPosts });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
