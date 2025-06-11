import express,{Express,Request,Response} from 'express'
import cors from 'cors';
import LoginRouter from './routes/LoginRoutes/LoginRoute';
import SignupRouter from './routes/SignupRoutes/SignupRoute';
import sendOtpRouter from './routes/authRoutes/SendOtpRoute';
import VerifyOtpRouter from './routes/authRoutes/VerifyOptRoute';
import AddFriendRouter from './routes/AddFriendController/AddNewFriend';
import UserSearchRouter from './routes/UserSearch/UserSearch';
import DisplayFriendsRouter from './routes/DisplayFriends/DisplayFriends';
import FriendRequestRouter from './routes/FriendRequest/acceptFriendRequest';
import { authenticateToken } from './middlewares/authMiddleware';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import{ClientToServerEvents, ServerToClientEvents} from './sockets/types';
import chatFriendsRouter from './routes/chatsRoutes/chatsRouters';
import GameRouter from './routes/gamesRoutes/WaitingLobbyRoutes/combinedWLRoutes';
import { isAmountSufficient } from './middlewares/isAmountSufficient';
import { getWalletBalance } from './controllers/PayementRelated/fetchBalance';
import payementRouter from './routes/payementRelated/fetchBalanceRouter';
import ConfirmpayementRouter from './routes/payementRelated/payementVerificationHandler';

const app:Express = express();
const httpServer = http.createServer(app);
const io = new SocketIOServer(httpServer);

// Basic usage
app.use(cors());
// You can also configure it:

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use('/api/v1/login',LoginRouter);
app.use('/api/v1/signup',SignupRouter);
app.use('/api/v1/sendotp',sendOtpRouter);
app.use('/api/v1/verifyotp',VerifyOtpRouter);
app.use('/api/v1/pay/paymentverification',ConfirmpayementRouter);

app.use(authenticateToken); // Middleware to authenticate token for all routes below this line

app.use('/api/v1/add-friend',AddFriendRouter);
app.use('/api/v1/search-users',UserSearchRouter);
app.use('/api/v1/friendships',DisplayFriendsRouter);
app.use('/api/v1/friend-request',FriendRequestRouter);
app.use('/api/v1/chats',chatFriendsRouter );
app.use('/api/v1/games', GameRouter);
app.use('/api/v1/pay',payementRouter);
// app.get('/api/v1/balance',isAmountSufficient,);

// socket connections
const onlineUsers = new Map<string, string>(); // socketId -> userId
// userId → socketId
const userIdToSocketId = new Map();
// socketId → userId
const socketIdToUserId = new Map();
// roomId → Set<userId>
const lobbyMembers = new Map();
const gameRoomMembers    = new Map<string, Set<string>>();      // gameId  -> userIds

