// controllers/gameLobby/getGameLobbyDetails.ts
import { Request, Response } from 'express';
import prisma from '../../prisma/client';


export const getGameLobbyDetails = async (req: Request, res: Response) => {
  try {
    const { gameId } = req.params;

    const game = await prisma.gameRecord.findUnique({
      where: { id: gameId },
      include: {
        winner: {
          select: { id: true, username: true }
        }
      }
    });

    if (!game) {
      return res.status(404).json({ error: 'Game lobby not found' });
    }

    return res.status(200).json({ gameLobby: game });
  } catch (error) {
    console.error('Error fetching game lobby:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
