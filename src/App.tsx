import React, { useEffect, useMemo, useState } from 'react';
import {
  Check,
  GitBranch,
  LayoutList,
  Pencil,
  RotateCcw,
  Users,
} from 'lucide-react';
import {
  BracketBoard,
  type BoardLayoutMode,
  type BracketFilter,
} from './components/BracketBoard';
import { BulkEditModal } from './components/BulkEditModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { PodiumBanner } from './components/PodiumBanner';
import { PWAInstallButton } from './components/PWAInstallButton';
import type { MatchId, MatchSide, PlayerId, TournamentState } from './types/tournament';
import {
  clearMatchWinner,
  createInitialTournamentState,
  resolveBracket,
  selectMatchWinner,
} from './utils/bracketEngine';

const STORAGE_KEY = 'sf6-8p-de-bracket-v1';

const PREVIOUS_DEFAULT_TITLE = 'STREET FIGHTER 6 8名ダブルエリミネーション大会';

function loadSavedState(): TournamentState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialTournamentState();
    const parsed = JSON.parse(raw) as Partial<TournamentState>;
    const base = createInitialTournamentState();
    const savedTitle = typeof parsed.title === 'string' ? parsed.title.trim() : '';
    const resolvedTitle =
      savedTitle && savedTitle !== PREVIOUS_DEFAULT_TITLE ? savedTitle : base.title;
    return {
      title: resolvedTitle,
      players: { ...base.players, ...(parsed.players ?? {}) },
      winners: parsed.winners ?? {},
      gfResetEnabled: Boolean(parsed.gfResetEnabled),
    };
  } catch {
    return createInitialTournamentState();
  }
}

