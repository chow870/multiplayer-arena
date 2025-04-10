// server/src/controllers/authController/verifyOtp.ts

import { Request, Response } from "express"
import { verifyOtp } from "../../utils/otp"
import prisma from "../../prisma/client"

export const verifyOtpController = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const email : string = body.email;
    const otp : number = body.otp;


    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" })
    }

    const record = await prisma.verifyEmail.findUnique({
      where: { email },
    })

    if (!record) {
      return res.status(404).json({ message: "Verification record not found" })
    }

    if (record.expiry < new Date()) {
      return res.status(410).json({ message: "OTP has expired" })
    }

    const isOtpValid = await verifyOtp(otp.toString(), record.otpHashed)

    if (!isOtpValid) {
      return res.status(401).json({ message: "Invalid OTP" })
    }

    // Optional: update the status or clean up the record
    await prisma.verifyEmail.update({
      where: { email },
      data: {
        status: "SUCCESS",
        resolvedAt: new Date(),
      },
    })

    return res.status(200).json({ message: "Email verified successfully" })

  } catch (error) {
    console.error("OTP verification error:", error)
    return res.status(500).json({ message: "Internal server error" })
  }
}
