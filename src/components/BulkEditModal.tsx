import React, { useEffect, useState } from 'react';
import { RotateCcw, Shuffle, Users, X } from 'lucide-react';
import type { PlayerId } from '../types/tournament';
import { DEFAULT_PLAYERS, PLAYER_IDS } from '../utils/bracketEngine';

interface BulkEditModalProps {
  isOpen: boolean;
  players: Record<PlayerId, string>;
  onClose: () => void;
  onSave: (updatedPlayers: Record<PlayerId, string>) => void;
}

export const BulkEditModal: React.FC<BulkEditModalProps> = ({
  isOpen,
  players,
  onClose,
  onSave,
}) => {
  const [draft, setDraft] = useState<Record<PlayerId, string>>(players);
  const [mode, setMode] = useState<'fields' | 'paste'>('fields');
  const [pasteText, setPasteText] = useState('');

  useEffect(() => {
    if (isOpen) {
      setDraft({ ...players });
      setPasteText(PLAYER_IDS.map((id) => players[id]).join('\n'));
    }
  }, [isOpen, players]);

  if (!isOpen) return null;

  const handleFieldChange = (id: PlayerId, value: string) => {
    const next = { ...draft, [id]: value };
    setDraft(next);
    setPasteText(PLAYER_IDS.map((pid) => next[pid]).join('\n'));
  };

  const handlePasteChange = (value: string) => {
    setPasteText(value);
    const lines = value.split(/\r?\n/);
    const next: Record<PlayerId, string> = { ...draft };
    PLAYER_IDS.forEach((id, idx) => {
      const val = lines[idx]?.trim();
      next[id] = val !== undefined ? val : '';
    });
    setDraft(next);
  };

  const handleShuffle = () => {
    const names = PLAYER_IDS.map((id) => draft[id].trim() || `選手 ${id.slice(1)}`);
    for (let i = names.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [names[i], names[j]] = [names[j], names[i]];
    }
    const next = {} as Record<PlayerId, string>;
    PLAYER_IDS.forEach((id, idx) => {
      next[id] = names[idx];
    });
    setDraft(next);
    setPasteText(names.join('\n'));
  };

  const handleRestoreDefaults = () => {
    setDraft({ ...DEFAULT_PLAYERS });
    setPasteText(PLAYER_IDS.map((id) => DEFAULT_PLAYERS[id]).join('\n'));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = {} as Record<PlayerId, string>;
    PLAYER_IDS.forEach((id, idx) => {
      cleaned[id] = draft[id].trim() || `選手 ${idx + 1}`;
    });
    onSave(cleaned);
    onClose();
  };

  const round1Pairs: Array<{ matchId: string; top: PlayerId; bottom: PlayerId }> = [
    { matchId: 'a1', top: 'p1', bottom: 'p2' },
    { matchId: 'a2', top: 'p3', bottom: 'p4' },
    { matchId: 'a3', top: 'p5', bottom: 'p6' },
    { matchId: 'a4', top: 'p7', bottom: 'p8' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="bulk-edit-title"
    >
      <div className="w-full max-w-2xl rounded-md border border-slate-700 bg-[#151922] shadow-2xl overflow-hidden my-auto">
        <div className="flex items-center justify-between px-5 py-4 bg-[#10131A] border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Users className="w-4.5 h-4.5 text-amber-400" />
            <h2 id="bulk-edit-title" className="font-display text-lg font-bold tracking-wide text-white">
              参加者一括編集（8名）
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="閉じる"
            className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-1 p-1 rounded bg-[#10131A] border border-slate-800">
              <button
                type="button"
                onClick={() => setMode('fields')}
                className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors cursor-pointer whitespace-nowrap ${
                  mode === 'fields'
                    ? 'bg-amber-500 text-slate-950'
                    : 'text-slate-400 hover:text-slate-100'
                }`}
              >
                個別入力フォーム
              </button>
              <button
                type="button"
                onClick={() => setMode('paste')}
                className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors cursor-pointer whitespace-nowrap ${
                  mode === 'paste'
                    ? 'bg-amber-500 text-slate-950'
                    : 'text-slate-400 hover:text-slate-100'
                }`}
              >
                テキスト一括貼付
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleShuffle}
                className="inline-flex items-center gap-1.5 min-h-[36px] px-3 py-1.5 text-xs font-medium rounded border border-slate-700 bg-[#1A1F2B] text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer whitespace-nowrap"
              >
                <Shuffle className="w-3.5 h-3.5 text-sky-400" />
                <span>席順シャッフル</span>
              </button>
              <button
                type="button"
                onClick={handleRestoreDefaults}
                className="inline-flex items-center gap-1.5 min-h-[36px] px-3 py-1.5 text-xs font-medium rounded border border-slate-700 bg-[#1A1F2B] text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer whitespace-nowrap"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                <span>初期名に戻す</span>
              </button>
            </div>
          </div>

          {mode === 'fields' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {round1Pairs.map((pair) => {
                const topIdx = PLAYER_IDS.indexOf(pair.top) + 1;
                const bottomIdx = PLAYER_IDS.indexOf(pair.bottom) + 1;
                return (
                  <div
                    key={pair.matchId}
                    className="rounded border border-slate-800 bg-[#10131A] p-3 space-y-2.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono font-bold text-amber-400">
                        {pair.matchId}
                      </span>
                      <span className="text-slate-500">1回戦 対戦カード</span>
                    </div>

                    <label className="block">
                      <span className="sr-only">選手 {topIdx}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-slate-500 w-6 shrink-0">
                          #{topIdx}
                        </span>
                        <input
                          type="text"
                          value={draft[pair.top]}
                          onChange={(e) => handleFieldChange(pair.top, e.target.value)}
                          placeholder={`選手 ${topIdx}`}
                          maxLength={32}
                          className="w-full min-h-[40px] rounded border border-slate-700 bg-[#181C24] px-3 py-1.5 text-sm text-white placeholder:text-slate-600 focus:border-amber-500 focus:outline-none"
                        />
                      </div>
                    </label>

                    <label className="block">
                      <span className="sr-only">選手 {bottomIdx}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-slate-500 w-6 shrink-0">
                          #{bottomIdx}
                        </span>
                        <input
                          type="text"
                          value={draft[pair.bottom]}
                          onChange={(e) => handleFieldChange(pair.bottom, e.target.value)}
                          placeholder={`選手 ${bottomIdx}`}
                          maxLength={32}
                          className="w-full min-h-[40px] rounded border border-slate-700 bg-[#181C24] px-3 py-1.5 text-sm text-white placeholder:text-slate-600 focus:border-amber-500 focus:outline-none"
                        />
                      </div>
                    </label>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-xs text-slate-400">
                1行につき1名ずつ入力または貼り付けしてください（上から #1〜#8 に割り当てられます）。スプレッドシートの縦1列をそのまま貼り付け可能です。
              </p>
              <textarea
                rows={8}
                value={pasteText}
                onChange={(e) => handlePasteChange(e.target.value)}
                placeholder={'選手 1\n選手 2\n選手 3\n選手 4\n選手 5\n選手 6\n選手 7\n選手 8'}
                className="w-full rounded border border-slate-700 bg-[#10131A] p-3 font-sans text-sm leading-7 text-white placeholder:text-slate-600 focus:border-amber-500 focus:outline-none"
              />
            </div>
          )}

          <p className="text-xs text-slate-500">
            すでに勝敗を入力済みの試合がある場合でも、選手名を変更すると勝ち上がった先のプレートや順位欄も自動で更新されます。
          </p>

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[40px] px-4 py-2 text-sm font-medium rounded border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="min-h-[40px] px-5 py-2 text-sm font-bold rounded bg-amber-500 text-slate-950 hover:bg-amber-400 transition-colors cursor-pointer"
            >
              この内容で反映する
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
