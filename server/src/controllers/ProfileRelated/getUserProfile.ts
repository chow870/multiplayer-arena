// controllers/user/fetchProfile.ts
import { Request, Response } from "express";
import prisma from "../../prisma/client";

export const getUserProfile = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        emailVerified: true,
        isPremium: true,
        avatarUrl: true,
        bio: true,
        gamesPlayed: true,
        gamesWon: true,
        gamesLost: true,
        rating: true,
        createdAt: true,
      },
    });

    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json(user);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err });
  }
};
