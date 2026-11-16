import React, { useState } from 'react';
import { Download, Smartphone, Share, PlusSquare, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  const handleClick = async () => {
    if (isInstallable) {
      await install();
      return;
    }
    setShowGuide(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className="inline-flex items-center gap-2 min-h-[40px] px-3.5 py-2 text-xs font-semibold tracking-wide rounded border border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 hover:border-amber-400/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
      >
        {isInstallable ? (
          <Download className="w-3.5 h-3.5 shrink-0" />
        ) : (
          <Smartphone className="w-3.5 h-3.5 shrink-0" />
        )}
        <span>{isInstallable ? 'アプリをインストール' : 'アプリ化 (PWA)'}</span>
      </button>

      {showGuide && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="pwa-guide-title"
        >
          <div className="w-full max-w-md rounded-md border border-slate-700 bg-[#181C24] p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <h3
                id="pwa-guide-title"
                className="font-display text-lg font-bold tracking-wide text-slate-100"
              >
                {isIOS ? 'iPhone / iPad へのインストール方法' : 'アプリとしてインストール (PWA)'}
              </h3>
              <button
                type="button"
                onClick={() => setShowGuide(false)}
                aria-label="閉じる"
                className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded border border-slate-700 text-slate-400 hover:text-slate-100 hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {isIOS ? (
              <ol className="mt-4 space-y-3 text-sm text-slate-300 leading-relaxed">
                <li className="flex items-start gap-3">
                  <span className="font-mono text-xs font-bold text-amber-400 mt-0.5">01</span>
                  <span>
                    Safari 画面下の <Share className="inline w-4 h-4 mx-1 text-sky-400" />
                    <strong className="text-white">共有ボタン</strong> をタップします。
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-mono text-xs font-bold text-amber-400 mt-0.5">02</span>
                  <span>
                    メニューから <PlusSquare className="inline w-4 h-4 mx-1 text-amber-400" />
                    <strong className="text-white">「ホーム画面に追加」</strong> を選択するとアプリとして起動できます。
                  </span>
                </li>
              </ol>
            ) : (
              <div className="mt-4 space-y-3 text-sm text-slate-300 leading-relaxed">
                <p>
                  このアプリはオフライン動作対応の PWA です。以下の手順でデスクトップ・スマホにインストールできます。
                </p>
                <ul className="space-y-2 text-xs text-slate-400 bg-[#12151C] border border-slate-800 rounded p-3">
                  <li>
                    <strong className="text-slate-200">PC (Chrome / Edge):</strong> アドレスバー右端の「インストール」アイコンをクリック、またはブラウザメニュー →「保存と共有」→「アプリをインストール」
                  </li>
                  <li>
                    <strong className="text-slate-200">Android (Chrome):</strong> 右上メニュー →「アプリをインストール」または「ホーム画面に追加」
                  </li>
                  <li>
                    <strong className="text-slate-200">プレビュー表示中の場合:</strong> 右上の「新しいタブで開く」から単独タブで開くとインストールボタンが表示されます。
                  </li>
                </ul>
              </div>
            )}

            <button
              type="button"
              onClick={() => setShowGuide(false)}
              className="mt-5 w-full min-h-[42px] rounded bg-amber-500 px-4 py-2 text-sm font-bold text-slate-950 hover:bg-amber-400 transition-colors cursor-pointer"
            >
              閉じる
            </button>
          </div>
        </div>
      )}
    </>
  );
};
