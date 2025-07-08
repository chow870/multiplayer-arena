import '../../env'
import { Request, Response } from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import prisma from "../../prisma/client";
enum TransactionType {
  BuyPremium,
  Bet,
  Topup
}

// will have to fix it later on
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export const getKeydetials = (req: Request, res: Response) => {
  return res.status(200).json({ key: process.env.RAZORPAY_KEY_ID });
};

export const createCheckoutOrder = async (req: Request, res: Response) => {
  try {
    console.log("createCheckoutOrder is hit");
    const { amount, type } = req.body;
    const userId = (req as any).user.id;

    if (!amount || !type || !userId) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId }
    })
    if(type === "BuyPremium" && user?.isPremium === true){
      return res.status(400).json({ error: "Already a premium user" });
    }

    // Create Razorpay order
    const order = await razorpayInstance.orders.create({
      amount: amount * 100, // amount in paise
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
      notes: {
        userId,
        type,
      },
    });

    // Create pending transaction in DB
    const transaction = await prisma.transaction.create({
      data: {
        userId,
        orderId: order.id,
        amount,
        status: "PENDING",
        type,
        referenceId :order.receipt
      },
    });

    res.status(200).json({
      success: true,
      order,
    });
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const paymentVerification = async (req: Request, res: Response) => {
  try {
    console.log("paymentVerification is hit");
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid payment data" });
    }

    // Step 1: Verify Razorpay Signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(sign)
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    // Step 2: Fetch Transaction
    const transaction = await prisma.transaction.findFirst({
      where: { orderId: razorpay_order_id },
    });

    if (!transaction) {
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }

    // Step 3: Update Transaction to ACCEPTED & Set Reference ID
    await prisma.transaction.update({
      where: { id: transaction.id },
      data: {
        status: "ACCEPTED",
        referenceId: razorpay_payment_id,
      },
    });

    // Step 4: Fetch User Wallet
    const wallet = await prisma.wallet.findUnique({
      where: { userId: transaction.userId },
    });

    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: "User wallet not found",
      });
    }

    // Step 5: Deduct Amount from Wallet
    if(transaction.type != 'Topup'){
      const updatedBalance = wallet.balance - transaction.amount;
        if (updatedBalance < 0) {
          return res.status(400).json({
            success: false,
            message: "Insufficient wallet balance (post-check error).",
          });
        }
        await prisma.wallet.update({
        where: { userId: transaction.userId },
        data: {
          balance: updatedBalance,
        },
      });
    }
    // in the topup we will increase the amount in the ballance na !!!
    if(transaction.type === 'Topup'){
      const updatedBalance = wallet.balance + transaction.amount;
      await prisma.wallet.update({
        where: { userId: transaction.userId },
        data: {
          balance: updatedBalance,
        },
      });
    }
    
    // Step 6: If BuyPremium, update user
    if (transaction.type === "BuyPremium") {
      await prisma.user.update({
        where: { id: transaction.userId },
        data: {
          isPremium: true,
          premiumSince: new Date(),
        },
      });
    }

    // Step 7: Redirect to success page
    res.redirect(`http://localhost:5173/paymentsuccess?reference=${razorpay_payment_id}`);

  } catch (err) {
    console.error("Payment verification error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

