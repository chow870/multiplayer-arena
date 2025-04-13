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

const app:Express = express();

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



app.listen('3000', ()=>{
    console.log("The backend is running at the port 3000")
})