import React from 'react';
import type { MatchId, MatchSide, ResolvedMatch } from '../types/tournament';
import { MatchCard } from './MatchCard';

export type BracketFilter = 'all' | 'winners' | 'losers';
export type BoardLayoutMode = 'tree' | 'list';

interface BracketBoardProps {
  matches: Record<MatchId, ResolvedMatch>;
  filter: BracketFilter;
  layoutMode: BoardLayoutMode;
  isResetRequired: boolean;
  onSelectWinner: (matchId: MatchId, side: MatchSide) => void;
  onClearMatch: (matchId: MatchId) => void;
}

const CARD_W = 212;
const HEADER_H = 24;
const ROW_H = 42;
const CARD_H = HEADER_H + ROW_H * 2; // 108

interface NodePosition {
  x: number;
  y: number;
}

interface ConnectorSpec {
  from: MatchId;
  to: MatchId;
  toSlot: 'top' | 'bottom' | 'center';
  tone: 'winners' | 'losers' | 'final';
}

function getTreeLayout(filter: BracketFilter, isResetRequired: boolean): {
  positions: Partial<Record<MatchId, NodePosition>>;
  connectors: ConnectorSpec[];
  width: number;
  height: number;
  columnLabels: Array<{ x: number; label: string }>;
} {
  if (filter === 'winners') {
    const positions: Partial<Record<MatchId, NodePosition>> = {
      a1: { x: 16, y: 44 },
      a2: { x: 16, y: 172 },
      a3: { x: 16, y: 316 },
      a4: { x: 16, y: 444 },
      b1: { x: 264, y: 108 },
      b2: { x: 264, y: 380 },
      c1: { x: 512, y: 244 },
      f1: { x: 760, y: 244 },
    };
    if (isResetRequired) {
      positions.f2 = { x: 1008, y: 244 };
    }
    const connectors: ConnectorSpec[] = [
      { from: 'a1', to: 'b1', toSlot: 'top', tone: 'winners' },
      { from: 'a2', to: 'b1', toSlot: 'bottom', tone: 'winners' },
      { from: 'a3', to: 'b2', toSlot: 'top', tone: 'winners' },
      { from: 'a4', to: 'b2', toSlot: 'bottom', tone: 'winners' },
      { from: 'b1', to: 'c1', toSlot: 'top', tone: 'winners' },
      { from: 'b2', to: 'c1', toSlot: 'bottom', tone: 'winners' },
      { from: 'c1', to: 'f1', toSlot: 'top', tone: 'final' },
    ];
    if (isResetRequired) {
      connectors.push({ from: 'f1', to: 'f2', toSlot: 'center', tone: 'final' });
    }
    const columnLabels = [
      { x: 16, label: '1回戦 (a1-a4)' },
      { x: 264, label: '準決勝 (b1-b2)' },
      { x: 512, label: '勝者側決勝 (c1)' },
      { x: 760, label: 'グランドファイナル (f1)' },
    ];
    if (isResetRequired) {
      columnLabels.push({ x: 1008, label: 'リセット (f2)' });
    }
    return {
      positions,
      connectors,
      width: isResetRequired ? 1240 : 992,
      height: 580,
      columnLabels,
    };
  }

  if (filter === 'losers') {
    const positions: Partial<Record<MatchId, NodePosition>> = {
      b3: { x: 16, y: 44 },
      b4: { x: 16, y: 176 },
      c2: { x: 264, y: 44 },
      c3: { x: 264, y: 176 },
      d1: { x: 512, y: 110 },
      e1: { x: 760, y: 110 },
      f1: { x: 1008, y: 110 },
    };
    if (isResetRequired) {
      positions.f2 = { x: 1256, y: 110 };
    }
    const connectors: ConnectorSpec[] = [
      { from: 'b3', to: 'c2', toSlot: 'bottom', tone: 'losers' },
      { from: 'b4', to: 'c3', toSlot: 'bottom', tone: 'losers' },
      { from: 'c2', to: 'd1', toSlot: 'top', tone: 'losers' },
      { from: 'c3', to: 'd1', toSlot: 'bottom', tone: 'losers' },
      { from: 'd1', to: 'e1', toSlot: 'bottom', tone: 'losers' },
      { from: 'e1', to: 'f1', toSlot: 'bottom', tone: 'final' },
    ];
    if (isResetRequired) {
      connectors.push({ from: 'f1', to: 'f2', toSlot: 'center', tone: 'final' });
    }
    const columnLabels = [
      { x: 16, label: '敗者側1回戦 (b3-b4)' },
      { x: 264, label: '敗者側2回戦 (c2-c3)' },
      { x: 512, label: '敗者側準決勝 (d1)' },
      { x: 760, label: '敗者側決勝 (e1)' },
      { x: 1008, label: 'グランドファイナル (f1)' },
    ];
    if (isResetRequired) {
      columnLabels.push({ x: 1256, label: 'リセット (f2)' });
    }
    return {
      positions,
      connectors,
      width: isResetRequired ? 1488 : 1240,
      height: 316,
      columnLabels,
    };
  }

  // Full Double Elimination Bracket matching spreadsheet structure
  const positions: Partial<Record<MatchId, NodePosition>> = {
    a1: { x: 16, y: 44 },
    a2: { x: 16, y: 172 },
    a3: { x: 16, y: 316 },
    a4: { x: 16, y: 444 },
    b1: { x: 264, y: 108 },
    b2: { x: 264, y: 380 },
    c1: { x: 512, y: 244 },
    b3: { x: 264, y: 624 },
    b4: { x: 264, y: 756 },
    c2: { x: 512, y: 624 },
    c3: { x: 512, y: 756 },
    d1: { x: 760, y: 690 },
    e1: { x: 1008, y: 690 },
    f1: { x: 1256, y: 467 },
  };
  if (isResetRequired) {
    positions.f2 = { x: 1504, y: 467 };
  }

  const connectors: ConnectorSpec[] = [
    { from: 'a1', to: 'b1', toSlot: 'top', tone: 'winners' },
    { from: 'a2', to: 'b1', toSlot: 'bottom', tone: 'winners' },
    { from: 'a3', to: 'b2', toSlot: 'top', tone: 'winners' },
    { from: 'a4', to: 'b2', toSlot: 'bottom', tone: 'winners' },
    { from: 'b1', to: 'c1', toSlot: 'top', tone: 'winners' },
    { from: 'b2', to: 'c1', toSlot: 'bottom', tone: 'winners' },
    { from: 'b3', to: 'c2', toSlot: 'bottom', tone: 'losers' },
    { from: 'b4', to: 'c3', toSlot: 'bottom', tone: 'losers' },
    { from: 'c2', to: 'd1', toSlot: 'top', tone: 'losers' },
    { from: 'c3', to: 'd1', toSlot: 'bottom', tone: 'losers' },
    { from: 'd1', to: 'e1', toSlot: 'bottom', tone: 'losers' },
    { from: 'c1', to: 'f1', toSlot: 'top', tone: 'final' },
    { from: 'e1', to: 'f1', toSlot: 'bottom', tone: 'final' },
  ];

  if (isResetRequired) {
    connectors.push({ from: 'f1', to: 'f2', toSlot: 'center', tone: 'final' });
  }

  const columnLabels = [
    { x: 16, label: '1回戦 (a1-a4)' },
    { x: 264, label: 'WSF / LR1 (b1-b4)' },
    { x: 512, label: 'WF / LR2 (c1-c3)' },
    { x: 760, label: 'L準決勝 (d1)' },
    { x: 1008, label: 'L決勝 (e1)' },
    { x: 1256, label: '決勝 (f1)' },
  ];
  if (isResetRequired) {
    columnLabels.push({ x: 1504, label: 'リセット (f2)' });
  }

  return {
    positions,
    connectors,
    width: isResetRequired ? 1736 : 1488,
    height: 892,
    columnLabels,
  };
}

