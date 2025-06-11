/*
  Warnings:

  - The values [DEPOSIT,WITHDRAW,FEE,REWARD,BET] on the enum `TransactionType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `reference` on the `Transaction` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TransactionType_new" AS ENUM ('BuyPremium', 'Bet', 'Topup');
ALTER TABLE "Transaction" ALTER COLUMN "type" TYPE "TransactionType_new" USING ("type"::text::"TransactionType_new");
ALTER TYPE "TransactionType" RENAME TO "TransactionType_old";
ALTER TYPE "TransactionType_new" RENAME TO "TransactionType";
DROP TYPE "TransactionType_old";
COMMIT;

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "reference",
ADD COLUMN     "orderId" TEXT,
ADD COLUMN     "referenceId" TEXT;

-- AlterTable
ALTER TABLE "Wallet" ALTER COLUMN "currency" DROP NOT NULL;
