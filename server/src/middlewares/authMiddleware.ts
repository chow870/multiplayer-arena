// server/src/middleware/authMiddleware.ts

import { Request, Response, NextFunction } from "express"
import { console } from "inspector"
import jwt from "jsonwebtoken"

interface AuthRequest extends Request {
  user?: any // You can customize this to a proper user type later
}

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  console.log("reached the middleware")
  const authHeader = req.headers["authorization"]
  console.log("the authheafder is : [middllware ]",authHeader);
  const token = authHeader && authHeader.split(" ")[1] // Expecting "Bearer <token>"

  if (!token) {
    console.log('no token found');
    return res.status(401).json({ message: "Access token missing" })
  }

  try {
    console.log("trying to decode the token [middleware]")
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) // You must define this in .env
    req.user = decoded // this is sending to the next function. // this will be used in the next function
                        // this will send me the id, user name.
    next()
  } catch (err) {
    console.log('invalid or expired')
    return res.status(403).json({ message: "Invalid or expired token" })
  }
}
