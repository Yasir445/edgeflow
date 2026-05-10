import type { Trade, DashboardStats, EquityPoint, SetupStat, SessionStat, EmotionStat } from "@/types";

export function calculateDashboardStats(trades: Trade[], initialBalance = 10000): DashboardStats {
  if (!trades.length) return emptyStats();

  const closedTrades = trades.filter((t) => t.result && t.pnl !== undefined && t.pnl !== null);
  const wins = closedTrades.filter((t) => t.result === "WIN");
  const losses = closedTrades.filter((t) => t.result === "LOSS");

  const totalPnl = closedTrades.reduce((sum, t) => sum + (t.pnl ?? 0), 0);
  const winRate = closedTrades.length > 0 ? (wins.length / closedTrades.length) * 100 : 0;

  const grossProfit = wins.reduce((s, t) => s + (t.pnl ?? 0), 0);
  const grossLoss = Math.abs(losses.reduce((s, t) => s + (t.pnl ?? 0), 0));
  const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : grossProfit > 0 ? Infinity : 0;

  const avgWin = wins.length > 0 ? grossProfit / wins.length : 0;
  const avgLoss = losses.length > 0 ? grossLoss / losses.length : 0;
  const expectancy = (winRate / 100) * avgWin - (1 - winRate / 100) * avgLoss;

  const rrValues = closedTrades.filter((t) => t.riskReward).map((t) => t.riskReward!);
  const avgRR = rrValues.length > 0 ? rrValues.reduce((a, b) => a + b, 0) / rrValues.length : 0;

  const equityCurve = buildEquityCurve(closedTrades, initialBalance);
  const maxDrawdown = calculateMaxDrawdown(equityCurve);
  const currentStreak = calculateStreak(closedTrades);
  const psychScore = calculatePsychScore(trades);
  const riskScore = calculateRiskScore(trades);
  const disciplineScore = Math.round((psychScore + riskScore) / 2);

  const setupStats = calculateSetupStats(closedTrades);
  const sessionStats = calculateSessionStats(closedTrades);
  const emotionStats = calculateEmotionStats(closedTrades);

  const bestSetup = setupStats.sort((a, b) => b.pnl - a.pnl)[0]?.setup ?? "N/A";
  const worstSetup = [...setupStats].sort((a, b) => a.pnl - b.pnl)[0]?.setup ?? "N/A";

  return {
    totalPnl,
    totalPnlPercent: (totalPnl / initialBalance) * 100,
    winRate,
    totalTrades: closedTrades.length,
    avgRR,
    profitFactor,
    maxDrawdown,
    currentStreak,
    psychScore,
    riskScore,
    disciplineScore,
    expectancy,
    bestSetup,
    worstSetup,
    equityCurve,
    recentTrades: trades.slice(0, 10),
    setupStats,
    sessionStats,
    emotionStats,
    monthlyPnl: calculateMonthlyPnl(closedTrades),
  };
}

function buildEquityCurve(trades: Trade[], initialBalance: number): EquityPoint[] {
  const sorted = [...trades].sort((a, b) => new Date(a.entryTime).getTime() - new Date(b.entryTime).getTime());
  let balance = initialBalance;
  let peak = initialBalance;
  const points: EquityPoint[] = [{ date: "Start", value: initialBalance, drawdown: 0 }];

  for (const trade of sorted) {
    balance += trade.pnl ?? 0;
    peak = Math.max(peak, balance);
    const drawdown = peak > 0 ? ((peak - balance) / peak) * 100 : 0;
    points.push({
      date: new Date(trade.entryTime).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      value: Math.round(balance * 100) / 100,
      drawdown: Math.round(drawdown * 100) / 100,
    });
  }
  return points;
}

function calculateMaxDrawdown(curve: EquityPoint[]): number {
  return Math.max(...curve.map((p) => p.drawdown), 0);
}

function calculateStreak(trades: Trade[]): number {
  if (!trades.length) return 0;
  const sorted = [...trades].sort((a, b) => new Date(b.entryTime).getTime() - new Date(a.entryTime).getTime());
  const first = sorted[0].result;
  let streak = 0;
  for (const t of sorted) {
    if (t.result === first) streak++;
    else break;
  }
  return first === "WIN" ? streak : -streak;
}

function calculatePsychScore(trades: Trade[]): number {
  if (!trades.length) return 100;
  let score = 100;
  score -= trades.filter((t) => t.isRevengeTrade).length * 8;
  score -= trades.filter((t) => t.isFOMOTrade).length * 6;
  score -= trades.filter((t) => t.emotionBefore === "ANXIOUS" || t.emotionBefore === "FEARFUL").length * 3;
  return Math.max(0, Math.min(100, Math.round(score)));
}

