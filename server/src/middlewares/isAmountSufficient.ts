import { Request, Response, NextFunction } from "express";
import prisma from "../prisma/client";

interface AuthRequest extends Request {
  user?: any // You can customize this to a proper user type later
}

export const isAmountSufficient = async (req: AuthRequest, res: Response, next: NextFunction) => {
   const userId = (req as any).user.id;
  const amount = req.body.amount;

  if (!userId || typeof amount !== "number") {
    return res.status(400).json({ success: false, message: "Missing userId or amount" });
  }

  try {
    let wallet = await prisma.wallet.findUnique({
      where: { userId },
    });

    // Wallet doesn't exist? Create one with 0 balance
    if (!wallet) {
      wallet = await prisma.wallet.create({
        data: {
          userId,
          balance: 0,
        },
      });
      return res.status(402).json({
        success: false,
        message: "Insufficient funds. Wallet created with 0 balance.",
        walletCreated: true,
      });
      
    }

    // Check balance
    if (wallet.balance < amount) {
      return res.status(402).json({
        success: false,
        message: "Insufficient funds.",
        currentBalance: wallet.balance,
      });
    }

 
    next();
  } catch (err) {
    console.error("Error checking wallet amount:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
