// server/src/routes/chatRoutes.ts
import { Router } from "express";
import { getLobbyDetails } from "../../../controllers/GamesRelatedController/WaitingLobbyDetails";
import { getSentInvites } from "../../../controllers/GamesRelatedController/InvitesSent";
import { getReceivedInvites } from "../../../controllers/GamesRelatedController/InvitesReceived";
import { deleteLobby } from "../../../controllers/GamesRelatedController/InvitesReject";
import { joinWaitingLobby } from "../../../controllers/GamesRelatedController/JoinWaitingLobby";
import { createWaitingLobby } from "../../../controllers/GamesRelatedController/CreateWaitingLobby";
import { createGameRecord } from "../../../controllers/GamesRelatedController/CreateGameRecord";
import { getGameLobbyDetails } from "../../../controllers/GamesRelatedController/getGameLobbyRecord";
import { getWinner } from "../../../controllers/GamesRelatedController/updateWinner";
import { updateGameState } from "../../../controllers/GamesRelatedController/updateGameState";
import { expireWaitingRoom } from "../../../controllers/GamesRelatedController/updateWaitingLobbyStatus";
import { joinGameRoom } from "../../../controllers/GamesRelatedController/JoinGameRoom";

const GameRouter = Router();

// Define dynamic route with :roomId
// WaitingLobbyRouter.get("/:roomId", getRoomMessages);
GameRouter.post("/invite", createWaitingLobby);
GameRouter.post("/lobby/:lobbyId/join",joinWaitingLobby );
GameRouter.delete("/lobby/:lobbyId",deleteLobby );
GameRouter.get("/invites", getReceivedInvites );
GameRouter.get("/sent-invites",getSentInvites );
GameRouter.get("/lobby/:lobbyId/details",getLobbyDetails);
GameRouter.patch('/lobby/:lobbyId/expireWaitingRoom', expireWaitingRoom);
// games
GameRouter.post('/createGame',createGameRecord);
GameRouter.get("/Gamelobby/:gameId/details",getGameLobbyDetails);
GameRouter.get('/Gamelobby/:gameId/getWinner',getWinner);// this also done internally 
GameRouter.patch('/Gamelobby/:gameId/updateGameState',updateGameState); // this will be now be done internally. 
GameRouter.patch('/lobby/:lobbyId/deductAmount',joinGameRoom)



export default GameRouter;
// This router handles chat-related routes, specifically for getting messages by room ID and posting new messages to a specific room.