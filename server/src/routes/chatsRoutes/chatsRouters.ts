// server/src/routes/chatRoutes.ts
import { Router } from "express";
import { getRoomMessages } from "../../controllers/chatsController/getChatsByRoomId";
import { postMessage } from "../../controllers/chatsController/sendMessage";

const chatFriendsRouter = Router();

// Define dynamic route with :roomId
chatFriendsRouter.get("/:roomId", getRoomMessages);
chatFriendsRouter.post("/:roomId", postMessage);

export default chatFriendsRouter;
// This router handles chat-related routes, specifically for getting messages by room ID and posting new messages to a specific room.