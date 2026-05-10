export type Direction = "LONG" | "SHORT";
export type TradeResult = "WIN" | "LOSS" | "BREAKEVEN" | "PARTIAL";
export type TradingSession = "ASIAN" | "LONDON" | "NEW_YORK" | "OVERLAP";
export type EmotionType =
  | "CALM" | "FOCUSED" | "ANXIOUS" | "FEARFUL" | "GREEDY"
  | "FOMO" | "FRUSTRATED" | "CONFIDENT" | "NEUTRAL" | "EXCITED"
  | "BORED" | "TIRED";
export type SubscriptionPlan = "FREE" | "PRO" | "ELITE";
export type AccountType = "LIVE" | "DEMO" | "PROP";

export interface Trade {
  id: string;
  userId: string;
  accountId?: string;
  pair: string;
  direction: Direction;
  setup?: string;
  session?: TradingSession;
  timeframe?: string;
  entryPrice: number;
  stopLoss?: number;
  takeProfit?: number;
  exitPrice?: number;
  positionSize?: number;
  riskPercent?: number;
  riskReward?: number;
  pnl?: number;
  pnlPercent?: number;
  fees?: number;
  result?: TradeResult;
  duration?: number;
  entryTime: Date | string;
  exitTime?: Date | string;
  emotionBefore?: EmotionType;
  emotionAfter?: EmotionType;
  emotionNotes?: string;
  confidenceLevel?: number;
  executionRating?: number;
  marketCondition?: string;
  notes?: string;
  mistakeChecklist?: string[];
  confluences?: string[];
  qualityScore?: number;
  isRevengeTrade?: boolean;
  isFOMOTrade?: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  screenshots?: Screenshot[];
  tags?: TradeTag[];
  aiFeedback?: AIFeedback;
}

export interface Screenshot {
  id: string;
  tradeId: string;
  url: string;
  publicId: string;
  type?: string;
  createdAt: Date | string;
}

export interface AIFeedback {
  id: string;
  tradeId: string;
  qualityScore: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  psychFlags: {
    revenge: boolean;
    fomo: boolean;
    emotional: boolean;
    riskIssue: boolean;
  };
  summary: string;
  createdAt: Date | string;
}

export interface TradeTag {
  tradeId: string;
  tagId: string;
  tag: Tag;
}

export interface Tag {
  id: string;
  userId: string;
  name: string;
  color?: string;
  createdAt: Date | string;
}

export interface DashboardStats {
  totalPnl: number;
  totalPnlPercent: number;
  winRate: number;
  totalTrades: number;
  avgRR: number;
  profitFactor: number;
  maxDrawdown: number;
  currentStreak: number;
  psychScore: number;
  riskScore: number;
  disciplineScore: number;
  expectancy: number;
  bestSetup: string;
  worstSetup: string;
  equityCurve: EquityPoint[];
  recentTrades: Trade[];
  setupStats: SetupStat[];
  sessionStats: SessionStat[];
  emotionStats: EmotionStat[];
  monthlyPnl: MonthlyPnl[];
}

export interface EquityPoint {
  date: string;
  value: number;
  drawdown: number;
}

export interface SetupStat {
  setup: string;
  trades: number;
  wins: number;
  winRate: number;
  pnl: number;
  avgRR: number;
}

export interface SessionStat {
  session: string;
  trades: number;
  wins: number;
  winRate: number;
  pnl: number;
}

export interface EmotionStat {
  emotion: string;
  trades: number;
  wins: number;
  winRate: number;
  avgPnl: number;
}

export interface MonthlyPnl {
  month: string;
  pnl: number;
  trades: number;
}

export interface AIInsight {
  type: "warning" | "success" | "info" | "error";
  icon: string;
  title: string;
  description: string;
}

export interface TradingAccount {
  id: string;
  userId: string;
  name: string;
  broker?: string;
  type: AccountType;
  currency: string;
  balance: number;
  isDefault: boolean;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}
