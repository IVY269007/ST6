import React, { useState } from 'react';
import { Award, Check, Copy, Crown, Medal } from 'lucide-react';
import type { PlayerId, PodiumStandings } from '../types/tournament';

interface PodiumBannerProps {
  podium: PodiumStandings;
  players: Record<PlayerId, string>;
  tournamentTitle: string;
  isResetRequired: boolean;
}

export const PodiumBanner: React.FC<PodiumBannerProps> = ({
  podium,
  players,
  tournamentTitle,
  isResetRequired,
}) => {
  const [copied, setCopied] = useState(false);

  const getPlayerName = (id: PlayerId | null) => {
    if (!id) return null;
    return players[id]?.trim() || `選手 ${id.slice(1)}`;
  };

  const firstName = getPlayerName(podium.first);
  const secondName = getPlayerName(podium.second);
  const thirdName = getPlayerName(podium.third);

  const handleCopyResults = async () => {
    const lines = [
      `【${tournamentTitle}】大会結果`,
      `1位（優勝）: ${firstName ?? '未確定'}`,
      `2位（準優勝）: ${secondName ?? '未確定'}`,
      `3位: ${thirdName ?? '未確定'}`,
    ];
    try {
      await navigator.clipboard.writeText(lines.join('\n'));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API might be unavailable in restricted contexts
    }
  };

  const slots = [
    {
      rank: '1ST',
      jpRank: '1位 · 優勝',
      name: firstName,
      pendingHint: isResetRequired ? 'f2 勝者待ち' : 'f1 勝者待ち',
      icon: Crown,
      cardStyle: firstName
        ? 'border-amber-500/50 bg-[#1B1814]'
        : 'border-slate-800 bg-[#141821]',
      rankColor: 'text-amber-400',
      iconColor: 'text-amber-400',
    },
    {
      rank: '2ND',
      jpRank: '2位 · 準優勝',
      name: secondName,
      pendingHint: isResetRequired ? 'f2 敗者待ち' : 'f1 敗者待ち',
      icon: Medal,
      cardStyle: secondName
        ? 'border-slate-400/50 bg-[#181C26]'
        : 'border-slate-800 bg-[#141821]',
      rankColor: 'text-slate-300',
      iconColor: 'text-slate-300',
    },
    {
      rank: '3RD',
      jpRank: '3位',
      name: thirdName,
      pendingHint: 'e1 敗者待ち',
      icon: Award,
      cardStyle: thirdName
        ? 'border-orange-500/45 bg-[#1B1615]'
        : 'border-slate-800 bg-[#141821]',
      rankColor: 'text-orange-400',
      iconColor: 'text-orange-400',
    },
  ];

  return (
    <section
      aria-label="最終順位・入賞者"
      className="rounded-md border border-slate-800 bg-[#12151C] p-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="flex items-baseline gap-2.5">
          <h2 className="font-display text-base font-bold tracking-wide text-slate-100">
            FINAL STANDINGS
          </h2>
          <span className="text-slate-600 text-xs" aria-hidden="true">
            ·
          </span>
          <span className="text-xs font-medium text-slate-400">
            入賞者（1位〜3位）
          </span>
        </div>

        <button
          type="button"
          onClick={handleCopyResults}
          className="inline-flex items-center gap-1.5 min-h-[36px] px-3 py-1.5 text-xs font-medium rounded border border-slate-700 bg-[#181C24] text-slate-200 hover:border-slate-500 hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-300">コピーしました</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-400" />
              <span>結果をコピー</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {slots.map((slot) => {
          const Icon = slot.icon;
          return (
            <div
              key={slot.rank}
              className={`rounded border px-4 py-3 flex items-center justify-between gap-3 transition-colors ${slot.cardStyle}`}
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`font-display text-sm font-bold tracking-wider ${slot.rankColor}`}>
                    {slot.rank}
                  </span>
                  <span className="text-slate-600 text-xs" aria-hidden="true">
                    /
                  </span>
                  <span className="text-xs font-medium text-slate-400">{slot.jpRank}</span>
                </div>
                <div className="mt-1">
                  {slot.name ? (
                    <p className="text-base sm:text-lg font-bold text-white truncate">
                      {slot.name}
                    </p>
                  ) : (
                    <p className="text-sm font-mono text-slate-500">
                      {slot.pendingHint}
                    </p>
                  )}
                </div>
              </div>

              <div className="w-9 h-9 rounded border border-slate-800 bg-[#10131A] flex items-center justify-center shrink-0">
                <Icon className={`w-4.5 h-4.5 ${slot.name ? slot.iconColor : 'text-slate-600'}`} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
