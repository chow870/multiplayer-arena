// server/src/workers/notify.ts
// server/src/workers/notify.ts
import prisma from "../prisma/client";
import dotenv from "dotenv";
import path from "path";

// Since .env is in src/ and notify.ts is in src/workers/
// dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { transporter } from "../utils/email";
import redis from "./redisClient";


interface recordType {
        id:string,
        email: string,
        username: string
    
};

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

         const invited :string[] | undefined = rec?.invitedUserIds; // this array
        // now 
        if(rec?.createdBy){
             invited?.push(rec?.createdBy);
        }

        console.log(invited);
        const winner = rec?.winnerId;
        let records :recordType[] = [];
        const amountRefund = rec?.betAmount || 0;
        const winningAmount = Number(amountRefund || 0) * (invited?.length || 1);
        
        if (invited) {
            records = await Promise.all(
                invited.map(async (id) => {
                    const temp = await prisma.user.findUnique({
                        where: { id: id },
                        select: {
                            email: true,
                            username: true
                        }
                    });
                    if (!temp?.email || !temp?.username) {
                        throw new Error(`User with id ${id} is missing email or username`);
                    }
                    return  { id:id, email: temp.email, username: temp.username } ;
                })
            );
        }

        if (records) {
                await Promise.all(
                    records
                        .filter((entries) => entries?.id !== winner)
                        .map(async (entries) => {
                            console.log(entries.email);
                            await transporter.sendMail({
                                 from: process.env.SMTP_USER,
                                 to: entries.email,
                                 subject: `Your Game Record update for game : ${gameId}`,
                                 html: `<p> Dear ${entries.username} , <strong> Your have lost the game and lost the bet and lost ${amountRefund}.</strong>. Dont give up, Challenge more friends. Regards from the team Gaming Sherpas.</p>`,
                               });                    
                        })
                );
                records
                .filter((entries) => entries?.id === winner)
                .map( async (entries)=>
                    await transporter.sendMail({
                                 from: process.env.SMTP_USER,
                                 to: entries.email,
                                 subject: `Your Game Record update for game : ${gameId}`,
                                 html: `<p> Dear ${entries.username} , <strong> Congratulations !!! have won the game and won the bet and earned ${winningAmount}.</strong>. Continue, challenging more friends. Regards from the team Gaming Sherpas.</p>`,
                        })   
                )
                console.log("sent the emails to every body")

            }
            
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
        console.log(job)
        if (!job || !job[1]) {
            console.warn("Received null or invalid job from Redis.");
            continue;
        }
        // here i want the gameid; then i can fetch everything from it. 
        const temp = JSON.parse(job[1]);
        console.log(temp);
        // @ts-ignore

        await processSubmission(job[1]);
    }
}
start();