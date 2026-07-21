import { FC } from "react";
import { BookOpen, Shield, Compass, BarChart2 } from "lucide-react";

export const ValueExplainer: FC = () => {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm mt-8 animate-fade-in" id="value-explainer-section">
      <div className="flex items-center gap-2.5 mb-6">
        <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
          <BookOpen className="h-4.5 w-4.5" />
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-800 tracking-tight">
            トレード指標・設定値の解説
          </h2>
          <p className="text-xs text-slate-400">各入力項目と計算結果の持つ意味と活用方法</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 必須項目 */}
        <div className="space-y-5">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Shield className="h-4 w-4 text-indigo-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">基本必須パラメータ</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-bold text-slate-800 mb-1">エントリー価格</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                新規にポジションを保有する基準価格。この価格を起点として、許容されるリスクと獲得目標となるリワードが計算されます。
              </p>
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800 mb-1">許容損失率 (%)</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                1回のトレードで失ってもよい運用資金の最大割合。プロ投資家の間では、自己破産確率を極小に抑えるため、一般的に<strong>「2%ルール」</strong>（最大2%まで）が推奨されます。
              </p>
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800 mb-1">リスクリワード比</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                想定する「利益（リワード）」と「損失（リスク）」の比率。<strong>1:2以上</strong>（損失1に対して利益2以上）を維持することで、勝率が50%未満であってもトータル収支をプラスに導きやすくなります。
              </p>
            </div>
          </div>
        </div>

        {/* 推奨項目 */}
        <div className="space-y-5">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Compass className="h-4 w-4 text-indigo-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">市場構造パラメータ</h3>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-bold text-slate-800 mb-1">サポート / レジスタンス</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                <strong>サポート（支持線）</strong>：買い圧力が強く、価格下落が止まりやすい水準。この直下に損切り（逆指値）を置くのが合理的です。<br />
                <strong>レジスタンス（抵抗線）</strong>：売り圧力が強く、価格上昇が頭打ちになりやすい水準。
              </p>
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800 mb-1">ATR (Average True Range)</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                市場の一定期間の平均的な値動き幅（ボラティリティ）。直近のノイズ（一時的なブレ）で損切りにかからないよう、ATRの1.5〜2倍程度の値幅をエントリー価格から離して逆指値を置く手法が効果的です。
              </p>
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800 mb-1">直近高値 / 直近安値</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                直近のチャート上で意識されている高値・安値。これらは市場参加者の心理的節目となりやすいため、利益確定目標や損切りの境界線として非常に有効な基準値になります。
              </p>
            </div>
          </div>
        </div>

        {/* 計算項目 */}
        <div className="space-y-5">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <BarChart2 className="h-4 w-4 text-indigo-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">計算結果と資金管理</h3>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-bold text-slate-800 mb-1">推奨購入株数（ロット）</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                「1回の許容損失額」を「1株あたりの損切り幅」で割って算出される最適なポジション規模。感情に流されず、数式的にロット数を決定することが長期的な生存に不可欠です。
              </p>
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800 mb-1">想定最大利益 / 損失</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                推奨購入株数でトレードを実行した際、指値（利確）または逆指値（損切）に達したときに発生する合計損益。事前にこの最悪のシナリオ（許容損失）を受け入れた上で取引に臨むことができます。
              </p>
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800 mb-1">投資余力 / 運用資金</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                現在あなたがトレードに充てることができる手元資金。この全体総額に対して「許容損失率（例: 2%）」を掛け合わせることで、安全な最大損失レベルを瞬時に決定します。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
