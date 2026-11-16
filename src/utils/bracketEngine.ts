import type {
  MatchDefinition,
  MatchId,
  MatchSide,
  PlayerId,
  PodiumStandings,
  ResolvedMatch,
  SlotSource,
  TournamentState,
} from '../types/tournament';

export const PLAYER_IDS: PlayerId[] = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8'];

export const DEFAULT_PLAYERS: Record<PlayerId, string> = {
  p1: '仲野颯汰',
  p2: '木野連翔',
  p3: '高田温揮',
  p4: '伊藤大毅',
  p5: '工藤海吏',
  p6: '篠田靖希',
  p7: '柏原拓武',
  p8: '成安柊斗',
};

export const DEFAULT_TOURNAMENT_TITLE = 'STREET FIGHTER6 C TECK CUP';

export const MATCH_ORDER: MatchId[] = [
  'a1',
  'a2',
  'a3',
  'a4',
  'b1',
  'b2',
  'b3',
  'b4',
  'c1',
  'c2',
  'c3',
  'd1',
  'e1',
  'f1',
  'f2',
];

export const MATCH_DEFINITIONS: Record<MatchId, MatchDefinition> = {
  a1: {
    id: 'a1',
    bracket: 'winners',
    roundTitle: 'ウィナーズ 1回戦',
    shortCode: 'WR1',
    topSource: { type: 'seed', playerId: 'p1', seedNumber: 1 },
    bottomSource: { type: 'seed', playerId: 'p2', seedNumber: 2 },
    winnerTargetLabel: '勝者 → b1',
    loserTargetLabel: '敗者 → b3',
  },
  a2: {
    id: 'a2',
    bracket: 'winners',
    roundTitle: 'ウィナーズ 1回戦',
    shortCode: 'WR1',
    topSource: { type: 'seed', playerId: 'p3', seedNumber: 3 },
    bottomSource: { type: 'seed', playerId: 'p4', seedNumber: 4 },
    winnerTargetLabel: '勝者 → b1',
    loserTargetLabel: '敗者 → b3',
  },
  a3: {
    id: 'a3',
    bracket: 'winners',
    roundTitle: 'ウィナーズ 1回戦',
    shortCode: 'WR1',
    topSource: { type: 'seed', playerId: 'p5', seedNumber: 5 },
    bottomSource: { type: 'seed', playerId: 'p6', seedNumber: 6 },
    winnerTargetLabel: '勝者 → b2',
    loserTargetLabel: '敗者 → b4',
  },
  a4: {
    id: 'a4',
    bracket: 'winners',
    roundTitle: 'ウィナーズ 1回戦',
    shortCode: 'WR1',
    topSource: { type: 'seed', playerId: 'p7', seedNumber: 7 },
    bottomSource: { type: 'seed', playerId: 'p8', seedNumber: 8 },
    winnerTargetLabel: '勝者 → b2',
    loserTargetLabel: '敗者 → b4',
  },
  b1: {
    id: 'b1',
    bracket: 'winners',
    roundTitle: 'ウィナーズ 準決勝',
    shortCode: 'WSF',
    topSource: { type: 'winner', matchId: 'a1', label: 'a1 winner' },
    bottomSource: { type: 'winner', matchId: 'a2', label: 'a2 winner' },
    winnerTargetLabel: '勝者 → c1',
    loserTargetLabel: '敗者 → c2',
  },
  b2: {
    id: 'b2',
    bracket: 'winners',
    roundTitle: 'ウィナーズ 準決勝',
    shortCode: 'WSF',
    topSource: { type: 'winner', matchId: 'a3', label: 'a3 winner' },
    bottomSource: { type: 'winner', matchId: 'a4', label: 'a4 winner' },
    winnerTargetLabel: '勝者 → c1',
    loserTargetLabel: '敗者 → c3',
  },
  b3: {
    id: 'b3',
    bracket: 'losers',
    roundTitle: 'ルーザーズ 1回戦',
    shortCode: 'LR1',
    topSource: { type: 'loser', matchId: 'a1', label: 'a1 loser' },
    bottomSource: { type: 'loser', matchId: 'a2', label: 'a2 loser' },
    winnerTargetLabel: '勝者 → c2',
    loserTargetLabel: '敗者 敗退 (7位タイ)',
  },
  b4: {
    id: 'b4',
    bracket: 'losers',
    roundTitle: 'ルーザーズ 1回戦',
    shortCode: 'LR1',
    topSource: { type: 'loser', matchId: 'a3', label: 'a3 loser' },
    bottomSource: { type: 'loser', matchId: 'a4', label: 'a4 loser' },
    winnerTargetLabel: '勝者 → c3',
    loserTargetLabel: '敗者 敗退 (7位タイ)',
  },
  c1: {
    id: 'c1',
    bracket: 'winners',
    roundTitle: 'ウィナーズ 決勝',
    shortCode: 'WF',
    topSource: { type: 'winner', matchId: 'b1', label: 'b1 winner' },
    bottomSource: { type: 'winner', matchId: 'b2', label: 'b2 winner' },
    winnerTargetLabel: '勝者 → f1',
    loserTargetLabel: '敗者 → e1',
  },
  c2: {
    id: 'c2',
    bracket: 'losers',
    roundTitle: 'ルーザーズ 2回戦',
    shortCode: 'LR2',
    topSource: { type: 'loser', matchId: 'b1', label: 'b1 loser' },
    bottomSource: { type: 'winner', matchId: 'b3', label: 'b3 winner' },
    winnerTargetLabel: '勝者 → d1',
    loserTargetLabel: '敗者 敗退 (5位タイ)',
  },
  c3: {
    id: 'c3',
    bracket: 'losers',
    roundTitle: 'ルーザーズ 2回戦',
    shortCode: 'LR2',
    topSource: { type: 'loser', matchId: 'b2', label: 'b2 loser' },
    bottomSource: { type: 'winner', matchId: 'b4', label: 'b4 winner' },
    winnerTargetLabel: '勝者 → d1',
    loserTargetLabel: '敗者 敗退 (5位タイ)',
  },
  d1: {
    id: 'd1',
    bracket: 'losers',
    roundTitle: 'ルーザーズ 準決勝',
    shortCode: 'LSF',
    topSource: { type: 'winner', matchId: 'c2', label: 'c2 winner' },
    bottomSource: { type: 'winner', matchId: 'c3', label: 'c3 winner' },
    winnerTargetLabel: '勝者 → e1',
    loserTargetLabel: '敗者 敗退 (4位)',
  },
  e1: {
    id: 'e1',
    bracket: 'losers',
    roundTitle: 'ルーザーズ 決勝',
    shortCode: 'LF',
    topSource: { type: 'loser', matchId: 'c1', label: 'c1 loser' },
    bottomSource: { type: 'winner', matchId: 'd1', label: 'd1 winner' },
    winnerTargetLabel: '勝者 → f1',
    loserTargetLabel: '敗者 3位確定',
  },
  f1: {
    id: 'f1',
    bracket: 'grand_final',
    roundTitle: 'グランドファイナル',
    shortCode: 'GF',
    topSource: { type: 'winner', matchId: 'c1', label: 'c1 winner' },
    bottomSource: { type: 'winner', matchId: 'e1', label: 'e1 winner' },
    winnerTargetLabel: '勝者 優勝 (1位)',
    loserTargetLabel: '敗者 準優勝 (2位)',
  },
  f2: {
    id: 'f2',
    bracket: 'grand_final',
    roundTitle: 'グランドファイナル リセット',
    shortCode: 'GFR',
    topSource: { type: 'winner', matchId: 'c1', label: 'c1 winner' },
    bottomSource: { type: 'winner', matchId: 'e1', label: 'e1 winner' },
    winnerTargetLabel: '勝者 優勝 (1位)',
    loserTargetLabel: '敗者 準優勝 (2位)',
  },
};

