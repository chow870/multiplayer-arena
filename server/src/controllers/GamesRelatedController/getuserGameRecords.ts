import { Request, Response } from "express";
import prisma from "../../prisma/client";

export const getUserGameRecords = async (req: Request, res: Response) => {
  try {
    console.log('reached the getUserGameRecords controller ')
    const userId = (req as any).user.id;
   
    const gameRecords = await prisma.gameRecord.findMany({
      where: {
        OR: [
          { playerId: userId },
          { invitedUserIds: { has: userId } }, // checks if userId is in the array
        ],
      },
      include: {
        winner: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
          },
        },
        player: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json(gameRecords);
  } catch (error) {
    console.error("Failed to fetch game records:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
