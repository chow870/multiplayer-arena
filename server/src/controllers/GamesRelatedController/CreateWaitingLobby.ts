// routes/games/createLobby.ts

import { Request, Response } from 'express';
import prisma from '../../prisma/client';
// import { prisma } from '../../prismaClient';

export const createWaitingLobby = async (req: Request, res: Response) => {
  try {
    const createdById = (req as any).user.id;
    if (!createdById) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { invitedUserId, gameMode } = req.body;
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    if(gameMode =="SINGLE" ) {
      // Handle single player mode
       const lobby = await prisma.waitingLobby.create({
      data: {
        createdById: createdById,
        invitedUserIds: [], // i will have to change for multiple players
        expiresAt,
      },
    });

    return res.status(201).json({ lobbyId: lobby.id });
    }

    if (!invitedUserId || typeof invitedUserId !== 'string') {
      return res.status(400).json({ error: 'Invalid invited user ID' });
    }

    // const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    const lobby = await prisma.waitingLobby.create({
      data: {
        createdById: createdById,
        invitedUserIds: [invitedUserId], // i will have to change for multiple players
        expiresAt,
        gameLobbyId : req.body.gameLobbyId
      },
    });

    return res.status(201).json({ lobbyId: lobby.id });
  } catch (err) {
    console.error('Error creating lobby:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
