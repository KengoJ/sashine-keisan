import { TradeInputs, CalculationResult } from "../types";

export function calculateStrategy(
  inputs: TradeInputs,
  mode: "risk_reward" | "support_resistance" | "atr" | "high_low"
): CalculationResult | null {
  const {
    direction,
    entryPrice,
    riskRewardRatio: rr,
    allowableLossPercent: lp,
    supportLine,
    resistanceLine,
    atr,
    recentHigh,
    recentLow,
    capital,
    allowableLossAmount: manualLossAmount,
  } = inputs;

  if (entryPrice === "" || entryPrice <= 0) return null;

  const E = Number(entryPrice);
  const RR = rr !== "" ? Number(rr) : 2.0;
  const LP = lp !== "" ? Number(lp) : 2.0;

  // Calculate default Allowable Loss Amount
  let allowableLossAmount = 0;
  if (manualLossAmount !== "" && manualLossAmount > 0) {
    allowableLossAmount = Number(manualLossAmount);
  } else if (capital !== "" && capital > 0) {
    allowableLossAmount = (Number(capital) * LP) / 100;
  } else {
    // If no capital or manual amount, default to 10,000 for relative display
    allowableLossAmount = 10000;
  }

  let stopLoss = 0;
  let takeProfit = 0;
  let title = "";
  let description = "";

  switch (mode) {
    case "risk_reward":
      title = "許容損失率・リスクリワード比 基準";
      description = `エントリー価格から許容損失率（${LP}%）の位置に逆指値、リスクリワード比（1:${RR}）の位置に指値を設定します。`;
      if (direction === "buy") {
        stopLoss = E * (1 - LP / 100);
        takeProfit = E + (E - stopLoss) * RR;
      } else {
        stopLoss = E * (1 + LP / 100);
        takeProfit = E - (stopLoss - E) * RR;
      }
      break;

    case "support_resistance":
      if (direction === "buy") {
        if (supportLine === "") return null;
        title = "サポート・レジスタンス 基準 (買い)";
        description = "サポートライン付近に損切り（逆指値）、レジスタンスライン付近に利確（指値）を設定します。";
        stopLoss = Number(supportLine);
        takeProfit = resistanceLine !== "" ? Number(resistanceLine) : E + (E - stopLoss) * RR;
      } else {
        if (resistanceLine === "") return null;
        title = "サポート・レジスタンス 基準 (売り)";
        description = "レジスタンスライン付近に損切り（逆指値）、サポートライン付近に利確（指値）を設定します。";
        stopLoss = Number(resistanceLine);
        takeProfit = supportLine !== "" ? Number(supportLine) : E - (stopLoss - E) * RR;
      }
      break;

    case "atr":
      if (atr === "" || atr <= 0) return null;
      const ATR = Number(atr);
      title = "ATRボラティリティ 基準";
      description = `平均値幅（ATR: ${ATR}）の2.0倍のノイズ許容幅を考慮して、逆指値を設定します。`;
      if (direction === "buy") {
        stopLoss = E - 2.0 * ATR;
        takeProfit = E + (E - stopLoss) * RR;
      } else {
        stopLoss = E + 2.0 * ATR;
        takeProfit = E - (stopLoss - E) * RR;
      }
      break;

    case "high_low":
      if (direction === "buy") {
        if (recentLow === "") return null;
        title = "直近高値・安値 基準 (買い)";
        description = "直近安値を損切り（逆指値）、直近高値を目標利確（指値）の目安にします。";
        stopLoss = Number(recentLow);
        takeProfit = recentHigh !== "" ? Number(recentHigh) : E + (E - stopLoss) * RR;
      } else {
        if (recentHigh === "") return null;
        title = "直近高値・安値 基準 (売り)";
        description = "直近高値を損切り（逆指値）、直近安値を目標利確（指値）の目安にします。";
        stopLoss = Number(recentHigh);
        takeProfit = recentLow !== "" ? Number(recentLow) : E - (stopLoss - E) * RR;
      }
      break;
  }

  // Round values to 2 decimal places to handle micro-caps or forex, but format nicely
  stopLoss = Math.round(stopLoss * 100) / 100;
  takeProfit = Math.round(takeProfit * 100) / 100;

  const expectedProfitPerShare = Math.abs(takeProfit - E);
  const expectedLossPerShare = Math.abs(E - stopLoss);

  let actualRiskReward = 0;
  if (expectedLossPerShare > 0) {
    actualRiskReward = Math.round((expectedProfitPerShare / expectedLossPerShare) * 100) / 100;
  }

  const profitPercent = Math.round((expectedProfitPerShare / E) * 10000) / 100;
  const lossPercent = Math.round((expectedLossPerShare / E) * 10000) / 100;

  // Calculate recommended shares (round down to prevent exceeding allowable loss, adjusted to 100 shares unit)
  let recommendedShares = 0;
  if (expectedLossPerShare > 0) {
    recommendedShares = Math.floor(allowableLossAmount / expectedLossPerShare / 100) * 100;
  }

  const maxLossAmount = Math.round(recommendedShares * expectedLossPerShare * 100) / 100;
  const maxProfitAmount = Math.round(recommendedShares * expectedProfitPerShare * 100) / 100;

  return {
    title,
    description,
    stopLoss,
    takeProfit,
    expectedProfitPerShare,
    expectedLossPerShare,
    actualRiskReward,
    profitPercent,
    lossPercent,
    recommendedShares,
    maxLossAmount,
    maxProfitAmount,
  };
}
