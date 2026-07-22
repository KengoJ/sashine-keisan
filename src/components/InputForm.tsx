import { FC, ChangeEvent } from "react";
import { TradeInputs } from "../types";
import { 
  Info, 
  Coins, 
  TrendingUp, 
  TrendingDown,
  Zap,
  Activity
} from "lucide-react";

interface InputFormProps {
  inputs: TradeInputs;
  setInputs: (inputs: TradeInputs) => void;
}

export const InputForm: FC<InputFormProps> = ({ inputs, setInputs }) => {

  const applyDayTradePreset = () => {
    setInputs({
      direction: "buy",
      entryPrice: 1500,
      riskRewardRatio: 2.0,
      allowableLossPercent: 0.5,
      supportLine: 1475,
      resistanceLine: 1540,
      atr: 25,
      recentHigh: 1535,
      recentLow: 1475,
      capital: 1000000,
      allowableLossAmount: 5000,
      shares: ""
    });
  };

  const applySwingTradePreset = () => {
    setInputs({
      direction: "buy",
      entryPrice: 3000,
      riskRewardRatio: 2.5,
      allowableLossPercent: 2.0,
      supportLine: 2800,
      resistanceLine: 3400,
      atr: 150,
      recentHigh: 3350,
      recentLow: 2780,
      capital: 3000000,
      allowableLossAmount: 60000,
      shares: ""
    });
  };

  const handleInputChange = (field: keyof TradeInputs, value: any) => {
    // For numeric fields, parse value, otherwise leave as-is
    if (field !== "direction") {
      if (value === "") {
        setInputs({ ...inputs, [field]: "" });
      } else {
        const num = parseFloat(value);
        setInputs({ ...inputs, [field]: isNaN(num) ? "" : num });
      }
    } else {
      setInputs({ ...inputs, [field]: value });
    }
  };

  // Auto-calculate allowable loss amount when capital or allowable loss % changes
  const handleCapitalChange = (e: ChangeEvent<HTMLInputElement>) => {
    const capitalVal = e.target.value === "" ? "" : parseFloat(e.target.value);
    const lp = inputs.allowableLossPercent !== "" ? Number(inputs.allowableLossPercent) : 2.0;
    
    let calculatedLossAmt: number | "" = "";
    if (capitalVal !== "" && !isNaN(capitalVal)) {
      calculatedLossAmt = Math.round((capitalVal * lp) / 100);
    }
    
    setInputs({
      ...inputs,
      capital: capitalVal,
      allowableLossAmount: calculatedLossAmt
    });
  };

  const handleLossPercentChange = (e: ChangeEvent<HTMLInputElement>) => {
    const lpVal = e.target.value === "" ? "" : parseFloat(e.target.value);
    const capital = inputs.capital !== "" ? Number(inputs.capital) : "";
    
    let calculatedLossAmt = inputs.allowableLossAmount;
    if (capital !== "" && lpVal !== "" && !isNaN(lpVal)) {
      calculatedLossAmt = Math.round((Number(capital) * lpVal) / 100);
    }
    
    setInputs({
      ...inputs,
      allowableLossPercent: lpVal,
      allowableLossAmount: calculatedLossAmt
    });
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col gap-6" id="trading-input-form">
      {/* プリセット設定 */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col gap-2.5">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
          シミュレーション プリセット
        </span>
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={applyDayTradePreset}
            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 rounded-lg text-xs font-bold text-slate-700 hover:text-indigo-600 transition-all shadow-sm cursor-pointer"
          >
            <Zap className="h-3.5 w-3.5 text-amber-500" />
            <span>デイトレ向け設定</span>
          </button>
          <button
            type="button"
            onClick={applySwingTradePreset}
            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 rounded-lg text-xs font-bold text-slate-700 hover:text-indigo-600 transition-all shadow-sm cursor-pointer"
          >
            <Activity className="h-3.5 w-3.5 text-indigo-500" />
            <span>スイング向け設定</span>
          </button>
        </div>
      </div>

      {/*売買方向の切り替え*/}
      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
            売買方向 <span className="text-indigo-500 font-bold">*</span>
          </label>
          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button
              type="button"
              id="direction-buy-btn"
              onClick={() => handleInputChange("direction", "buy")}
              className={`px-5 py-1.5 rounded-md text-sm font-bold transition-all flex items-center gap-1.5 ${
                inputs.direction === "buy"
                  ? "bg-white shadow-sm text-indigo-600"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <TrendingUp className="h-4 w-4" />
              <span>買い</span>
            </button>
            <button
              type="button"
              id="direction-sell-btn"
              onClick={() => handleInputChange("direction", "sell")}
              className={`px-5 py-1.5 rounded-md text-sm font-bold transition-all flex items-center gap-1.5 ${
                inputs.direction === "sell"
                  ? "bg-white shadow-sm text-rose-600"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <TrendingDown className="h-4 w-4" />
              <span>売り</span>
            </button>
          </div>
        </div>
      </div>

      {/* 必須項目 */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-1.5">
          <span className="w-1.5 h-3.5 bg-indigo-500 rounded-full"></span>
          基本設定（必須）
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="input-entry-price" className="block text-xs font-semibold text-slate-500 mb-1.5">
              エントリー価格 (円) <span className="text-indigo-500 font-bold">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                id="input-entry-price"
                min="0.1"
                step="any"
                placeholder="例: 3250"
                value={inputs.entryPrice}
                onChange={(e) => handleInputChange("entryPrice", e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-base focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none text-slate-800"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="input-rr-ratio" className="block text-xs font-semibold text-slate-500 mb-1.5">
              リスクリワード比 <span className="text-indigo-500 font-bold">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                id="input-rr-ratio"
                min="0.1"
                step="0.1"
                placeholder="利益 : 損失 (例: 2.0)"
                value={inputs.riskRewardRatio}
                onChange={(e) => handleInputChange("riskRewardRatio", e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-base focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none text-slate-800 pr-8"
                required
              />
              <span className="absolute right-3 top-3 text-xs font-semibold text-slate-400">
                倍
              </span>
            </div>
          </div>

          <div>
            <label htmlFor="input-loss-percent" className="block text-xs font-semibold text-slate-500 mb-1.5">
              許容損失率 (%) <span className="text-indigo-500 font-bold">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                id="input-loss-percent"
                min="0.1"
                step="0.1"
                max="100"
                placeholder="1回あたりの損失 (例: 2)"
                value={inputs.allowableLossPercent}
                onChange={handleLossPercentChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-base focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none text-slate-800 pr-8"
                required
              />
              <span className="absolute right-3 top-3 text-xs font-semibold text-slate-400">
                %
              </span>
            </div>
          </div>
        </div>
      </div>

      <hr className="border-slate-100" />

      {/* 推奨項目 */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-3.5 bg-indigo-400 rounded-full"></span>
            市場構造（推奨）
          </span>
          <span className="text-[10px] text-indigo-500 font-bold uppercase"></span>
        </h3>
        <p className="text-xs text-slate-400 mb-4 leading-relaxed">
          サポート・レジスタンスやボラティリティを考慮した、より高度な指値・逆指値が自動計算されます。
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div>
            <label htmlFor="input-support-line" className="block text-[11px] font-semibold text-slate-500 mb-1.5 leading-tight">
              サポート (損切り候補)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-xs font-bold text-rose-400">S</span>
              <input
                type="number"
                id="input-support-line"
                placeholder="例: 3180"
                value={inputs.supportLine}
                onChange={(e) => handleInputChange("supportLine", e.target.value)}
                className="w-full pl-7 pr-2 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs text-slate-800 outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <label htmlFor="input-resistance-line" className="block text-[11px] font-semibold text-slate-500 mb-1.5 leading-tight">
              レジスタンス (利確候補)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-xs font-bold text-emerald-400">R</span>
              <input
                type="number"
                id="input-resistance-line"
                placeholder="例: 3420"
                value={inputs.resistanceLine}
                onChange={(e) => handleInputChange("resistanceLine", e.target.value)}
                className="w-full pl-7 pr-2 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs text-slate-800 outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <label htmlFor="input-atr" className="block text-[11px] font-semibold text-slate-500 mb-1.5 leading-tight">
              ATR (平均値動き幅)
            </label>
            <input
              type="number"
              id="input-atr"
              placeholder="例: 45"
              value={inputs.atr}
              onChange={(e) => handleInputChange("atr", e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs text-slate-800 outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label htmlFor="input-recent-high" className="block text-[11px] font-semibold text-slate-500 mb-1.5 leading-tight">
              直近高値 (利益目標目安)
            </label>
            <input
              type="number"
              id="input-recent-high"
              placeholder="例: 3430"
              value={inputs.recentHigh}
              onChange={(e) => handleInputChange("recentHigh", e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs text-slate-800 outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label htmlFor="input-recent-low" className="block text-[11px] font-semibold text-slate-500 mb-1.5 leading-tight">
              直近安値 (損切り目安)
            </label>
            <input
              type="number"
              id="input-recent-low"
              placeholder="例: 3160"
              value={inputs.recentLow}
              onChange={(e) => handleInputChange("recentLow", e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs text-slate-800 outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-all"
            />
          </div>
        </div>
      </div>

      <hr className="border-slate-100" />

      {/* 資金管理 */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-1.5">
          <span className="w-1.5 h-3.5 bg-amber-400 rounded-full"></span>
          資金管理設定（推奨株数・損失想定）
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="input-capital" className="block text-xs font-semibold text-slate-500 mb-1.5">
              投資余力 / 運用資金 (円)
            </label>
            <div className="relative">
              <input
                type="number"
                id="input-capital"
                placeholder="例: 1000000"
                value={inputs.capital}
                onChange={handleCapitalChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-base focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none text-slate-800 pr-10"
              />
              <span className="absolute right-4 top-3 text-xs font-semibold text-slate-400">
                円
              </span>
            </div>
            {inputs.capital !== "" && inputs.allowableLossPercent !== "" && (
              <p className="text-[11px] text-indigo-500 mt-1.5 font-semibold">
                → 自動計算された許容損失額 ({inputs.allowableLossPercent}%): {inputs.allowableLossAmount?.toLocaleString()} 円
              </p>
            )}
          </div>

          <div>
            <label htmlFor="input-manual-loss-amount" className="block text-xs font-semibold text-slate-500 mb-1.5">
              1回の許容損失額 (手動設定 / 円)
            </label>
            <div className="relative">
              <input
                type="number"
                id="input-manual-loss-amount"
                placeholder="例: 10000"
                value={inputs.allowableLossAmount}
                onChange={(e) => handleInputChange("allowableLossAmount", e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-base focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none text-slate-800 pr-10"
              />
              <span className="absolute right-4 top-3 text-xs font-semibold text-slate-400">
                円
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1.5">
              ※未設定、または0の場合は10,000円として購入可能数を仮計算します。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