export default function App() {
  const [state, setState] = useState<TournamentState>(loadSavedState);
  const [filter, setFilter] = useState<BracketFilter>('all');
  const [layoutMode, setLayoutMode] = useState<BoardLayoutMode>('tree');
  const [isBulkEditOpen, setIsBulkEditOpen] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(state.title);
  const [confirmResetMatches, setConfirmResetMatches] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage quota errors
    }
  }, [state]);

  const resolved = useMemo(() => resolveBracket(state), [state]);

  const handleSelectWinner = (matchId: MatchId, side: MatchSide) => {
    setState((prev) => selectMatchWinner(prev, matchId, side));
  };

  const handleClearMatch = (matchId: MatchId) => {
    setState((prev) => clearMatchWinner(prev, matchId));
  };

  const handleSavePlayers = (updatedPlayers: Record<PlayerId, string>) => {
    setState((prev) => ({
      ...prev,
      players: updatedPlayers,
    }));
  };

  const handleResetAllMatches = () => {
    if (!confirmResetMatches) {
      setConfirmResetMatches(true);
      return;
    }
    setState((prev) => ({
      ...prev,
      winners: {},
    }));
    setConfirmResetMatches(false);
  };

  const handleToggleGFReset = () => {
    setState((prev) => {
      const nextEnabled = !prev.gfResetEnabled;
      const nextWinners = { ...prev.winners };
      if (!nextEnabled && nextWinners.f2) {
        delete nextWinners.f2;
      }
      return {
        ...prev,
        gfResetEnabled: nextEnabled,
        winners: nextWinners,
      };
    });
  };

  const handleSaveTitle = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = titleDraft.trim() || createInitialTournamentState().title;
    setState((prev) => ({ ...prev, title: cleaned }));
    setTitleDraft(cleaned);
    setIsEditingTitle(false);
  };

  return (
    <div className="min-h-screen flex flex-col arcade-grid-bg text-slate-100">
      {/* Top Bar: strictly 3 zones */}
      <header className="sticky top-0 z-30 border-b border-slate-800 bg-[#0D0F14]/95 backdrop-blur-md">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-8">
          {/* Zone 1: Brand wordmark */}
          <a
            href="#top"
            className="font-display text-xl font-bold tracking-wider text-white whitespace-nowrap shrink-0"
          >
            SF6 BRACKET
          </a>

          {/* Zone 2: Clean text view links */}
          <nav
            aria-label="トーナメント表示切り替え"
            className="hidden md:flex items-center gap-6 text-sm font-medium"
          >
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                filter === 'all'
                  ? 'border-amber-500 text-white font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-100'
              }`}
            >
              全体トーナメント
            </button>
            <button
              type="button"
              onClick={() => setFilter('winners')}
              className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                filter === 'winners'
                  ? 'border-amber-500 text-white font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-100'
              }`}
            >
              勝者側 (Winners)
            </button>
            <button
              type="button"
              onClick={() => setFilter('losers')}
              className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                filter === 'losers'
                  ? 'border-sky-400 text-white font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-100'
              }`}
            >
              敗者側 (Losers)
            </button>
          </nav>

          {/* Zone 3: Primary Action */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => setIsBulkEditOpen(true)}
              className="inline-flex items-center gap-2 min-h-[40px] px-4 py-2 text-xs sm:text-sm font-bold rounded bg-amber-500 text-slate-950 hover:bg-amber-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Users className="w-4 h-4 shrink-0" />
              <span>選手一括編集</span>
            </button>
          </div>
        </div>
      </header>

      <main id="top" className="flex-1 w-full max-w-[1600px] mx-auto px-4 sm:px-6 py-5 space-y-5">
        {/* Workspace Title & Controls Bar */}
        <section
          aria-label="大会設定と操作バー"
          className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800/80"
        >
          <div className="space-y-1 min-w-0">
            {isEditingTitle ? (
              <form onSubmit={handleSaveTitle} className="flex items-center gap-2 max-w-xl">
                <input
                  type="text"
                  value={titleDraft}
                  onChange={(e) => setTitleDraft(e.target.value)}
                  maxLength={60}
                  autoFocus
                  className="w-full min-h-[40px] rounded border border-amber-500/70 bg-[#151922] px-3 py-1.5 text-lg font-bold text-white focus:outline-none"
                />
                <button
                  type="submit"
                  className="inline-flex items-center gap-1 min-h-[40px] px-3 py-1.5 text-xs font-bold rounded bg-amber-500 text-slate-950 hover:bg-amber-400 cursor-pointer shrink-0"
                >
                  <Check className="w-3.5 h-3.5" />
                  確定
                </button>
              </form>
            ) : (
              <div className="flex items-center gap-2.5 min-w-0">
                <h1 className="font-display text-xl sm:text-2xl font-bold tracking-wide text-white truncate">
                  {state.title}
                </h1>
                <button
                  type="button"
                  onClick={() => {
                    setTitleDraft(state.title);
                    setIsEditingTitle(true);
                  }}
                  aria-label="大会名を編集"
                  title="大会名を編集"
                  className="min-h-[32px] min-w-[32px] flex items-center justify-center rounded text-slate-400 hover:text-amber-300 hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-slate-400">
              <span>参加者 8名</span>
              <span aria-hidden="true">·</span>
              <span>ダブルエリミネーション方式</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums text-slate-300">
                進行 {resolved.completedCount} / {resolved.totalCount} 試合
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Mobile bracket filter */}
            <div className="flex md:hidden items-center gap-1 p-1 rounded bg-[#151922] border border-slate-800">
              <button
                type="button"
                onClick={() => setFilter('all')}
                className={`px-2.5 py-1.5 text-xs font-semibold rounded whitespace-nowrap cursor-pointer ${
                  filter === 'all' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'
                }`}
              >
                全体
              </button>
              <button
                type="button"
                onClick={() => setFilter('winners')}
                className={`px-2.5 py-1.5 text-xs font-semibold rounded whitespace-nowrap cursor-pointer ${
                  filter === 'winners' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'
                }`}
              >
                勝者側
              </button>
              <button
                type="button"
                onClick={() => setFilter('losers')}
                className={`px-2.5 py-1.5 text-xs font-semibold rounded whitespace-nowrap cursor-pointer ${
                  filter === 'losers' ? 'bg-sky-400 text-slate-950' : 'text-slate-400'
                }`}
              >
                敗者側
              </button>
            </div>

            {/* Layout Mode Switcher */}
            <div className="inline-flex items-center gap-1 p-1 rounded bg-[#151922] border border-slate-800">
              <button
                type="button"
                onClick={() => setLayoutMode('tree')}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded whitespace-nowrap transition-colors cursor-pointer ${
                  layoutMode === 'tree'
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <GitBranch className="w-3.5 h-3.5" />
                <span>ブラケット図</span>
              </button>
              <button
                type="button"
                onClick={() => setLayoutMode('list')}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded whitespace-nowrap transition-colors cursor-pointer ${
                  layoutMode === 'list'
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <LayoutList className="w-3.5 h-3.5" />
                <span>ラウンド一覧</span>
              </button>
            </div>

            {/* Optional Grand Final Reset Toggle */}
            <button
              type="button"
              onClick={handleToggleGFReset}
              aria-pressed={state.gfResetEnabled}
              title="グランドファイナルでルーザーズ側が勝利した際にリセット試合 (f2) を行うか切り替えます"
              className={`min-h-[40px] px-3 py-2 text-xs font-medium rounded border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                state.gfResetEnabled
                  ? 'border-rose-500/50 bg-rose-500/15 text-rose-200'
                  : 'border-slate-700 bg-[#151922] text-slate-300 hover:bg-slate-800'
              }`}
            >
              GFリセット: {state.gfResetEnabled ? 'あり' : 'なし'}
            </button>

            {/* Two-step safe Match Reset */}
            {confirmResetMatches ? (
              <div className="inline-flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleResetAllMatches}
                  className="min-h-[40px] px-3 py-2 text-xs font-bold rounded bg-rose-600 text-white hover:bg-rose-500 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  勝敗を全消去
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmResetMatches(false)}
                  className="min-h-[40px] px-2.5 py-2 text-xs font-medium rounded border border-slate-700 text-slate-300 hover:bg-slate-800 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  取消
                </button>
              </div>
            ) : (
              <button
                type="button"
                disabled={resolved.completedCount === 0}
                onClick={handleResetAllMatches}
                className="inline-flex items-center gap-1.5 min-h-[40px] px-3 py-2 text-xs font-medium rounded border border-slate-700 bg-[#151922] text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>勝敗リセット</span>
              </button>
            )}

            {/* In-App PWA Install Button */}
            <PWAInstallButton />
          </div>
        </section>

        {/* 1st - 3rd Place Podium Display */}
        <PodiumBanner
          podium={resolved.podium}
          players={state.players}
          tournamentTitle={state.title}
          isResetRequired={resolved.isResetRequired}
        />

        {/* Tournament Bracket Area */}
        <section aria-label="トーナメント表">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
            <p className="text-xs text-slate-400">
              各試合で勝利した選手のネームプレートをクリックすると、次の試合と敗者側プレートへ自動的に名前が入ります。
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-0.5 bg-amber-500 inline-block" aria-hidden="true" />
                勝者側ルート
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-0.5 bg-sky-400 inline-block" aria-hidden="true" />
                敗者側ルート
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-0.5 bg-rose-500 inline-block" aria-hidden="true" />
                決勝ルート
              </span>
            </div>
          </div>

          <BracketBoard
            matches={resolved.matches}
            filter={filter}
            layoutMode={layoutMode}
            isResetRequired={resolved.isResetRequired}
            onSelectWinner={handleSelectWinner}
            onClearMatch={handleClearMatch}
          />
        </section>
      </main>

      <footer className="border-t border-slate-800/80 py-4 px-4 sm:px-6 text-xs text-slate-500">
        <div className="max-w-[1600px] mx-auto flex flex-wrap items-center justify-between gap-2">
          <span>8名ダブルエリミネーション トーナメント表（入力データは自動保存されます）</span>
          <span>オフライン動作・ホーム画面インストール対応 (PWA)</span>
        </div>
      </footer>

      <BulkEditModal
        isOpen={isBulkEditOpen}
        players={state.players}
        onClose={() => setIsBulkEditOpen(false)}
        onSave={handleSavePlayers}
      />

      <OfflineIndicator />
    </div>
  );
}
