import { Request, Response } from 'express';
import prisma from '../../prisma/client';
// import { prisma } from '../../lib/prisma';

export const updateGameState = async (req: Request, res: Response) => {
  const { gameId } = req.params;
  const { currentState, currentPalyerId, index, totalPlayer } = req.body;
  console.log("from the update Game state : [backend] ");

  if (!currentState || currentPalyerId === undefined || index === undefined || totalPlayer === undefined) {
    return res.status(400).json({ error: 'Missing required game data.' });
  }

  try {
    // Roll the dice (1 to 6)
    const roll = Math.floor(Math.random() * 6) + 1;

    // Clone the current state to avoid mutating input directly
    const newState = { ...currentState };

    // Get current position of the player
    const currentPos = newState[currentPalyerId] || 0;

    // Calculate new position (max 100)
    let newPos = currentPos + roll;
    if (newPos > 100) {
      newPos = 100; // Do not move if it overshoots
    }

    // Update the position
    newState[currentPalyerId] = newPos;

    // Calculate next player's turn
    const nextTurn = (index + 1) % totalPlayer;

    // Update the game in the database
    const updatedGame = await prisma.gameRecord.update({
      where: { id: gameId },
      data: {
        currentState: newState,
        currentTurn: nextTurn,
        gameState: 'ACTIVE',
      },
    });

    return res.status(200).json({
      
        message: 'Game state updated successfully.',
        roll,
        newPosition: newPos,
        updatedState : updatedGame.currentState,
        nextTurn
      
     
    });

  } catch (error) {
    console.error('Error updating game state:', error);
    return res.status(500).json({ error: 'Internal server error while updating game state' });
  }
};
