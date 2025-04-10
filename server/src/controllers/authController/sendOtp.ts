// server/src/controllers/authController/sendOtp.ts

import { Request, Response } from "express"
import { generateOtp, hashOtp } from "../../utils/otp"
import { transporter } from "../../utils/email"
import prisma from "../../prisma/client"

export const sendOtpController = async (req: Request, res: Response) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ message: "Email is required" })
    }

    const otpRaw = generateOtp()
    const otpHashed = await hashOtp(otpRaw)

    const expiry = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Upsert to prevent multiple entries for same email
    await prisma.verifyEmail.upsert({
      where: { email },
      update: { otpHashed, expiry, status: "PENDING" },
      create: { email, otpHashed, expiry },
    })

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: "Your OTP for Email Verification",
      html: `<p>Your OTP is <strong>${otpRaw}</strong>. It expires in 10 minutes.</p>`,
    })

    console.log(`OTP sent to ${email}`)

    return res.status(200).json({ message: "OTP sent successfully" })
  } catch (error) {
    console.error("Error sending OTP:", error)
    return res.status(500).json({ message: "Failed to send OTP email" })
  }
}
