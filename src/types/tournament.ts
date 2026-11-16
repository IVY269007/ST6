export type PlayerId = 'p1' | 'p2' | 'p3' | 'p4' | 'p5' | 'p6' | 'p7' | 'p8';

export type MatchId =
  | 'a1'
  | 'a2'
  | 'a3'
  | 'a4'
  | 'b1'
  | 'b2'
  | 'b3'
  | 'b4'
  | 'c1'
  | 'c2'
  | 'c3'
  | 'd1'
  | 'e1'
  | 'f1'
  | 'f2';

export type BracketSection = 'winners' | 'losers' | 'grand_final';

export type MatchSide = 'top' | 'bottom';

export type SlotSource =
  | { type: 'seed'; playerId: PlayerId; seedNumber: number }
  | { type: 'winner'; matchId: MatchId; label: string }
  | { type: 'loser'; matchId: MatchId; label: string };

export interface MatchDefinition {
  id: MatchId;
  bracket: BracketSection;
  roundTitle: string;
  shortCode: string;
  topSource: SlotSource;
  bottomSource: SlotSource;
  winnerTargetLabel: string;
  loserTargetLabel: string;
}

export interface ResolvedMatch {
  definition: MatchDefinition;
  topPlayerId: PlayerId | null;
  bottomPlayerId: PlayerId | null;
  topName: string | null;
  bottomName: string | null;
  topPlaceholder: string;
  bottomPlaceholder: string;
  selectedWinnerSide: MatchSide | null;
  winnerId: PlayerId | null;
  loserId: PlayerId | null;
  isReady: boolean;
  isDecided: boolean;
}

export interface PodiumStandings {
  first: PlayerId | null;
  second: PlayerId | null;
  third: PlayerId | null;
}

export interface TournamentState {
  title: string;
  players: Record<PlayerId, string>;
  winners: Partial<Record<MatchId, MatchSide>>;
  gfResetEnabled: boolean;
}
