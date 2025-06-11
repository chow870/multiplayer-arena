import { Request, Response, NextFunction } from "express";
import prisma from "../prisma/client";

interface AuthRequest extends Request {
  user?: any // You can customize this to a proper user type late
}

export const isPremiumMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const userId = (req as any).user.id;

  if (!userId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { isPremium: true },
    });

    if (!user || !user.isPremium) {
      return res.status(403).json({ success: false, message: "Premium access required" });
    }

    // ✅ Forward with userId available
    next();
  } catch (error) {
    console.error("Error in premium middleware:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
