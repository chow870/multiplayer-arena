// controllers/games/joinWaitingLobby.ts

import { Request, Response } from 'express';
import prisma from '../../prisma/client';
// import { prisma } from '../../prismaClient';

export const joinWaitingLobby = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const lobbyId = req.params.lobbyId;

    const lobby = await prisma.waitingLobby.findUnique({
      where: { id: lobbyId },
    });

    if (!lobby) {
      return res.status(404).json({ error: 'Lobby not found' });
    }

    if (new Date() > lobby.expiresAt) {
      return res.status(410).json({ error: 'Lobby has expired' });
    }
    
    // thus checking if he can join or not.
    let betAmount = lobby.betAmount;
    const user = await prisma.user.findUnique({
      where :{id : userId},
      include :{
        wallet: true
      }
    })
    if (!user || !user.wallet || typeof user.wallet.balance !== 'number' || user.wallet.balance < betAmount) {
      return res.status(401).json({ error: 'Insufficient amount in the balance' });
    }

    if (lobby.createdById === userId) {
      return res.status(200).json({ message: 'Successfully joined lobby', lobbyId });
    }

    const invited = lobby.invitedUserIds.includes(userId);
    if (!invited) {
      return res.status(403).json({ error: 'You are not invited to this lobby' });
    }

    // Success
    return res.status(200).json({ message: 'Successfully joined lobby', lobbyId });
  } catch (error) {
    console.error('Error joining lobby:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
