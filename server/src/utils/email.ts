// server/src/utils/email.ts

import nodemailer, { Transporter } from "nodemailer"

export const transporter: Transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})
