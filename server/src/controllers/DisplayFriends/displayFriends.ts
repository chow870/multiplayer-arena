import { Request, Response } from 'express';
import prisma from '../../prisma/client';

export const getUserFriendships = async (req: Request, res: Response) => {
    const userId = (req as any).user.id; // Assuming you have middleware to set req.user.id
    console.log("reached the backend of getUserFriendships controller", userId);
    try {
      const friendships = await prisma.friendship.findMany({
        where: {
          OR: [
            { senderId: userId },
            { receiverId: userId },
          ],
        },
        include: {
          sender: true,
          receiver: true,
        },
      });
  
      const pendingRequests = friendships.filter(
        (f) => f.status === 'PENDING'
      );
  
      const acceptedFriends = friendships.filter(
        (f) => f.status === 'ACCEPTED'
      );
  
      const blockedUsers = friendships.filter(
        (f) => f.status === 'BLOCKED'
      );
      const pendingRequestsTOSend = pendingRequests.map((f) => {
        return {
          id: f.id,
          senderid: f.sender.id,
          sendername: f.sender.username,
          receiverid: f.receiver.id,
          avatarUrlSender:f.sender.avatarUrl,
          avatarUrlReceiver : f.receiver.avatarUrl,
          receivername: f.receiver.username,
          status: f.status
        };
      });
      const blockedUsersRequestsTOSend = blockedUsers.map((f) => {
        return {
          id: f.id,
          senderid: f.sender.id,
          sendername: f.sender.username,
          receiverid: f.receiver.id,
          avatarUrlSender:f.sender.avatarUrl,
          avatarUrlReceiver : f.receiver.avatarUrl,
          receivername: f.receiver.username,
          status: f.status
        };
      });
      const acceptedFriendsRequestsTOSend = acceptedFriends.map((f) => {
        return {
          id: f.id,
          senderid: f.sender.id,
          sendername: f.sender.username,
          receiverid: f.receiver.id,
          avatarUrlSender:f.sender.avatarUrl,
          avatarUrlReceiver : f.receiver.avatarUrl,
          receivername: f.receiver.username,
          status: f.status
        };
      });

      console.log(pendingRequestsTOSend, acceptedFriendsRequestsTOSend, blockedUsersRequestsTOSend);
      console.log("ending here in getUserFriendships controller", userId);
      res.status(200).json({ pendingRequests: pendingRequestsTOSend, acceptedFriends: acceptedFriendsRequestsTOSend, blockedUsers: blockedUsersRequestsTOSend });
    } catch (error) {
      console.error('Error in getUserFriendships:', error);
      res.status(500).json({ message: 'Error fetching friendships' });
    }
  };
  