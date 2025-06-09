// controllers/games/getInvites.ts

import { Request, Response } from 'express';
import prisma from '../../prisma/client';
// import { prisma } from '../../prismaClient';

export const getReceivedInvites = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id
    const lobbies = await prisma.waitingLobby.findMany({
      where: {
        invitedUserIds: {
          has: userId,
        },
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
    console.error('Error fetching invites:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
