// POST /api/v1/chats/:roomId
// Body: { message: string }

import prisma from "../../prisma/client";

import { Request, Response } from "express";

export const postMessage = async (req: Request, res: Response) => {
  const { roomId } = req.params;
  const { message } = req.body;
  const senderId = (req as any).user.id; // Assuming you have middleware to set req.user.id
  console.log("Posting message to roomId:", roomId, "by senderId:", senderId);
    if (!roomId || !message || !senderId) {
            return res.status(400).json({ error: "Room ID, message, and sender ID are required" });
    } 
    // Validate message
    if (typeof message !== "string" || message.trim() === "") {
            return res.status(400).json({ error: "Message must be a non-empty string" });
    }
    // Optional: Validate message length
    if (message.length > 500) {
            return res.status(400).json({ error: "Message exceeds maximum length of 500 characters" });
    }

  try {
    const newMessage = await prisma.message.create({
      data: {
        roomId,
        senderId,
        message,
      },
    });

    return res.status(201).json({ message: newMessage });
  } catch (err) {
    console.error("Error posting message:", err);
    return res.status(500).json({ error: "Could not send message" });
  }
};
