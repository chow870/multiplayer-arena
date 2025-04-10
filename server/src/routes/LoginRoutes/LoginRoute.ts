// server/src/routes/authRoutes.ts
import { Router } from "express"
import { verifyOtpController } from "../../controllers/authController/verifyOtp"
import { loginController } from "../../controllers/LoginController/LoginController"


const LoginRouter = Router()

LoginRouter.post("/", loginController)

export default LoginRouter
