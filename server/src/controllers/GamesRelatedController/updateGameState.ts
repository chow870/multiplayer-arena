// controllers/gameControllers/updateGameState.ts

import { Request, Response } from 'express';
import prisma from '../../prisma/client';


export const updateGameState = async (req: Request, res: Response) => {
  const { gameId } = req.params;
  const { currentState, nextTurn } = req.body;

  if (!currentState || nextTurn === undefined) {
    return res.status(400).json({ error: 'Missing game state or next turn info.' });
  }

  try {
    const updatedGame = await prisma.gameRecord.update({
      where: { id: gameId },
      data: {
        currentState,
        currentTurn: nextTurn,
        gameState: 'ACTIVE', // Optional, if you want to set it
      },
    });

    res.status(200).json({ message: 'Game state updated', updatedGame });
  } catch (error) {
    console.error('Error updating game state:', error);
    res.status(500).json({ error: 'Internal server error while updating game state' });
  }
};
