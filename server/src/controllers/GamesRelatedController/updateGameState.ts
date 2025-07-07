import { Request, Response } from 'express';
import prisma from '../../prisma/client';
import redis from '../../workers/redisClient';
// import { prisma } from '../../lib/prisma';

export const updateGameState = async (req: Request, res: Response) => {
  try {
  const { gameId } = req.params;
  const userId = (req as any).user.id;
  const { currentState, currentPalyerId, index, totalPlayer } = req.body;
  console.log("from the update Game state : [backend] ");

  if (!currentState || currentPalyerId === undefined || index === undefined || totalPlayer === undefined) {
    return res.status(400).json({ error: 'Missing required game data.' });
  }
    // Roll the dice (1 to 6)
    const roll = Math.floor(Math.random() * 6) + 1;

    // Clone the current state to avoid mutating input directly
    const newState = { ...currentState };

    // Get current position of the player
    const currentPos = newState[currentPalyerId] || 0;

    // Calculate new position (max 100)
    // let me update the wiinner position
    let newPos = currentPos + roll;

    if (newPos >= 30) {
      newPos = 30; 
      // implies this is the new winner 
      // later i would give this to the workers 
      // here only update the winner also.
      await prisma.gameRecord.update({
        where: {id: gameId},
        data:{
          winnerId : userId,
        },
      })
      console.log("internally updated the winner also.")
      redis.lpush("update_the_game",JSON.stringify({
        element :{
          gameId
        }
      }));

      newState[currentPalyerId] = newPos;

        // Calculate next player's turn
        var nextTurn = (index + 1) % totalPlayer;

        // Update the game in the database
        var updatedGame = await prisma.gameRecord.update({
          where: { id: gameId },
          data: {
            currentState: newState,
            currentTurn: nextTurn,
            gameState: 'ACTIVE',
          },
        });

    }
    else{

      newState[currentPalyerId] = newPos;
      // Calculate next player's turn
      var nextTurn = (index + 1) % totalPlayer;

      // Update the game in the database
      var updatedGame = await prisma.gameRecord.update({
        where: { id: gameId },
        data: {
          currentState: newState,
          currentTurn: nextTurn,
          gameState: 'ACTIVE',
        },
      });

    }
    // Update the position
    
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
