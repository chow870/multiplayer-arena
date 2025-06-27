// controllers/user/updateProfile.ts
import { Request, Response } from "express";
import prisma from "../../prisma/client";

export const updateUserProfile = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;

  const { avatarUrl, bio, username } = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        avatarUrl: avatarUrl || undefined,
        bio: bio || undefined,
        username: username || undefined,
      },
      select: {
        id: true,
        username: true,
        email: true,
        avatarUrl: true,
        bio: true,
        emailVerified: true,
        isPremium: true,
        rating: true,
        gamesPlayed: true,
        gamesWon: true,
        gamesLost: true,
      },
    });

    return res.json(updatedUser);
  } catch (err) {
    return res.status(500).json({ message: "Failed to update profile", error: err });
  }
};
