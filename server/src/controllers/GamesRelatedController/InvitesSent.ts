// controllers/games/getSentInvites.ts

import { Request, Response } from 'express';
import prisma from '../../prisma/client';
// import { prisma } from '../../prismaClient';

export const getSentInvites = async (req: Request, res: Response) => {
  try {
    // const userId = req.user.id;
      const userId = (req as any).user.id

    const lobbies = await prisma.waitingLobby.findMany({
      where: {
        createdById: userId,
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.status(200).json({ lobbies });
  } catch (error) {
    console.error('Error fetching sent invites:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