io.on("connection", (socket) => {
  socket.on("userConnected", (userId: string) => {
    socket.data.userId = userId;
    console.log(`User connected: ${userId} with socket ID: ${socket.id}`);
    console.log("Online Users:", Array.from(onlineUsers.entries()));
    onlineUsers.set(socket.id, userId);
    userIdToSocketId.set(userId, socket.id);
    socketIdToUserId.set(socket.id, userId);

    // Notify others
    socket.broadcast.emit("userOnline", userId);

    // Send full list to the new user
    const users = [...onlineUsers.values()];
    socket.emit("onlineUsers", users);
  });

  // Handle user joining and leaving rooms
  // also the message sending logic

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`[socket event 'joinRoom'] User${socket.data.userId} joined room ${roomId}`);
  });

  socket.on("leaveRoom", (roomId) => {
    socket.leave(roomId);
    console.log(`[socket event 'leave'] User${socket.data.userId} User left room ${roomId}`);
  });

  socket.on("sendMessage", ({ user, roomId, message }) => {
    console.log(`[socket event 'sendMessage'] from ${user} in room ${roomId}: ${message}`);
    const payload = {
      id:roomId,
      sendId:user,
      message,
      timestamp: new Date().toISOString(),
    };

    // Broadcast to everyone in the room except sender
    socket.to(roomId).emit("receiveMessage", payload);
  });


  socket.on("disconnect", () => {
    const userId = socket.data.userId;
    onlineUsers.delete(socket.id);
    console.log(`User disconnected: ${userId} with socket ID: ${socket.id}`);
    console.log("Online Users after disconnect:", Array.from(onlineUsers.entries()));

    if (userId) {
      socket.broadcast.emit("userOffline", userId);
    }
    // const userId = socketIdToUserId.get(socket.id);
    if (userId) {
      // 3a) remove from user↔socket maps
      userIdToSocketId.delete(userId);
      socketIdToUserId.delete(socket.id);

      // 3b) remove from any lobbies they were in
      for (const [roomId, members] of lobbyMembers.entries()) {
        if (members.delete(userId)) {
          io.in(roomId).emit('lobbyUpdated', Array.from(members));
          if (members.size === 0) {
            lobbyMembers.delete(roomId);
          }
        }
      }
      // Clean up game rooms
      for (const [gameId, members] of gameRoomMembers.entries()) {
        if (members.delete(userId)) {
          io.in(gameId).emit('updateGameLobby', Array.from(members));
          if (members.size === 0) {
            gameRoomMembers.delete(gameId);
          }
        }
      }
    }
  });
  // Handling the game invites
  socket.on("lobbyCreated", ({ lobbyId, invitedUserId }) => {
    // will have to made the userId with the socketId
    // then wiil use the socketId to emit the event and sent the lobbyId to the invited user
    // socket.to(lobbyId).emit("LobbyInviteReceived", invitedUserId);
    const invitedSocket = userIdToSocketId.get(invitedUserId);
    if (invitedSocket) {
      // only send if user is online
      io.to(invitedSocket).emit('LobbyInviteReceived', { lobbyId });
      io.to(socket.id).emit('selfInviteSent', { lobbyId });
    }
  });

  // Handle user joining and leaving waiting lobbies
  socket.on('joinWaitingLobby', ({ lobbyId, userId }) => {
    // 5a) join the Socket.IO room
    socket.join(lobbyId);

    // 5b) track in our map
    if (!lobbyMembers.has(lobbyId)) {
      lobbyMembers.set(lobbyId, new Set());
    }
    lobbyMembers.get(lobbyId).add(userId);

    // 5c) broadcast the full updated array
    io.in(lobbyId).emit(
      'lobbyUpdated',
      Array.from(lobbyMembers.get(lobbyId))
    );
  });

  socket.on('gameLobbyReady',({ data,lobbyId })=>{
     console.log(`[socket event 'gameLobbyReady'] Lobby ${lobbyId} is ready with data:`, data);
    if (!lobbyMembers.has(lobbyId)) return; // Lobby doesn't exist
    const members = lobbyMembers.get(lobbyId);
    if (members.size === 0) return; // No members in lobby
    // Notify all members in the lobby
    io.in(lobbyId).emit('startGame', { data });
  });

   socket.on('leaveWaitingLobby', ({ lobbyId, userId }) => {
  socket.leave(lobbyId);

  if (!lobbyMembers.has(lobbyId)) return; // nothing to remove

  const members = lobbyMembers.get(lobbyId);

  if (members.has(userId)) {
    members.delete(userId); // ✅ actually remove the userId

    if (members.size === 0) {
      lobbyMembers.delete(lobbyId); // ✅ clean up if empty
    } else {
      io.in(lobbyId).emit('lobbyUpdated', Array.from(members)); // ✅ broadcast updated list
    }
  }
});
  
  // ————— Game Room Events —————

  socket.on('join_game_room', ({ gameId ,userId}) => {
    // const userId = socket.data.
    socket.join(gameId);
    if (!gameRoomMembers.has(gameId)) gameRoomMembers.set(gameId, new Set());
    gameRoomMembers.get(gameId)!.add(userId);

    // broadcast current joined list
    io.in(gameId).emit('updateGameLobby', Array.from(gameRoomMembers.get(gameId)!));
  });

  socket.on('leave_game_room', ({ gameId ,userId}) => {
    socket.leave(gameId);
    const members = gameRoomMembers.get(gameId);
    if (members) {
      members.delete(userId);
      if (members.size === 0) {
        gameRoomMembers.delete(gameId);
      } else {
        io.in(gameId).emit('updateGameLobby', Array.from(members));
      }
    }
  });

  socket.on('make_move', ({ gameId, moveData, state, nextTurn }) => {
    // 1) Here you could validate moveData server-side and update your DB...
    // 2) Then broadcast new state & turn to all clients in room:
    console.log(`[socket event 'make_move'] Game ${gameId} move by ${socket.data.userId}:`, state);
    io.in(gameId).emit('game_state_update', { state, nextTurn });
  });

  socket.on('game_winner_announce', ({ gameId, winnerId }) => {
    // update your DB for this game: status = 'completed', record winnerId...
    io.in(gameId).emit('gamewinnerannounce', { winnerId });
    io.in(gameId).emit('exitGameonGameOver', {});
  });

  socket.on('game_over',({gameId, winnerId})=>{
    io.in(gameId).emit('exitGameonGameOver', {});
  })


});


httpServer.listen(3000, ()=>{
    console.log("The backend is running at the port 3000")
});