// controllers/games/deleteLobby.ts

import { Request, Response } from 'express';
import prisma from '../../prisma/client';
// import { prisma } from '../../prismaClient';

export const deleteLobby = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const lobbyId = req.params.lobbyId;

    const lobby = await prisma.waitingLobby.findUnique({
      where: { id: lobbyId },
    });

    if (!lobby) {
      return res.status(200).json({ message:'lobby already deleted' });
    }

    await prisma.waitingLobby.delete({
      where: { id: lobbyId },
    });

    res.status(200).json({ message: 'Lobby removed successfully' });
  } catch (error) {
    console.error('Error deleting lobby:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
