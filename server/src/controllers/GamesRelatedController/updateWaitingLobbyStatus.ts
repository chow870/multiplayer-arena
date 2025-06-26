// controllers/lobbyController.ts
import { Request, Response } from 'express';
import prisma from '../../prisma/client';


export const expireWaitingRoom = async (req: Request, res: Response) => {
  const { lobbyId } = req.params;
  console.log("reached the expireWaitingRoom ");

  try {
    const lobby = await prisma.waitingLobby.findUnique({
      where: { id: lobbyId },
    });

    if (!lobby) {
      return res.status(200).json({ message: 'Lobby not found / already deleted' });
    }

    const currentExpiresAt = new Date(lobby.expiresAt).getTime();
    const now = Date.now();

    if (currentExpiresAt <= now) {
      return res.status(200).json({ message: 'Already expired' });
    }

    const updatedLobby = await prisma.waitingLobby.update({
      where: { id: lobbyId },
      data: {
        expiresAt: new Date(), // Set to now
      },
    });
    console.log("updated the waiting lobby status");
    return res.status(200).json({
      message: 'expiresAt updated to now',
      updatedExpiresAt: updatedLobby.expiresAt,
    });
  } catch (error) {
    console.error('[expireWaitingRoom] Error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};
