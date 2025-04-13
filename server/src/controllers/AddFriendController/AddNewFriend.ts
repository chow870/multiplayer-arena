import { Request, Response } from "express";
import prisma from "../../prisma/client";


export default async function addNewFriend(req: Request, res: Response) {
    const userid= (req as any).user.id
    const { friendId } = req.body; // Assuming you're sending the friend's ID in the request body


    try{
        // check if the request alrady exists
        const existingRequest = await prisma.friendship.findFirst({
            where : {
                senderId : userid,
                receiverId : friendId,  
            }
        })
        if(existingRequest != null){
            res.status(409).json({message : "Friend request already sent"})
            console.log("Friend request already sent:", existingRequest);
            return;
        }

        // creating a new friendship record in the database
        const friend = await prisma.friendship.create({
            data: {
               senderId: userid,
               receiverId: friendId,
               status: "PENDING", // Assuming you want to set the initial status to PENDING
            }
        })

        res.status(201).json({ message: 'Friend request sent successfully', friend });
        console.log("Friend request sent successfully:", friend);
    }catch(error){

        res.status(500).json({message : "Internal server error"})
        console.error("Error sending friend request:", error);
    }


}