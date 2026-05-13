export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateDashboardStats } from "@/lib/analytics";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const sub = await prisma.subscription.findUnique({ where: { userId: session.user.id } });
    if (sub?.plan === "FREE") return NextResponse.json({ error: "AI Coach requires Pro plan." }, { status: 403 });
    const { messages } = await req.json();
    if (!messages || !Array.isArray(messages)) return NextResponse.json({ error: "Invalid messages" }, { status: 400 });
    const trades = await prisma.trade.findMany({ where: { userId: session.user.id }, orderBy: { entryTime: "desc" }, take: 50 });
    const stats = calculateDashboardStats(trades as any);
    const systemPrompt = `You are EdgeFlow AI Coach — a sharp, data-driven trading psychology and performance coach.
Trader data: Win Rate: ${stats.winRate.toFixed(1)}%, Net P&L: $${stats.totalPnl.toFixed(0)}, Avg R:R: ${stats.avgRR.toFixed(2)}, Psychology Score: ${stats.psychScore}/100, Best Setup: ${stats.bestSetup}.
Be direct, concise, data-backed. Max 3-5 sentences unless detailed breakdown requested.`;
    const Anthropic = (await import("@anthropic-ai/sdk")).default;
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const response = await client.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 1000,
      system: systemPrompt,
      messages: messages.map((m: { role: string; content: string }) => ({ role: m.role as "user" | "assistant", content: m.content })),
    });
    const reply = response.content.map((c) => (c.type === "text" ? c.text : "")).join("");
    return NextResponse.json({ data: { reply } });
  } catch (error) {
    console.error("AI Chat error:", error);
    return NextResponse.json({ error: "AI service unavailable" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { tradeId } = await req.json();
    const trade = await prisma.trade.findFirst({ where: { id: tradeId, userId: session.user.id } });
    if (!trade) return NextResponse.json({ error: "Trade not found" }, { status: 404 });
    const prompt = `Analyze this trade: ${trade.pair} ${trade.direction}, Setup: ${trade.setup ?? "N/A"}, P&L: $${trade.pnl ?? "N/A"}, Result: ${trade.result ?? "Open"}, Emotion Before: ${trade.emotionBefore ?? "N/A"}.
Respond ONLY with valid JSON: {"qualityScore":<0-100>,"strengths":["s1"],"weaknesses":["w1"],"suggestions":["sg1"],"psychFlags":{"revenge":false,"fomo":false,"emotional":false,"riskIssue":false},"summary":"2-3 sentences"}`;
    const Anthropic = (await import("@anthropic-ai/sdk")).default;
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const response = await client.messages.create({ model: "claude-opus-4-5", max_tokens: 1000, messages: [{ role: "user", content: prompt }] });
    const text = response.content.map((c) => (c.type === "text" ? c.text : "")).join("");
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON");
    const feedback = JSON.parse(jsonMatch[0]);
    const saved = await prisma.aIFeedback.upsert({
      where: { tradeId },
      create: { tradeId, ...feedback },
      update: { ...feedback },
    });
    await prisma.trade.update({ where: { id: tradeId }, data: { qualityScore: feedback.qualityScore, isRevengeAtrade: feedback.psychFlags.revenge, isFOMOTrade: feedback.psychFlags.fomo } });
    return NextResponse.json({ data: saved });
  } catch (error) {
    console.error("AI Feedback error:", error);
    return NextResponse.json({ error: "Failed to generate feedback" }, { status: 500 });
  }
}
