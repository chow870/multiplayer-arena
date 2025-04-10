// server/src/routes/authRoutes.ts
import { Router } from "express"
import { verifyOtpController } from "../../controllers/authController/verifyOtp"
import { loginController } from "../../controllers/LoginController/LoginController"


const SignupRouter = Router()

SignupRouter.post("/", loginController)

export default SignupRouter
