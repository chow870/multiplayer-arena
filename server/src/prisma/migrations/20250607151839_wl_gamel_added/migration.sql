-- CreateEnum
CREATE TYPE "LobbyStatus" AS ENUM ('WAITING', 'ACTIVE', 'COMPLETED', 'EXPIRED', 'ABORTED');

-- CreateTable
CREATE TABLE "WaitingLobby" (
    "id" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "invitedUserIds" TEXT[],
    "status" "LobbyStatus" NOT NULL DEFAULT 'WAITING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WaitingLobby_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameRecord" (
    "id" TEXT NOT NULL,
    "gameType" TEXT NOT NULL,
    "winnerId" TEXT,
    "playerId" TEXT NOT NULL,
    "invitedUserIds" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "currentState" JSONB NOT NULL,
    "gameState" "LobbyStatus" NOT NULL DEFAULT 'WAITING',

    CONSTRAINT "GameRecord_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WaitingLobby" ADD CONSTRAINT "WaitingLobby_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameRecord" ADD CONSTRAINT "GameRecord_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameRecord" ADD CONSTRAINT "GameRecord_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
