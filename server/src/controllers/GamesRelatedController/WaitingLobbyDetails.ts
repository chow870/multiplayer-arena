// controllers/lobbies/getLobbyDetails.ts
import { Request, Response } from 'express';
import prisma from '../../prisma/client';
import { console } from 'inspector';
// import { prisma } from '../../prismaClient';

export const getLobbyDetails = async (req: Request, res: Response) => {
  try {
    console.log('Fetching lobby details for lobbyId:', req.params.lobbyId);
    const { lobbyId } = req.params;

    const lobby = await prisma.waitingLobby.findUnique({
      where: { id: lobbyId },
      include: {
        createdBy: {
          select: { id: true, username: true, avatarUrl: true }
        }
      }
    });

    if (!lobby) {
      return res.status(404).json({ error: 'Lobby not found' });
    }
    console.log('Lobby details fetched successfully:', lobby);
    return res.status(200).json({ lobby });
  } catch (error) {
    console.error('Error fetching lobby:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
