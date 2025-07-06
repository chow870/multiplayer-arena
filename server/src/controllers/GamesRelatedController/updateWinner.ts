// controllers/gameControllers/updateWinner.ts

import { Request, Response } from 'express';
import prisma from '../../prisma/client';
import { console } from 'inspector';

export const getWinner = async (req: Request, res: Response) => {
  const { gameId } = req.params;
  // const { winnerId } = req.body;
  const userId:string = (req as any).user.id;

  // if (!winnerId) {
  //   return res.status(400).json({ error: 'Missing winnerId' });
  // }


  try {
    const rec = prisma.gameRecord.findUnique({
      where:{id :gameId},
      include:{
        winner:true
      }
    })
    console.log("wineer is : ", rec)
    res.status(200).json({ winner:rec });
  } catch (error) {
    console.error('Error updating winner:', error);
    res.status(500).json({ error: 'Internal server error while updating winner' });
  }
};

