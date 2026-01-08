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
  startTime: string; // ISO string
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
  { id: 'cricket', name: 'Cricket', icon: '🏏' },
  { id: 'volleyball', name: 'Volleyball', icon: '🏐' },
  { id: 'hockey', name: 'Ice Hockey', icon: '🏒' },
  { id: 'formula1', name: 'Formula 1', icon: '🏎️' },
];

const today = new Date();
const getFutureDate = (hours: number) => {
  const d = new Date(today);
  d.setHours(d.getHours() + hours);
  return d.toISOString();
};

export const initialMatches: Match[] = [
  {
    id: '1',
    sport: 'football',
    league: 'Premier League',
    homeTeam: { name: 'Manchester City', logo: '🔵', score: 2 },
    awayTeam: { name: 'Liverpool', logo: '🔴', score: 1 },
    odds: { home: 1.85, draw: 3.40, away: 4.20 },
    isLive: true,
    startTime: getFutureDate(-2),
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
    startTime: getFutureDate(-1),
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
    startTime: getFutureDate(-1.5),
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
    startTime: getFutureDate(4),
  },
  {
    id: '5',
    sport: 'esports',
    league: 'League of Legends Worlds',
    homeTeam: { name: 'T1', logo: '🔴' },
    awayTeam: { name: 'Gen.G', logo: '🟡' },
    odds: { home: 1.75, away: 2.05 },
    isLive: false,
    startTime: getFutureDate(2),
  },
  {
    id: '6',
    sport: 'mma',
    league: 'UFC 310',
    homeTeam: { name: 'Adesanya', logo: '🇳🇬' },
    awayTeam: { name: 'Pereira', logo: '🇧🇷' },
    odds: { home: 2.40, away: 1.58 },
    isLive: false,
    startTime: getFutureDate(10),
  },
  {
    id: '7',
    sport: 'football',
    league: 'Champions League',
    homeTeam: { name: 'Bayern Munich', logo: '🔴', score: 3 },
    awayTeam: { name: 'PSG', logo: '🔵', score: 2 },
    odds: { home: 1.55, draw: 4.00, away: 5.50 },
    isLive: true,
    startTime: getFutureDate(-1.8),
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
    startTime: getFutureDate(8),
  },
  {
    id: '9',
    sport: 'cricket',
    league: 'IPL',
    homeTeam: { name: 'Mumbai Indians', logo: '🏏' },
    awayTeam: { name: 'CSK', logo: '🦁' },
    odds: { home: 1.90, away: 1.90 },
    isLive: false,
    startTime: getFutureDate(6),
  },
  {
    id: '10',
    sport: 'formula1',
    league: 'Abu Dhabi GP',
    homeTeam: { name: 'Max Verstappen', logo: '🏎️' },
    awayTeam: { name: 'Lewis Hamilton', logo: '🏎️' },
    odds: { home: 1.50, away: 3.50 },
    isLive: false,
    startTime: getFutureDate(5),
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
