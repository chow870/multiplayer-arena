// controllers/blogs.ts
import { Request, Response } from "express";
import prisma from "../../prisma/client";


// Create blog
export const createBlog = async (req: Request, res: Response) => {
  const authorId = (req as any).user.id;
  const { title, content } = req.body;
  const blog = await prisma.blog.create({
    data: { authorId, title, content },
  });
  res.json(blog);
};

// Pagination query: `GET /blogs?page=1&limit=10`
export const listBlogs = async (req: Request, res: Response) => {
  const page = parseInt((req.query.page as string) || "1");
  const limit = parseInt((req.query.limit as string) || "10");
  const skip = (page - 1) * limit;
  const [blogs, total] = await Promise.all([
    prisma.blog.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: { author: { select: { id: true, username: true, avatarUrl: true } } },
    }),
    prisma.blog.count(),
  ]);
  res.json({ blogs, page, totalPages: Math.ceil(total / limit), total });
};

// Retrieve a single blog
export const getBlog = async (req: Request, res: Response) => {
  const { id } = req.params;
  const blog = await prisma.blog.findUnique({
    where: { id },
    include: { author: { select: { id: true, username: true } } },
  });
  if (!blog) return res.status(404).json({ error: "Blog not found" });
  res.json(blog);
};
// controllers/blogs.ts (add this to the file)
export const getMyBlogs = async (req: Request, res: Response) => {
  const authorId = (req as any).user.id;
  const blogs = await prisma.blog.findMany({
    where: { authorId },
    orderBy: { createdAt: "desc" },
  });
  res.json(blogs);
};


// Add a comment
export const addComment = async (req: Request, res: Response) => {
  const authorId = (req as any).user.id;
  const { blogId, content } = req.body;
  const comment = await prisma.comment.create({
    data: { blogId, authorId, content },
  });
  res.json(comment);
};

// Get comments with pagination
export const listComments = async (req: Request, res: Response) => {
  const { blogId } = req.params;
  const page = parseInt((req.query.page as string) || "1");
  const limit = parseInt((req.query.limit as string) || "10");
  const skip = (page - 1) * limit;
  const [comments, total] = await Promise.all([
    prisma.comment.findMany({
      where: { blogId },
      skip,
      take: limit,
      orderBy: { createdAt: "asc" },
      include: { author: { select: { id: true, username: true, avatarUrl: true } } },
    }),
    prisma.comment.count({ where: { blogId } }),
  ]);
  res.json({ comments, page, totalPages: Math.ceil(total / limit), total });
};

// Like/dislike endpoints:
export const reactBlog = async (req: Request, res: Response) => {
  const { blogId } = req.params;
  const { type } = req.body; // "like" or "dislike"
  const blog = await prisma.blog.update({
    where: { id: blogId },
    data: { [type === "like" ? "likes" : "dislikes"]: { increment: 1 } },
  });
  res.json({ likes: blog.likes, dislikes: blog.dislikes });
};
