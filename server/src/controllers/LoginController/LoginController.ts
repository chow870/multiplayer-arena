// server/src/controllers/auth/loginController.ts
import { Request, Response } from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import prisma from "../../prisma/client";

export const loginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body
    console.log("Received login request:", req.body)
    // Find user
    const user = await prisma.user.findUnique({ where: { email } })
    // Check if user exists
    if (!user) return res.status(404).json({ message: "User not found" })
        
    // If Email not verified Check !!!
    console.log("user email verified status is ", user.emailVerified)
    if(user.emailVerified == false){
        return res.status(403).json({message:"Email Not verified."})
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.passwordHash)

    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" })

    // Generate JWT (no expiry)
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET!)

    // Return token (you’ll store it in localStorage on frontend)
    res.status(200).json({ token, user: { id: user.id, username: user.username,avatarUrl:user.avatarUrl } })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}
