import { Request,Response } from "express";
import prisma from "../../prisma/client";



export default async function acceptFriendRequest(req: Request, res: Response) {
    const userId = (req as any).user.id; // Assuming you have middleware to set req.user.id
    const { friendId } = req.body; // Assuming you're sending the friend's ID in the request body
    // time to update the request
    console.log("reached the backend of acceptFriendRequest controller", userId, friendId);

    try {
        const resp = await prisma.friendship.update({
            where : {
                senderId_receiverId: {
                    senderId: friendId,
                    receiverId: userId,
                },
            },
            data: {
                status: 'ACCEPTED',
                updatedAt: new Date(),
            }
        })
        res.status(200).json(resp);
        
    } catch (error) {
        res.status(500).json({ message: 'Error accepting friend request' });
        console.error("Error accepting friend request:", error);
        return;
        
    }

   
}