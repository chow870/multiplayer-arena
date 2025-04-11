import express,{Express,Request,Response} from 'express'
import cors from 'cors';
import LoginRouter from './routes/LoginRoutes/LoginRoute';
import SignupRouter from './routes/SignupRoutes/SignupRoute';
import sendOtpRouter from './routes/authRoutes/SendOtpRoute';
import VerifyOtpRouter from './routes/authRoutes/VerifyOptRoute';

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

// later here i will add the middleware for the authentication and authorization


app.listen('3000', ()=>{
    console.log("The backend is runing at the port 3000")
})