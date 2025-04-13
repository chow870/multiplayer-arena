// server/src/controllers/auth/signupController.ts
import { Request, Response } from "express"
import bcrypt from "bcrypt"
import prisma from "../../prisma/client";

export const signupController = async (req: Request, res: Response) => {
  try {
    const {  username,email, password } = req.body
    console.log("Received signup request:", req.body)

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return res.status(409).json({ message: "Email already in use" })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        username,
        passwordHash: hashedPassword,
      },
    })

    res.status(201).json({ message: "User created successfully", userId: user.id })
  } catch (error) {
    console.error("Signup error:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}
