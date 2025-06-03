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

app.use(authenticateToken); // Middleware to authenticate token for all routes below this line

app.use('/api/v1/add-friend',AddFriendRouter);
app.use('/api/v1/search-users',UserSearchRouter);
app.use('/api/v1/friendships',DisplayFriendsRouter);
app.use('/api/v1/friend-request',FriendRequestRouter);


// socket connections
const onlineUsers = new Map<string, string>(); // socketId -> userId

io.on("connection", (socket) => {
  socket.on("userConnected", (userId: string) => {
    socket.data.userId = userId;
    console.log(`User connected: ${userId} with socket ID: ${socket.id}`);
    console.log("Online Users:", Array.from(onlineUsers.entries()));
    onlineUsers.set(socket.id, userId);

    // Notify others
    socket.broadcast.emit("userOnline", userId);

    // Send full list to the new user
    const users = [...onlineUsers.values()];
    socket.emit("onlineUsers", users);
  });

  socket.on("disconnect", () => {
    const userId = socket.data.userId;
    onlineUsers.delete(socket.id);
    console.log(`User disconnected: ${userId} with socket ID: ${socket.id}`);
    console.log("Online Users after disconnect:", Array.from(onlineUsers.entries()));

    if (userId) {
      socket.broadcast.emit("userOffline", userId);
    }
  });
});


httpServer.listen(3000, ()=>{
    console.log("The backend is running at the port 3000")
});