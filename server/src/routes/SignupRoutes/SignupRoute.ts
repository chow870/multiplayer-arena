// server/src/routes/authRoutes.ts
import { Router } from "express"
import { verifyOtpController } from "../../controllers/authController/verifyOtp"
import { loginController } from "../../controllers/LoginController/LoginController"
import { signupController } from "../../controllers/SignupController/signupController"


const SignupRouter = Router()

SignupRouter.post("/", signupController)

export default SignupRouter
