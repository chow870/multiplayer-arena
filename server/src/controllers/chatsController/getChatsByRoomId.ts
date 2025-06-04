import { Request, Response } from 'express';
import prisma from '../../prisma/client';

export const getRoomMessages = async (req: Request, res: Response) => {
  const { roomId } = req.params;
  console.log("reached the backend to get RoomMessages");
   console.log("Fetching messages for roomId:", roomId);
   
  if (!roomId) { 
    return res.status(400).json({ error: "Room ID is required" });
  }

  try {
    const messages = await prisma.message.findMany({
      where: { roomId },
      orderBy: { timestamp: 'asc' },
    });

    return res.json({ messages });
  } catch (err) {
    console.error("Error fetching messages:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};