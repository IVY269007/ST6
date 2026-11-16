import React from 'react';
import { Check, RotateCcw } from 'lucide-react';
import type { MatchId, MatchSide, ResolvedMatch } from '../types/tournament';

interface MatchCardProps {
  match: ResolvedMatch;
  onSelectWinner: (matchId: MatchId, side: MatchSide) => void;
  onClearMatch: (matchId: MatchId) => void;
  compact?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const MatchCard: React.FC<MatchCardProps> = ({
  match,
  onSelectWinner,
  onClearMatch,
  compact = false,
  className = '',
  style,
}) => {
  const { definition, topName, bottomName, topPlaceholder, bottomPlaceholder, selectedWinnerSide, isReady, isDecided } =
    match;

  const isGrandFinal = definition.bracket === 'grand_final';
  const isLosers = definition.bracket === 'losers';

  const borderClass = isGrandFinal
    ? 'border-rose-500/45 bg-[#191B23]'
    : isDecided
      ? 'border-amber-500/35 bg-[#171B24]'
      : isReady
        ? 'border-slate-600/80 bg-[#171B24]'
        : 'border-slate-800 bg-[#131720]';

  const headerAccentClass = isGrandFinal
    ? 'text-rose-400'
    : isLosers
      ? 'text-sky-400'
      : 'text-amber-400';

  const renderSlot = (side: MatchSide) => {
    const isTop = side === 'top';
    const name = isTop ? topName : bottomName;
    const placeholder = isTop ? topPlaceholder : bottomPlaceholder;
    const source = isTop ? definition.topSource : definition.bottomSource;
    const isWinner = selectedWinnerSide === side;
    const isLoser = selectedWinnerSide !== null && selectedWinnerSide !== side;

    const canClick = isReady && Boolean(name);

    return (
      <button
        type="button"
        disabled={!canClick}
        onClick={() => canClick && onSelectWinner(definition.id, side)}
        title={
          !canClick
            ? '対戦相手が揃うと勝者をクリックで選択できます'
            : isWinner
              ? 'クリックで勝敗を取り消し'
              : `${name} を勝者として選択`
        }
        className={`group relative w-full flex items-center justify-between gap-2 px-2.5 text-left transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-amber-400 ${
          compact ? 'h-[44px]' : 'h-[42px]'
        } ${isTop ? 'border-b border-slate-800/90' : ''} ${
          isWinner
            ? 'bg-amber-500/15 text-amber-100'
            : isLoser
              ? 'bg-transparent text-slate-500 opacity-60 hover:opacity-90'
              : canClick
                ? 'hover:bg-slate-800/80 text-slate-100 cursor-pointer'
                : 'text-slate-500 cursor-not-allowed'
        }`}
      >
        <div className="flex items-center gap-1.5 min-w-0">
          {source.type === 'seed' ? (
            <span className="font-mono tabular-nums text-[10px] font-bold text-slate-500 shrink-0 w-4">
              #{source.seedNumber}
            </span>
          ) : (
            <span
              className={`font-mono text-[10px] shrink-0 ${
                source.type === 'loser' ? 'text-sky-400/80' : 'text-amber-400/80'
              }`}
            >
              {source.matchId}
              {source.type === 'winner' ? 'W' : 'L'}
            </span>
          )}

          {name ? (
            <span
              className={`text-[13px] truncate ${
                isWinner ? 'font-bold text-amber-100' : 'font-semibold'
              }`}
            >
              {name}
            </span>
          ) : (
            <span className="text-[11px] font-mono text-slate-500 truncate">
              {placeholder}
            </span>
          )}
        </div>

        <div className="shrink-0 flex items-center">
          {isWinner && (
            <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold text-amber-400 tracking-wider">
              <Check className="w-3 h-3 stroke-[2.5]" />
              WIN
            </span>
          )}
          {isLoser && (
            <span className="font-mono text-[10px] text-slate-500 tracking-wider">
              LOSE
            </span>
          )}
          {!selectedWinnerSide && canClick && (
            <span className="font-mono text-[10px] text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
              勝者
            </span>
          )}
        </div>
      </button>
    );
  };

  return (
    <div
      style={style}
      className={`rounded border overflow-hidden shadow-sm transition-colors duration-150 ${borderClass} ${className}`}
    >
      <div className="h-[24px] px-2.5 flex items-center justify-between bg-[#10131A] border-b border-slate-800/90">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className={`font-mono text-[11px] font-bold ${headerAccentClass}`}>
            {definition.id}
          </span>
          <span className="text-slate-600 text-[10px]" aria-hidden="true">
            ·
          </span>
          <span className="font-mono text-[10px] text-slate-400 truncate">
            {definition.shortCode}
          </span>
        </div>

        {isDecided ? (
          <button
            type="button"
            onClick={() => onClearMatch(definition.id)}
            title={`${definition.id} の勝敗をクリア`}
            aria-label={`${definition.id} の勝敗をクリア`}
            className="inline-flex items-center gap-1 text-[10px] font-mono text-slate-400 hover:text-amber-300 px-1 py-0.5 rounded hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-2.5 h-2.5" />
            <span>取消</span>
          </button>
        ) : (
          <span className="text-[10px] text-slate-500 font-mono truncate">
            {isGrandFinal ? 'FINAL' : definition.loserTargetLabel.replace('敗者 ', 'L:')}
          </span>
        )}
      </div>

      <div>
        {renderSlot('top')}
        {renderSlot('bottom')}
      </div>
    </div>
  );
};
