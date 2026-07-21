import { FC, useMemo } from "react";
import { TradeInputs, CalculationResult } from "../types";
import { calculateStrategy } from "../utils/calculations";
import { Check, Copy, HelpCircle, ArrowUpRight, ArrowDownRight, Award, Layers } from "lucide-react";

interface CalculatedResultsProps {
  inputs: TradeInputs;
  activeMode: "risk_reward" | "support_resistance" | "atr" | "high_low";
  setActiveMode: (mode: "risk_reward" | "support_resistance" | "atr" | "high_low") => void;
  onActiveResultChange: (result: CalculationResult) => void;
}

export const CalculatedResults: FC<CalculatedResultsProps> = ({
  inputs,
  activeMode,
  setActiveMode,
  onActiveResultChange,
}) => {
  // Compute results for all possible strategies
  const strategies = useMemo(() => {
    const modes: ("risk_reward" | "support_resistance" | "atr" | "high_low")[] = [
      "risk_reward",
      "support_resistance",
      "atr",
      "high_low",
    ];

    const list: { mode: typeof modes[number]; result: CalculationResult }[] = [];

    modes.forEach((m) => {
      const res = calculateStrategy(inputs, m);
      if (res) {
        list.push({ mode: m, result: res });
      }
    });

    return list;
  }, [inputs]);

  // Find the result for the currently selected active mode
  const activeResult = useMemo(() => {
    const found = strategies.find((s) => s.mode === activeMode);
    
    // Fallback if the selected mode is not available (e.g. support line was cleared)
    if (!found && strategies.length > 0) {
      // Auto-fallback to the first available strategy (usually risk_reward)
      const first = strategies[0];
      setTimeout(() => setActiveMode(first.mode), 0);
      return first.result;
    }
    
    const result = found ? found.result : null;
    if (result) {
      // Notify parent component about active result changes (so AI analysis can use it)
      setTimeout(() => onActiveResultChange(result), 0);
    }
    return result;
  }, [strategies, activeMode, setActiveMode, onActiveResultChange]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Simple native prompt is fine, but visually showing copied is better.
  };

  if (!activeResult) {
    return (
      <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-8 text-center text-slate-500">
        <HelpCircle className="h-10 w-10 text-slate-300 mx-auto mb-2" />
        <p className="font-semibold text-sm">エントリー価格を入力してください</p>
        <p className="text-xs text-slate-400 mt-1">
          必須項目を入力すると、推奨価格や購入数量のシミュレーションが表示されます。
        </p>
      </div>
    );
  }

  // Calculate visual bar percentage widths for Risk vs Reward
  const riskWeight = activeResult.expectedLossPerShare;
  const rewardWeight = activeResult.expectedProfitPerShare;
  const totalWeight = riskWeight + rewardWeight;
  const riskPercent = totalWeight > 0 ? (riskWeight / totalWeight) * 100 : 50;
  const rewardPercent = totalWeight > 0 ? (rewardWeight / totalWeight) * 100 : 50;

  const E = Number(inputs.entryPrice);

  return (
    <div className="flex flex-col gap-6" id="trading-calculation-results">
      {/* 1. アクティブなプランの詳細サマリー */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col">
        <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-3">
          <div className="space-y-1">
            <span className="bg-indigo-50 text-indigo-600 border border-indigo-100 text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider">
              {activeResult.title}
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight mt-1.5">
              注文計算結果サマリー
            </h3>
            <p className="text-xs text-slate-400">現在の設定に基づいた最適化注文レベル</p>
          </div>
          <div className="flex gap-2">
            <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl text-xs font-bold border border-emerald-100 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
              リスクリワード比 1 : {activeResult.actualRiskReward.toFixed(2)}
            </div>
          </div>
        </div>

        {/* 特大結果表示 (指値 & 逆指値) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100">
            <div className="text-xs font-bold text-indigo-400 uppercase mb-2">おすすめ指値価格 (利確)</div>
            <div className="text-3xl sm:text-4xl font-mono font-bold text-indigo-700">
              {activeResult.takeProfit.toLocaleString()} <span className="text-sm font-semibold text-indigo-500">円</span>
            </div>
            <div className="mt-2 text-xs sm:text-sm text-indigo-500 font-semibold">
              見込利幅: +{activeResult.profitPercent}% (+{activeResult.expectedProfitPerShare.toLocaleString()}円/株)
            </div>
          </div>

          <div className="bg-rose-50/50 p-6 rounded-2xl border border-rose-100">
            <div className="text-xs font-bold text-rose-400 uppercase mb-2">おすすめ逆指値価格 (損切)</div>
            <div className="text-3xl sm:text-4xl font-mono font-bold text-rose-700">
              {activeResult.stopLoss.toLocaleString()} <span className="text-sm font-semibold text-rose-500">円</span>
            </div>
            <div className="mt-2 text-xs sm:text-sm text-rose-500 font-semibold">
              許容損失: -{activeResult.lossPercent}% (-{activeResult.expectedLossPerShare.toLocaleString()}円/株)
            </div>
          </div>
        </div>

        {/* サブデータグリッド */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="p-4 border border-slate-100 rounded-2xl flex flex-col justify-center bg-slate-50/40">
            <div className="text-slate-400 text-xs font-semibold mb-1">推奨購入株数</div>
            <div className="text-xl font-mono font-bold text-slate-800">
              {activeResult.recommendedShares.toLocaleString()} <span className="text-xs font-semibold text-slate-500">株</span>
            </div>
            <span className="text-[10px] text-slate-400 mt-0.5">
              ({Math.floor(activeResult.recommendedShares / 100).toLocaleString()} 単元)
            </span>
          </div>

          <div className="p-4 border border-slate-100 rounded-2xl flex flex-col justify-center bg-slate-50/40">
            <div className="text-slate-400 text-xs font-semibold mb-1">想定最大利益</div>
            <div className="text-xl font-mono font-bold text-emerald-600">
              +{activeResult.maxProfitAmount.toLocaleString()} <span className="text-xs font-semibold text-emerald-500">円</span>
            </div>
            <span className="text-[10px] text-slate-400 mt-0.5">資金効率の最大化</span>
          </div>

          <div className="p-4 border border-slate-100 rounded-2xl flex flex-col justify-center bg-slate-50/40">
            <div className="text-slate-400 text-xs font-semibold mb-1">最大許容損失</div>
            <div className="text-xl font-mono font-bold text-rose-600">
              -{activeResult.maxLossAmount.toLocaleString()} <span className="text-xs font-semibold text-rose-500">円</span>
            </div>
            <span className="text-[10px] text-slate-400 mt-0.5">総資金の {inputs.allowableLossPercent || 2.0}% 以下に抑制</span>
          </div>
        </div>

        {/* エレガントなレンジスケールバー */}
        <div className="h-20 bg-slate-50 rounded-2xl relative flex items-center px-10 overflow-hidden border border-slate-100">
          <div className="absolute left-0 top-0 bottom-0 w-2 bg-slate-200"></div>
          <div className="flex-1 h-1.5 bg-slate-200 relative rounded-full">
            {/* Range bar for profit */}
            <div 
              style={{ 
                left: `${inputs.direction === "buy" ? riskPercent : 0}%`, 
                width: `${inputs.direction === "buy" ? rewardPercent : riskPercent}%` 
              }}
              className="absolute -top-1.5 h-4 bg-indigo-500/20 rounded-full flex items-center justify-center text-[8px] text-indigo-700 font-extrabold"
            >
            </div>
            {/* Stop Loss Marker */}
            <div 
              className="absolute w-2.5 h-5 bg-rose-500 -top-2 rounded-full border-2 border-white shadow-sm"
              style={{ left: `${inputs.direction === "buy" ? 0 : 100}%` }}
              title="Stop Loss"
            ></div>
            {/* Entry Price Knob */}
            <div 
              className="absolute w-3.5 h-7 bg-slate-800 -top-2.5 rounded-full border-4 border-white shadow-md flex items-center justify-center text-[7px] text-white font-bold"
              style={{ left: `${riskPercent}%` }}
              title="Entry Price"
            >
              E
            </div>
            {/* Take Profit Marker */}
            <div 
              className="absolute w-2.5 h-5 bg-indigo-600 -top-2 rounded-full border-2 border-white shadow-sm"
              style={{ left: `${inputs.direction === "buy" ? 100 : 0}%` }}
              title="Take Profit"
            ></div>
          </div>
          <div className="absolute bottom-1 left-10 right-10 flex justify-between text-[9px] font-bold text-slate-400">
            <span>{inputs.direction === "buy" ? "STOP LOSS" : "TAKE PROFIT"}</span>
            <span>ENTRY LEVEL ({riskPercent.toFixed(0)}%)</span>
            <span>{inputs.direction === "buy" ? "TAKE PROFIT" : "STOP LOSS"}</span>
          </div>
        </div>
      </div>

      {/* 2. 算出戦略の比較一覧 */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-1.5">
          <Layers className="h-4 w-4 text-indigo-500" />
          ストラテジー比較（クリックで切り替え）
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {strategies.map(({ mode, result }) => {
            const isActive = mode === activeMode;
            const isLossGood = result.lossPercent <= Number(inputs.allowableLossPercent || 2.0);
            const isRRGood = result.actualRiskReward >= Number(inputs.riskRewardRatio || 2.0);

            return (
              <div
                key={mode}
                onClick={() => setActiveMode(mode)}
                className={`cursor-pointer rounded-2xl p-5 transition-all flex flex-col justify-between border ${
                  isActive
                    ? "bg-indigo-50/30 border-2 border-indigo-600 shadow-md shadow-indigo-100/50"
                    : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm"
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                      {result.title}
                      {isActive && (
                        <span className="bg-indigo-600 text-white rounded-full p-0.5 flex items-center justify-center">
                          <Check className="h-3 w-3" />
                        </span>
                      )}
                    </span>
                    <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-lg border border-slate-200">
                      RR 1:{result.actualRiskReward.toFixed(1)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mb-4 line-clamp-2 leading-relaxed">
                    {result.description}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 font-mono text-xs">
                  <div>
                    <span className="text-[9px] text-slate-400 block mb-1">逆指値 (損切)</span>
                    <span className="font-bold text-rose-600">{result.stopLoss.toLocaleString()} 円</span>
                    <span className="text-[9px] text-slate-400 block mt-0.5">-{result.lossPercent}%</span>
                  </div>

                  <div>
                    <span className="text-[9px] text-slate-400 block mb-1">指値 (利確)</span>
                    <span className="font-bold text-indigo-600">{result.takeProfit.toLocaleString()} 円</span>
                    <span className="text-[9px] text-slate-400 block mt-0.5">+{result.profitPercent}%</span>
                  </div>

                  <div>
                    <span className="text-[9px] text-slate-400 block mb-1">推奨株数</span>
                    <span className="font-bold text-slate-700">{result.recommendedShares.toLocaleString()} 株</span>
                  </div>
                </div>

                {/* 判定バッジ */}
                <div className="flex gap-1.5 mt-4">
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold border ${
                    isLossGood 
                      ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                      : "bg-rose-50 text-rose-600 border-rose-100"
                  }`}>
                    損失: {isLossGood ? "許容内" : "許容超過"}
                  </span>
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold border ${
                    isRRGood 
                      ? "bg-indigo-50 text-indigo-600 border-indigo-100" 
                      : "bg-amber-50 text-amber-600 border-amber-100"
                  }`}>
                    RR: {isRRGood ? "良好" : "低め"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
