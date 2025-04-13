   
// controllers/friendRequestController.ts
import { Request, Response } from 'express';
import prisma from "../../prisma/client";

export const getAllUsersForFriendRequest = async (req: Request, res: Response) => {
 
 const  searchTerm:string  = req.body.username; // Assuming you're sending the search term in the request body
  const userId = (req as any).user.id; // Extract the user ID from the request // this is sending from the auth middleware.
  console.log("Received search request:", searchTerm, userId);

//   Excluding Already Friends (and Sent Requests):
// The code finds all friendship records where the logged-in user (identified by userId) is either the sender or receiver.
// It selects both senderId and receiverId in the friendship model (so, if the current user is either the sender or receiver, they will be excluded).
// After retrieving these IDs, the .then() part takes the senderId and receiverId from each friendship record and combines them into a single list of user IDs (this list includes users who are friends or have a pending request with the logged-in user).
// Exclusion of Already Friend Users: The NOT clause ensures that all users who are either friends or who have already sent/received a friend request are excluded from the result, by checking the IDs in the in condition.
  try {
    
    
    // Fetch users excluding the current user and any users who are already friends or have sent/received a request.
    const users = await prisma.user.findMany({
      where: {
        username: {
          contains: searchTerm, // Search users based on username
          mode: 'insensitive',  // Case-insensitive search
        },
        NOT: {
          id: {
            in: [userId, ...(await prisma.friendship.findMany({
              where: {
                OR: [
                  { senderId: userId },
                  { receiverId: userId },
                ],
                status: { in: ['ACCEPTED', 'PENDING'] }, // Exclude friends or pending requests
              },
              select: {
                senderId: true,
                receiverId: true,
              }
            }).then(data => data.map(friend => friend.senderId).concat(data.map(friend => friend.receiverId))))]
          }
        }
      }
    });      

    res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    // console.error("Detailed error:", error.message);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};
