import { Request, Response } from "express";
import prisma from "../../prisma/client";
// PATCH /lobby/:lobbyId/deductAmount
// PATCH /lobby/:lobbyId/deductAmount
export const joinGameRoom = async (req: Request, res: Response) => {
  console.log("reached here in teh joinGameRoom")
  const { lobbyId } = req.params;

  const lobby = await prisma.waitingLobby.findUnique({
    where: { id: lobbyId },
    include: {
      createdBy: true,
    },
  });

  if (!lobby) return res.status(404).json({ message: "Lobby not found" });

  // Prevent re-deduction
  if (!lobby.gameLobbyId) {
    return res.status(400).json({ message: "Lobby does not have a valid gameLobbyId" });
  }
  const existingBet = await prisma.bet.findFirst({
    where: { gameLobbyId: lobby.gameLobbyId },
  });
  if (existingBet) {
    return res.status(200).json({ alreadyPlaced: true });
  }

  const allUserIds = [lobby.createdById, ...lobby.invitedUserIds];

  // Deduct balance from all users
  for (const userId of allUserIds) {
    console.log("the userId is : ",userId);
    const wallet = await prisma.wallet.findUnique({ where: { userId } });
    if (!wallet || wallet.balance < lobby.betAmount) {
      return res.status(400).json({ message: `User ${userId} has insufficient balance` });
    }
    
    await prisma.wallet.update({
      where: { userId },
      data: { balance: { decrement: lobby.betAmount } },
    });
     // Create a single  bet per user per gameId , useful for resolving in future
     await prisma.bet.create({
        data: {
          userId,
          gameLobbyId: lobby.gameLobbyId,
          amount: lobby.betAmount,
        },
  });

  }

  return res.status(200).json({ message : "Successful"});
};

