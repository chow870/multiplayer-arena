import { Request, Response } from "express";
import prisma from "../../prisma/client";


export const getWalletBalance = async (req: Request, res: Response) => {
    console.log("here is the getWalletBalance ")
  try {
    const userId = (req as any).user.id;
    console.log("here is the getWalletBalance ",userId);

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized access" });
    }

    const wallet = await prisma.wallet.findUnique({
      where: { userId },
      select: {
        id: true,
        balance: true,
        currency: true,
        updatedAt: true,
      },
    });

    if (!wallet) {
      let wallet = await prisma.wallet.create({
        data: {
          userId,
          balance: 0,
        },
      });
       res.status(200).json({
        success: true,
        wallet,
    });

    }

    res.status(200).json({
      success: true,
      wallet,
    });
  } catch (error) {
    console.error("Error fetching wallet balance:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
