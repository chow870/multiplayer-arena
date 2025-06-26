/*
  Warnings:

  - You are about to drop the `_BetToUser` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[gameLobbyId]` on the table `Bet` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `gameLobbyId` to the `Bet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Bet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "TransactionType" ADD VALUE 'Win';

-- DropForeignKey
ALTER TABLE "_BetToUser" DROP CONSTRAINT "_BetToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_BetToUser" DROP CONSTRAINT "_BetToUser_B_fkey";

-- AlterTable
ALTER TABLE "Bet" ADD COLUMN     "gameLobbyId" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "fee" DROP NOT NULL;

-- AlterTable
ALTER TABLE "GameRecord" ADD COLUMN     "betAmount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "WaitingLobby" ADD COLUMN     "betAmount" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "_BetToUser";

-- CreateIndex
CREATE UNIQUE INDEX "Bet_gameLobbyId_key" ON "Bet"("gameLobbyId");

-- AddForeignKey
ALTER TABLE "Bet" ADD CONSTRAINT "Bet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bet" ADD CONSTRAINT "Bet_gameLobbyId_fkey" FOREIGN KEY ("gameLobbyId") REFERENCES "GameRecord"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
