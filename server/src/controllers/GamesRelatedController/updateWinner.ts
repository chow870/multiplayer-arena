// controllers/gameControllers/updateWinner.ts

import { Request, Response } from 'express';
import prisma from '../../prisma/client';

export const updateWinner = async (req: Request, res: Response) => {
  const { gameId } = req.params;
  const { winnerId } = req.body;

  if (!winnerId) {
    return res.status(400).json({ error: 'Missing winnerId' });
  }

  try {
    const updatedGame = await prisma.gameRecord.update({
      where: { id: gameId },
      data: {
        winnerId,
        endedAt: new Date(),
        gameState: 'COMPLETED',
      },
    });

    res.status(200).json({ message: 'Winner updated', updatedGame });
  } catch (error) {
    console.error('Error updating winner:', error);
    res.status(500).json({ error: 'Internal server error while updating winner' });
  }
};

