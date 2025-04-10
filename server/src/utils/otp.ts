// server/src/utils/otp.ts

import bcrypt from "bcryptjs"

/**
 * Generates a 6-digit OTP
 */
export function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

/**
 * Hashes the OTP using bcrypt
 * @param otp - The raw OTP string
 */
export async function hashOtp(otp: string): Promise<string> {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(otp, salt)
}

/**
 * Compares a raw OTP with a hashed OTP
 * @param rawOtp - The plain OTP entered by the user
 * @param hashedOtp - The OTP stored in your DB
 */
export async function verifyOtp(rawOtp: string, hashedOtp: string): Promise<boolean> {
  return bcrypt.compare(rawOtp, hashedOtp)
}
