// this has the task to process all the game states
// updating the game played count
// giving back the reward to the winner
// also yahi mailing service ko bhi notify karga.

// this is the worker : this will pull out the task and again push in the queue 

import prisma from "../prisma/client";
import redis from "./redisClient";

async function processSubmission(submission:string) {
    const { gameId } = JSON.parse(submission).element;
    try {
        console.log(`Processing gameId ${gameId}`);
        // first fetch all the users and winner
        const rec = await prisma.gameRecord.findUnique({
            where: {
                id: gameId
            },
            include: {
                bets: true,
                winner: true
            }
        });

        const invited = rec?.invitedUserIds; // this array
        const winner = rec?.winnerId;
        const amountRefund = rec?.betAmount || 0;
        const winningAmount = Number(amountRefund || 0) * (invited?.length || 1);

        if (winner == null) { // means i have to generate the refund
            if (invited) {
                await Promise.all(
                    invited.map((userId) =>
                        prisma.wallet.update({
                            where: {
                                userId: userId,
                            },
                            data: {
                                balance: { increment: amountRefund }
                            }
                        })
                    )
                );
            }
        } else {
            if (invited) {
                await Promise.all(
                    invited
                        .filter((userId) => userId != winner)
                        .map((userId) =>
                            prisma.user.update({
                                where: {
                                    id: userId,
                                },
                                data: {
                                    gamesPlayed: { increment: 1 },
                                    gamesLost: { increment: 1 },
                                }
                            })
                        )
                );
            }

            // time to update the winner now : tricky part
            await prisma.user.update({
                where: { id: winner },
                data: {
                    gamesPlayed: { increment: 1 },
                    gamesWon: { increment: 1 }
                }
            });
            await prisma.wallet.update({
                where: { userId: winner },
                data: { balance: { increment: winningAmount } }
            });
            await prisma.gameRecord.update({
                where:{
                    id :gameId,
                },
                data:{
                    gameState:{set:"COMPLETED"} // this will help to know if all was set or not
                }
            })
        }
        // this completes the process actually.
        // this is pushing to the queue
        await redis.lpush("notify_email_service", JSON.stringify({
            gameId,
        }));


    } catch (err) {
        // faulty
        await redis.lpush("faulty_admin_task", JSON.stringify({
            gameId,
            type:"gamesRelated"
        }))

        console.error("Worker error:", err);
    }
}

async function start() {
    console.log("Worker started and connected to Redis from the gameUpdation worker");
    while (true) {
        const job = await redis.brpop("update_the_game", 0); 
        if (!job || !job[1]) {
            console.warn("Received null or invalid job from Redis.");
            continue;
        }
        // here i want the gameid; then i can fetch everything from it. 
        // const temp = JSON.parse(job[1]);
        // console.log(temp);
        // @ts-ignore

        await processSubmission(job[1]);
    }
}
start();