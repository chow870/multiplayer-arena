// server/src/middleware/authMiddleware.ts

import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

interface AuthRequest extends Request {
  user?: any // You can customize this to a proper user type later
}

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1] // Expecting "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: "Access token missing" })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) // You must define this in .env
    req.user = decoded // this is sending to the next function.
    next()
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" })
  }
}
