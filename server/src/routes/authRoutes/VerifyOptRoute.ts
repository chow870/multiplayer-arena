// server/src/routes/authRoutes.ts
import { Router } from "express"
import { verifyOtpController } from "../../controllers/authController/verifyOtp"


const VerifyOtpRouter = Router()

VerifyOtpRouter.post("/", verifyOtpController)

export default VerifyOtpRouter
