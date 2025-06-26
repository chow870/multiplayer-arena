/*
  Warnings:

  - A unique constraint covering the columns `[userId,gameLobbyId]` on the table `Bet` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Bet_userId_gameLobbyId_key" ON "Bet"("userId", "gameLobbyId");
