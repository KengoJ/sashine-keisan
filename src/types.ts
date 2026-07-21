export type TradeDirection = "buy" | "sell";

export interface TradeInputs {
  direction: TradeDirection;
  entryPrice: number | "";
  riskRewardRatio: number | "";
  allowableLossPercent: number | "";
  
  // Recommended
  supportLine: number | "";
  resistanceLine: number | "";
  atr: number | "";
  recentHigh: number | "";
  recentLow: number | "";
  
  // Money management
  capital: number | "";
  allowableLossAmount: number | "";
  shares: number | "";
}

export interface CalculationResult {
  title: string;
  description: string;
  stopLoss: number;
  takeProfit: number;
  expectedProfitPerShare: number;
  expectedLossPerShare: number;
  actualRiskReward: number;
  profitPercent: number;
  lossPercent: number;
  recommendedShares: number;
  maxLossAmount: number;
  maxProfitAmount: number;
}
