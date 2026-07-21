import { FC } from "react";
import { TrendingUp, ShieldAlert } from "lucide-react";

export const Header: FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 py-4 px-6 sm:px-8 shadow-sm shrink-0">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-md shadow-indigo-100 text-sm">
            指
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-800 flex items-center gap-2">
              指値計算機
            </h1>
            <p className="text-slate-400 text-[11px] sm:text-xs">
              指値・逆指値 資金管理計算機 — 2%ルール基準のポジションサイズ算出
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 sm:gap-4 justify-center md:justify-end text-xs font-medium text-slate-500">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-100 rounded-full text-slate-600">
            <ShieldAlert className="h-3.5 w-3.5 text-rose-500" />
            <span>資金保護: 2%ルール</span>
          </div>
          <div className="hidden sm:flex items-center gap-3 text-slate-400 border-l border-slate-200 pl-4">
            <span>市場: JPX</span>
            <span>通貨: JPY</span>
          </div>
        </div>
      </div>
    </header>
  );
};
