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
        // if (invited) {
        //         await Promise.all(
        //             invited
        //                 .filter((userId) => userId != winner)
        //                 .map((userId) =>
        //                    // whe ww put the smtp mail portion
                    
        //                 )
        //         );
        //     }
            
    } catch (err) {
        // faulty
        await redis.lpush("faulty_admin_task", JSON.stringify({
            gameId,
            type:"emailRelated"
        }))

        console.error("Worker error:", err);
    }
}

async function start() {
    console.log("Worker started and connected to Redis from the emailService worker");
    while (true) {
        const job = await redis.brpop("notify_email_service", 0); 
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