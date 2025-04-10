// server/src/routes/authRoutes.ts
import { Router } from "express"
import { sendOtpController } from "../../controllers/authController/sendOtp"


const sendOtpRouter : Router = Router()

sendOtpRouter.post("/", sendOtpController)

export default sendOtpRouter
