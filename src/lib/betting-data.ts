export interface Team {
  name: string;
  logo: string;
  score?: number;
}

export interface Odds {
  home: number;
  draw?: number;
  away: number;
}

export interface Match {
  id: string;
  sport: string;
  league: string;
  homeTeam: Team;
  awayTeam: Team;
  odds: Odds;
  isLive: boolean;
  startTime: string;
  minute?: number;
}

export interface BetSlipItem {
  matchId: string;
  selection: 'home' | 'draw' | 'away';
  odds: number;
  stake: number;
  matchInfo: string;
  selectionName: string;
}

export const sportsCategories = [
  { id: 'football', name: 'Football', icon: '⚽' },
  { id: 'basketball', name: 'Basketball', icon: '🏀' },
  { id: 'tennis', name: 'Tennis', icon: '🎾' },
  { id: 'esports', name: 'Esports', icon: '🎮' },
  { id: 'mma', name: 'MMA', icon: '🥊' },
  { id: 'baseball', name: 'Baseball', icon: '⚾' },
];

export const initialMatches: Match[] = [
  {
    id: '1',
    sport: 'football',
    league: 'Premier League',
    homeTeam: { name: 'Manchester City', logo: '🔵', score: 2 },
    awayTeam: { name: 'Liverpool', logo: '🔴', score: 1 },
    odds: { home: 1.85, draw: 3.40, away: 4.20 },
    isLive: true,
    startTime: '15:00',
    minute: 67,
  },
  {
    id: '2',
    sport: 'football',
    league: 'La Liga',
    homeTeam: { name: 'Real Madrid', logo: '⚪', score: 0 },
    awayTeam: { name: 'Barcelona', logo: '🟣', score: 0 },
    odds: { home: 2.10, draw: 3.25, away: 3.50 },
    isLive: true,
    startTime: '20:00',
    minute: 23,
  },
  {
    id: '3',
    sport: 'basketball',
    league: 'NBA',
    homeTeam: { name: 'Lakers', logo: '💛', score: 89 },
    awayTeam: { name: 'Celtics', logo: '💚', score: 94 },
    odds: { home: 1.95, away: 1.85 },
    isLive: true,
    startTime: '19:30',
    minute: 38,
  },
  {
    id: '4',
    sport: 'tennis',
    league: 'ATP Finals',
    homeTeam: { name: 'Djokovic', logo: '🇷🇸' },
    awayTeam: { name: 'Alcaraz', logo: '🇪🇸' },
    odds: { home: 1.65, away: 2.25 },
    isLive: false,
    startTime: '18:00',
  },
  {
    id: '5',
    sport: 'esports',
    league: 'League of Legends Worlds',
    homeTeam: { name: 'T1', logo: '🔴' },
    awayTeam: { name: 'Gen.G', logo: '🟡' },
    odds: { home: 1.75, away: 2.05 },
    isLive: false,
    startTime: '14:00',
  },
  {
    id: '6',
    sport: 'mma',
    league: 'UFC 310',
    homeTeam: { name: 'Adesanya', logo: '🇳🇬' },
    awayTeam: { name: 'Pereira', logo: '🇧🇷' },
    odds: { home: 2.40, away: 1.58 },
    isLive: false,
    startTime: '22:00',
  },
  {
    id: '7',
    sport: 'football',
    league: 'Champions League',
    homeTeam: { name: 'Bayern Munich', logo: '🔴', score: 3 },
    awayTeam: { name: 'PSG', logo: '🔵', score: 2 },
    odds: { home: 1.55, draw: 4.00, away: 5.50 },
    isLive: true,
    startTime: '21:00',
    minute: 82,
  },
  {
    id: '8',
    sport: 'basketball',
    league: 'EuroLeague',
    homeTeam: { name: 'Real Madrid', logo: '⚪' },
    awayTeam: { name: 'Olympiacos', logo: '🔴' },
    odds: { home: 1.45, away: 2.70 },
    isLive: false,
    startTime: '20:45',
  },
];

export function generateOddsChange(currentOdds: number): number {
  const change = (Math.random() - 0.5) * 0.15;
  const newOdds = currentOdds + change;
  return Math.max(1.01, Math.round(newOdds * 100) / 100);
}

export function formatOdds(odds: number): string {
  return odds.toFixed(2);
}
