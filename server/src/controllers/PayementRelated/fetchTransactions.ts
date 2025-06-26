import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import prisma from "../../prisma/client";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

export const getUserTransactions = async (req: Request, res: Response) => {
  try {
    // const userId = req.user.id; // Provided by your auth middleware
    const userId = (req as any).user.id
    const transactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            username: true,
            avatarUrl: true,
          },
        },
      },
    });
    console.log("getUserTransactions : ",transactions);
    return res.status(200).json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
