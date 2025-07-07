// server/src/utils/email.ts
import dotenv from "dotenv";
dotenv.config();
import nodemailer, { Transporter } from "nodemailer";
// email.ts

// if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
//   throw new Error("SMTP credentials are missing");
// }

export const transporter: Transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "adi228.ch@gmail.com",
    pass: "lkju jqba sjdo nzda",
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("Error connecting to SMTP server:", error);
  } else {
    console.log("SMTP server is ready to send emails");
  }
});
