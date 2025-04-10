-- CreateEnum
CREATE TYPE "EmailVerificationType" AS ENUM ('PENDING', 'SUCCESS', 'FAILED');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "emailVerified" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "VerifyEmail" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "otpHashed" TEXT NOT NULL,
    "expiry" TIMESTAMP(3) NOT NULL,
    "status" "EmailVerificationType" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),

    CONSTRAINT "VerifyEmail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "VerifyEmail_email_status_idx" ON "VerifyEmail"("email", "status");