function calculateRiskScore(trades: Trade[]): number {
  if (!trades.length) return 100;
  let score = 100;
  const riskTrades = trades.filter((t) => t.riskPercent !== undefined);
  if (!riskTrades.length) return 80;
  const avgRisk = riskTrades.reduce((s, t) => s + (t.riskPercent ?? 0), 0) / riskTrades.length;
  if (avgRisk > 2) score -= 20;
  else if (avgRisk > 1.5) score -= 10;
  score -= riskTrades.filter((t) => (t.riskPercent ?? 0) > 2).length * 5;
  score -= trades.filter((t) => !t.stopLoss).length * 8;
  return Math.max(0, Math.min(100, Math.round(score)));
}

function calculateSetupStats(trades: Trade[]): SetupStat[] {
  const map = new Map<string, Trade[]>();
  for (const t of trades) {
    const key = t.setup ?? "Unknown";
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(t);
  }
  return Array.from(map.entries()).map(([setup, ts]) => {
    const wins = ts.filter((t) => t.result === "WIN");
    const pnl = ts.reduce((s, t) => s + (t.pnl ?? 0), 0);
    const rrVals = ts.filter((t) => t.riskReward).map((t) => t.riskReward!);
    return {
      setup, trades: ts.length, wins: wins.length,
      winRate: (wins.length / ts.length) * 100, pnl,
      avgRR: rrVals.length > 0 ? rrVals.reduce((a, b) => a + b, 0) / rrVals.length : 0,
    };
  }).sort((a, b) => b.pnl - a.pnl);
}

function calculateSessionStats(trades: Trade[]): SessionStat[] {
  const map = new Map<string, Trade[]>();
  for (const t of trades) {
    const key = t.session ?? "Unknown";
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(t);
  }
  return Array.from(map.entries()).map(([session, ts]) => {
    const wins = ts.filter((t) => t.result === "WIN");
    return { session, trades: ts.length, wins: wins.length, winRate: (wins.length / ts.length) * 100, pnl: ts.reduce((s, t) => s + (t.pnl ?? 0), 0) };
  });
}

function calculateEmotionStats(trades: Trade[]): EmotionStat[] {
  const map = new Map<string, Trade[]>();
  for (const t of trades) {
    const key = t.emotionBefore ?? "Unknown";
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(t);
  }
  return Array.from(map.entries()).map(([emotion, ts]) => {
    const wins = ts.filter((t) => t.result === "WIN");
    return { emotion, trades: ts.length, wins: wins.length, winRate: (wins.length / ts.length) * 100, avgPnl: ts.reduce((s, t) => s + (t.pnl ?? 0), 0) / ts.length };
  });
}

function calculateMonthlyPnl(trades: Trade[]) {
  const map = new Map<string, { pnl: number; trades: number }>();
  for (const t of trades) {
    const month = new Date(t.entryTime).toLocaleDateString("en-US", { month: "short", year: "2-digit" });
    const cur = map.get(month) ?? { pnl: 0, trades: 0 };
    map.set(month, { pnl: cur.pnl + (t.pnl ?? 0), trades: cur.trades + 1 });
  }
  return Array.from(map.entries()).map(([month, v]) => ({ month, ...v }));
}

export function detectAIInsights(trades: Trade[]) {
  const insights = [];
  const recent = trades.slice(0, 20);

  const revengeCount = recent.filter((t) => t.isRevengeTrade).length;
  if (revengeCount >= 2) {
    insights.push({ type: "warning" as const, icon: "⚡", title: "Revenge Trading Detected", description: `${revengeCount} revenge trades detected recently. Consider a cooling-off rule after losses.` });
  }

  const fomoCount = recent.filter((t) => t.isFOMOTrade).length;
  if (fomoCount >= 2) {
    insights.push({ type: "warning" as const, icon: "🎯", title: "FOMO Pattern Detected", description: `${fomoCount} FOMO entries identified. Pre-session checklists reduce impulsive entries by 60%.` });
  }

  const setupStats = calculateSetupStats(trades.filter((t) => t.result));
  const best = setupStats[0];
  if (best && best.winRate >= 65 && best.trades >= 3) {
    insights.push({ type: "success" as const, icon: "🏆", title: `Best Setup: ${best.setup}`, description: `${best.winRate.toFixed(0)}% win rate on ${best.setup}. Consider increasing size on A+ setups.` });
  }

  const overRiskTrades = recent.filter((t) => (t.riskPercent ?? 0) > 2);
  if (overRiskTrades.length >= 2) {
    insights.push({ type: "warning" as const, icon: "⚠️", title: "Risk Inconsistency", description: `${overRiskTrades.length} trades exceeded your 2% risk rule. Use a position size calculator.` });
  }

  return insights;
}

function emptyStats(): DashboardStats {
  return {
    totalPnl: 0, totalPnlPercent: 0, winRate: 0, totalTrades: 0,
    avgRR: 0, profitFactor: 0, maxDrawdown: 0, currentStreak: 0,
    psychScore: 100, riskScore: 100, disciplineScore: 100, expectancy: 0,
    bestSetup: "N/A", worstSetup: "N/A",
    equityCurve: [], recentTrades: [], setupStats: [],
    sessionStats: [], emotionStats: [], monthlyPnl: [],
  };
    }
