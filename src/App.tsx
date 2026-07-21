import { useState } from "react";
import { TradeInputs, CalculationResult } from "./types";
import { Header } from "./components/Header";
import { InputForm } from "./components/InputForm";
import { CalculatedResults } from "./components/CalculatedResults";
import { ValueExplainer } from "./components/ValueExplainer";
import { Shield, TrendingUp } from "lucide-react";

export default function App() {
  const [inputs, setInputs] = useState<TradeInputs>({
    direction: "buy",
    entryPrice: "",
    riskRewardRatio: 2.0,
    allowableLossPercent: 2.0,
    
    // Recommended
    supportLine: "",
    resistanceLine: "",
    atr: "",
    recentHigh: "",
    recentLow: "",
    
    // Money management
    capital: "",
    allowableLossAmount: "",
    shares: ""
  });

  const [activeMode, setActiveMode] = useState<"risk_reward" | "support_resistance" | "atr" | "high_low">("risk_reward");
  const [activeResult, setActiveResult] = useState<CalculationResult | null>(null);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-16">
      {/* 共通ヘッダー */}
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* クイック統計 / インフォメーションバー */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-slate-200/60 shadow-sm flex items-center gap-3">
            <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">資金防衛ルール</p>
              <p className="text-xs sm:text-sm font-semibold text-slate-700">1回の損失を資金の2%以下に抑制</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-slate-200/60 shadow-sm flex items-center gap-3">
            <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">利益拡大ルール</p>
              <p className="text-xs sm:text-sm font-semibold text-slate-700">リスクリワード比1:2以上を維持</p>
            </div>
          </div>
        </div>

        {/* ２カラムレイアウト（入力フォーム ＆ 計算結果） */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* 左カラム: 入力フォーム (スパン 5) */}
          <div className="lg:col-span-5 space-y-6">
            <InputForm inputs={inputs} setInputs={setInputs} />
          </div>

          {/* 右カラム: 計算結果 (スパン 7) */}
          <div className="lg:col-span-7 space-y-6">
            <CalculatedResults
              inputs={inputs}
              activeMode={activeMode}
              setActiveMode={setActiveMode}
              onActiveResultChange={setActiveResult}
            />
          </div>
        </div>

        <ValueExplainer />
      </main>
    </div>
  );
}
