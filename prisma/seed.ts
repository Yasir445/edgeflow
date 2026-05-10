import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const PAIRS = ["EUR/USD","GBP/USD","USD/JPY","GBP/JPY","XAU/USD","NAS100","BTC/USD","ETH/USD","EUR/GBP","AUD/USD"];
const SETUPS = ["Break & Retest","Order Block","FVG","Supply Zone","Demand Zone","Liquidity Sweep","CHOCH","ICT Breaker"];
const SESSIONS: ("ASIAN"|"LONDON"|"NEW_YORK"|"OVERLAP")[] = ["ASIAN","LONDON","NEW_YORK","OVERLAP"];
const EMOTIONS: ("CALM"|"FOCUSED"|"ANXIOUS"|"FOMO"|"FRUSTRATED"|"CONFIDENT"|"NEUTRAL")[] = ["CALM","FOCUSED","ANXIOUS","FOMO","FRUSTRATED","CONFIDENT","NEUTRAL"];
const TIMEFRAMES = ["1m","5m","15m","30m","1h","4h","Daily"];

function rand(a: number, b: number) { return Math.random() * (b - a) + a; }
function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

async function main() {
  console.log("Seeding database...");

  const passwordHash = await bcrypt.hash("password123", 12);
  const user = await prisma.user.upsert({
    where: { email: "demo@edgeflow.app" },
    update: {},
    create: {
      email: "demo@edgeflow.app",
      name: "Demo Trader",
      passwordHash,
      subscription: {
        create: { plan: "PRO", status: "ACTIVE" },
      },
      accounts_tp: {
        create: {
          name: "Main Account",
          broker: "IC Markets",
          type: "LIVE",
          currency: "USD",
          balance: 10000,
          isDefault: true,
        },
      },
    },
  });

  const account = await prisma.tradingAccount.findFirst({
    where: { userId: user.id, isDefault: true },
  });

  const trades = [];
  const now = new Date();

  for (let i = 0; i < 60; i++) {
    const daysAgo = Math.floor(rand(1, 90));
    const entryTime = new Date(now);
    entryTime.setDate(now.getDate() - daysAgo);
    entryTime.setHours(Math.floor(rand(6, 20)), Math.floor(rand(0, 59)));

    const direction = Math.random() > 0.5 ? "LONG" : "SHORT";
    const pair = pick(PAIRS);
    const setup = pick(SETUPS);
    const session = pick(SESSIONS);
    const emotionBefore = pick(EMOTIONS);
    const riskPercent = parseFloat(rand(0.5, 2.5).toFixed(1));
    const riskReward = parseFloat(rand(1.5, 3.5).toFixed(1));

    let winProb = 0.6;
    if (setup === "Order Block" || setup === "Break & Retest") winProb += 0.1;
    if (emotionBefore === "CALM" || emotionBefore === "FOCUSED") winProb += 0.1;
    if (emotionBefore === "FOMO" || emotionBefore === "ANXIOUS") winProb -= 0.2;

    const isWin = Math.random() < winProb;
    const result: "WIN"|"LOSS" = isWin ? "WIN" : "LOSS";
    const basePnl = riskPercent * 100 * (isWin ? riskReward : -1);
    const pnl = parseFloat(basePnl.toFixed(2));

    const exitTime = new Date(entryTime);
    exitTime.setMinutes(exitTime.getMinutes() + Math.floor(rand(20, 300)));

    const isRevenge = emotionBefore === "FRUSTRATED" && Math.random() > 0.5;
    const isFOMO = emotionBefore === "FOMO";

    trades.push({
      userId: user.id,
      accountId: account?.id,
      pair,
      direction: direction as "LONG"|"SHORT",
      setup,
      session,
      timeframe: pick(TIMEFRAMES),
      entryPrice: parseFloat(rand(1.0, 2.0).toFixed(4)),
      stopLoss: parseFloat(rand(0.9, 1.1).toFixed(4)),
      takeProfit: parseFloat(rand(1.1, 1.3).toFixed(4)),
      exitPrice: parseFloat(rand(1.0, 1.2).toFixed(4)),
      positionSize: parseFloat(rand(0.1, 2.0).toFixed(2)),
      riskPercent,
      riskReward,
      pnl,
      result,
      duration: Math.floor(rand(15, 300)),
      entryTime,
      exitTime,
      emotionBefore,
      emotionAfter: isWin ? pick(["CALM","CONFIDENT","NEUTRAL","FOCUSED"]) : pick(["FRUSTRATED","ANXIOUS","NEUTRAL"]),
      confidenceLevel: Math.floor(rand(5, 10)),
      executionRating: Math.floor(rand(4, 10)),
      notes: isWin ? `Clean ${setup} setup. Waited for confirmation.` : `Missed key confluence.`,
      isRevengeAtrade: isRevenge,
      isFOMOTrade: isFOMO,
      qualityScore: isWin ? Math.floor(rand(70, 98)) : Math.floor(rand(20, 75)),
    });
  }

  await prisma.trade.createMany({ data: trades });
  console.log(`Created ${trades.length} trades`);

  console.log("\nSeed complete!");
  console.log("Login: demo@edgeflow.app / password123");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
