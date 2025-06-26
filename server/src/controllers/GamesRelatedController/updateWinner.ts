// controllers/gameControllers/updateWinner.ts

import { Request, Response } from 'express';
import prisma from '../../prisma/client';

export const updateWinner = async (req: Request, res: Response) => {
  const { gameId } = req.params;
  const { winnerId } = req.body;
  const userId:string = (req as any).user.id;

  if (!winnerId) {
    return res.status(400).json({ error: 'Missing winnerId' });
  }


  try {
    // before that i wil have to create a transation and also build up the amount
   

    const game = await prisma.gameRecord.findUnique({
      where: {
        id : gameId
      }
    })
    if(!game || userId != winnerId) return res.status(200);

      const user = await prisma.user.findUnique({
        where : {
          id : userId
        },
        include:{
          wallet:true
        }
      })
    
    if (!user || !user.wallet) {
      return res.status(200)
    }

    const currentAmount = user.wallet.balance
    
    const RefundObject = await prisma.transaction.create({
      data :{
        userId,
        amount : game.betAmount,
        type : "Win",
        status: "ACCEPTED"
      }
    })

    const updatedGame = await prisma.gameRecord.update({
      where: { id: gameId },
      data: {
        winnerId,
        endedAt: new Date(),
        gameState: 'COMPLETED',
      },
    });

    await prisma.user.update({
      where: {
        id: userId,
      },
      data:{
        wallet: {
          update: {
            balance: currentAmount + game.betAmount,
          }
        }
      }
    })  
   
    res.status(200).json({ message: 'Winner updated', updatedGame });
  } catch (error) {
    console.error('Error updating winner:', error);
    res.status(500).json({ error: 'Internal server error while updating winner' });
  }
};

