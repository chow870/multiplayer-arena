import { Request, Response } from 'express';
import prisma from '../../prisma/client';
// import { prisma } from '../prismaClient'; // Adjust this import to your setup

// this controller creates a new game record

export const createGameRecord = async (req: Request, res: Response) => {
  try {
    const { gameType, invitedUserIds,betAmount } = req.body;
    const userId = (req as any).user.id
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!gameType || !Array.isArray(invitedUserIds)) {
      return res.status(400).json({ error: 'Invalid data format' });
    }
    const newGame = await prisma.gameRecord.create({
    data: {
    gameType,
    createdBy:userId,
    invitedUserIds,
    player: {
      connect: { id: userId },
    },
    betAmount,
    currentState: {}, // Empty JSON, will be updated during gameplay
    endedAt: new Date(Date.now() + 300 * 1000), // 1 hour from now
  },
  });


    return res.status(201).json({ id: newGame.id });
  } catch (error) {
    console.error('Error creating game record:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