export const BracketBoard: React.FC<BracketBoardProps> = ({
  matches,
  filter,
  layoutMode,
  isResetRequired,
  onSelectWinner,
  onClearMatch,
}) => {
  if (layoutMode === 'list') {
    const groups: Array<{ title: string; section: 'winners' | 'losers' | 'grand_final'; ids: MatchId[] }> = [
      { title: 'ウィナーズ 1回戦', section: 'winners', ids: ['a1', 'a2', 'a3', 'a4'] },
      { title: 'ウィナーズ 準決勝', section: 'winners', ids: ['b1', 'b2'] },
      { title: 'ウィナーズ 決勝', section: 'winners', ids: ['c1'] },
      { title: 'ルーザーズ 1回戦', section: 'losers', ids: ['b3', 'b4'] },
      { title: 'ルーザーズ 2回戦', section: 'losers', ids: ['c2', 'c3'] },
      { title: 'ルーザーズ 準決勝', section: 'losers', ids: ['d1'] },
      { title: 'ルーザーズ 決勝', section: 'losers', ids: ['e1'] },
      {
        title: 'グランドファイナル',
        section: 'grand_final',
        ids: isResetRequired ? ['f1', 'f2'] : ['f1'],
      },
    ];

    const visibleGroups = groups.filter((g) => {
      if (filter === 'all') return true;
      if (filter === 'winners') return g.section === 'winners' || g.section === 'grand_final';
      return g.section === 'losers' || g.section === 'grand_final';
    });

    return (
      <div className="space-y-6">
        {visibleGroups.map((group) => (
          <div key={group.title} className="space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              <h3 className="font-display text-sm font-bold tracking-wide text-slate-200">
                {group.title}
              </h3>
              <span className="font-mono text-xs text-slate-500">
                ({group.ids.join(', ')})
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {group.ids.map((id) => (
                <MatchCard
                  key={id}
                  match={matches[id]}
                  compact
                  onSelectWinner={onSelectWinner}
                  onClearMatch={onClearMatch}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  const { positions, connectors, width, height, columnLabels } = getTreeLayout(
    filter,
    isResetRequired
  );

  const visibleIds = Object.keys(positions) as MatchId[];

  return (
    <div className="rounded-md border border-slate-800 bg-[#0F1219] overflow-hidden">
      <div className="overflow-x-auto bracket-scroll p-4">
        <div
          className="relative select-none"
          style={{ width: `${width}px`, height: `${height}px` }}
        >
          {/* Column round headers */}
          {columnLabels.map((col) => (
            <div
              key={col.label}
              style={{ left: `${col.x}px`, top: '6px', width: `${CARD_W}px` }}
              className="absolute text-[11px] font-mono font-bold text-slate-400 tracking-wide truncate"
            >
              {col.label}
            </div>
          ))}

          {/* Section divider for full bracket */}
          {filter === 'all' && (
            <>
              <div
                style={{ top: '576px', left: '16px', right: '16px' }}
                className="absolute border-t border-dashed border-slate-800"
              />
              <div
                style={{ top: '588px', left: '16px' }}
                className="absolute font-display text-xs font-bold tracking-wider text-sky-400"
              >
                LOSERS BRACKET · 敗者側トーナメント
              </div>
              <div
                style={{ top: '440px', left: '1256px' }}
                className="absolute font-display text-xs font-bold tracking-wider text-rose-400"
              >
                GRAND FINAL
              </div>
            </>
          )}

          {/* SVG Bracket Connector Lines */}
          <svg
            width={width}
            height={height}
            className="absolute inset-0 pointer-events-none"
            aria-hidden="true"
          >
            {connectors.map((conn) => {
              const fromPos = positions[conn.from];
              const toPos = positions[conn.to];
              if (!fromPos || !toPos) return null;

              const x1 = fromPos.x + CARD_W;
              const y1 = fromPos.y + HEADER_H + ROW_H; // exact center seam of source match

              const x2 = toPos.x;
              const y2 =
                conn.toSlot === 'top'
                  ? toPos.y + HEADER_H + ROW_H / 2
                  : conn.toSlot === 'bottom'
                    ? toPos.y + HEADER_H + ROW_H + ROW_H / 2
                    : toPos.y + HEADER_H + ROW_H;

              // For long horizontal span (e.g. c1 -> f1), bend cleanly near destination column
              const span = x2 - x1;
              const midX = span > 80 ? x2 - 20 : x1 + span / 2;

              const isDecided = matches[conn.from].isDecided;
              const stroke = isDecided
                ? conn.tone === 'losers'
                  ? '#38BDF8'
                  : conn.tone === 'final'
                    ? '#F43F5E'
                    : '#F59E0B'
                : '#2A3244';

              const d = `M ${x1} ${y1} H ${midX} V ${y2} H ${x2}`;

              return (
                <path
                  key={`${conn.from}-${conn.to}-${conn.toSlot}`}
                  d={d}
                  fill="none"
                  stroke={stroke}
                  strokeWidth={isDecided ? 2.2 : 1.5}
                  strokeLinejoin="miter"
                  opacity={isDecided ? 0.9 : 0.85}
                />
              );
            })}

            {/* Incoming stub indicators for loser drop slots */}
            {visibleIds
              .filter((id) => ['b3', 'b4', 'c2', 'c3', 'e1'].includes(id))
              .map((id) => {
                const pos = positions[id];
                if (!pos) return null;
                const yTop = pos.y + HEADER_H + ROW_H / 2;
                const yBot = pos.y + HEADER_H + ROW_H + ROW_H / 2;
                const hasTop = Boolean(matches[id].topPlayerId);
                const hasBot = Boolean(matches[id].bottomPlayerId);

                return (
                  <g key={`stub-${id}`}>
                    <line
                      x1={pos.x - 14}
                      y1={yTop}
                      x2={pos.x}
                      y2={yTop}
                      stroke={hasTop ? '#38BDF8' : '#2A3244'}
                      strokeWidth={hasTop ? 2 : 1.5}
                      strokeDasharray={hasTop ? undefined : '3 3'}
                    />
                    {(id === 'b3' || id === 'b4') && (
                      <line
                        x1={pos.x - 14}
                        y1={yBot}
                        x2={pos.x}
                        y2={yBot}
                        stroke={hasBot ? '#38BDF8' : '#2A3244'}
                        strokeWidth={hasBot ? 2 : 1.5}
                        strokeDasharray={hasBot ? undefined : '3 3'}
                      />
                    )}
                  </g>
                );
              })}
          </svg>

          {/* Match Cards */}
          {visibleIds.map((id) => {
            const pos = positions[id]!;
            return (
              <MatchCard
                key={id}
                match={matches[id]}
                onSelectWinner={onSelectWinner}
                onClearMatch={onClearMatch}
                className="absolute"
                style={{
                  left: `${pos.x}px`,
                  top: `${pos.y}px`,
                  width: `${CARD_W}px`,
                  height: `${CARD_H}px`,
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