export function createInitialTournamentState(): TournamentState {
  return {
    title: DEFAULT_TOURNAMENT_TITLE,
    players: { ...DEFAULT_PLAYERS },
    winners: {},
    gfResetEnabled: false,
  };
}

function getSourcePlaceholder(source: SlotSource): string {
  if (source.type === 'seed') {
    return `選手 ${source.seedNumber}`;
  }
  return source.label;
}

function resolveSlotPlayer(
  source: SlotSource,
  resolved: Partial<Record<MatchId, ResolvedMatch>>
): PlayerId | null {
  if (source.type === 'seed') {
    return source.playerId;
  }
  const upstream = resolved[source.matchId];
  if (!upstream) return null;
  return source.type === 'winner' ? upstream.winnerId : upstream.loserId;
}

export function resolveBracket(state: TournamentState): {
  matches: Record<MatchId, ResolvedMatch>;
  podium: PodiumStandings;
  isResetRequired: boolean;
  completedCount: number;
  totalCount: number;
} {
  const matches = {} as Record<MatchId, ResolvedMatch>;

  for (const id of MATCH_ORDER) {
    const def = MATCH_DEFINITIONS[id];
    const topPlayerId = resolveSlotPlayer(def.topSource, matches);
    const bottomPlayerId = resolveSlotPlayer(def.bottomSource, matches);

    const topName = topPlayerId ? state.players[topPlayerId]?.trim() || `選手 ${topPlayerId.slice(1)}` : null;
    const bottomName = bottomPlayerId
      ? state.players[bottomPlayerId]?.trim() || `選手 ${bottomPlayerId.slice(1)}`
      : null;

    const isReady = Boolean(topPlayerId && bottomPlayerId);
    const rawSide = state.winners[id] ?? null;
    const selectedWinnerSide = isReady && rawSide ? rawSide : null;

    const winnerId =
      selectedWinnerSide === 'top'
        ? topPlayerId
        : selectedWinnerSide === 'bottom'
          ? bottomPlayerId
          : null;

    const loserId =
      selectedWinnerSide === 'top'
        ? bottomPlayerId
        : selectedWinnerSide === 'bottom'
          ? topPlayerId
          : null;

    matches[id] = {
      definition: def,
      topPlayerId,
      bottomPlayerId,
      topName,
      bottomName,
      topPlaceholder: getSourcePlaceholder(def.topSource),
      bottomPlaceholder: getSourcePlaceholder(def.bottomSource),
      selectedWinnerSide,
      winnerId,
      loserId,
      isReady,
      isDecided: Boolean(winnerId && loserId),
    };
  }

  const f1 = matches.f1;
  const f2 = matches.f2;
  const isResetRequired = Boolean(
    state.gfResetEnabled && f1.isDecided && f1.selectedWinnerSide === 'bottom'
  );

  let first: PlayerId | null = null;
  let second: PlayerId | null = null;
  const third: PlayerId | null = matches.e1.loserId;

  if (isResetRequired) {
    if (f2.isDecided) {
      first = f2.winnerId;
      second = f2.loserId;
    }
  } else if (f1.isDecided) {
    first = f1.winnerId;
    second = f1.loserId;
  }

  const activeMatches = MATCH_ORDER.filter((id) => id !== 'f2' || isResetRequired);
  const completedCount = activeMatches.filter((id) => matches[id].isDecided).length;

  return {
    matches,
    podium: { first, second, third },
    isResetRequired,
    completedCount,
    totalCount: activeMatches.length,
  };
}

/**
 * Selects (or toggles off) the winner of a match and automatically clears any
 * downstream match selections whose participants changed or became invalid.
 */
export function selectMatchWinner(
  state: TournamentState,
  matchId: MatchId,
  side: MatchSide
): TournamentState {
  const before = resolveBracket(state);
  const targetMatch = before.matches[matchId];
  if (!targetMatch.isReady) {
    return state;
  }

  const nextWinners: Partial<Record<MatchId, MatchSide>> = { ...state.winners };

  if (nextWinners[matchId] === side) {
    delete nextWinners[matchId];
  } else {
    nextWinners[matchId] = side;
  }

  let candidate: TournamentState = {
    ...state,
    winners: nextWinners,
  };

  // Iteratively sanitize downstream matches if their entrants changed
  const targetIdx = MATCH_ORDER.indexOf(matchId);
  for (let i = targetIdx + 1; i < MATCH_ORDER.length; i++) {
    const downstreamId = MATCH_ORDER[i];
    const resolvedNow = resolveBracket(candidate);
    const prevM = before.matches[downstreamId];
    const currM = resolvedNow.matches[downstreamId];

    const entrantsChanged =
      prevM.topPlayerId !== currM.topPlayerId ||
      prevM.bottomPlayerId !== currM.bottomPlayerId ||
      !currM.isReady;

    const resetInvalid =
      downstreamId === 'f2' && (!candidate.gfResetEnabled || resolvedNow.matches.f1.selectedWinnerSide !== 'bottom');

    if ((entrantsChanged || resetInvalid) && candidate.winners[downstreamId]) {
      const cleaned = { ...candidate.winners };
      delete cleaned[downstreamId];
      candidate = { ...candidate, winners: cleaned };
    }
  }

  return candidate;
}

export function clearMatchWinner(state: TournamentState, matchId: MatchId): TournamentState {
  const existing = state.winners[matchId];
  if (!existing) return state;
  return selectMatchWinner(state, matchId, existing);
}
