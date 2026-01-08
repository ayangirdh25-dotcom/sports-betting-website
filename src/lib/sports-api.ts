import { createClient } from '@supabase/supabase-js';
import { Match, initialMatches } from './betting-data';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function getActiveApiConfig() {
  const { data, error } = await supabase
    .from('api_configurations')
    .select('*')
    .eq('is_active', true)
    .single();

  if (error || !data) return null;
  return data;
}

export async function fetchSportsData(): Promise<Match[]> {
  try {
    const config = await getActiveApiConfig();
    
    if (!config || config.api_key === 'your-api-key-here' || !config.api_key) {
      console.log('No active API config found or using placeholder. Falling back to static data.');
      return initialMatches;
    }

    if (config.provider_type === 'the-odds-api') {
      return fetchFromTheOddsApi(config);
    }

    // Add more providers here
    
    return initialMatches;
  } catch (error) {
    console.error('Error fetching sports data:', error);
    return initialMatches;
  }
}

async function fetchFromTheOddsApi(config: any): Promise<Match[]> {
  const regions = 'eu'; // uk, us, eu, au
  const markets = 'h2h'; // h2h, spreads, totals
  const url = `${config.base_url}/v4/sports/upcoming/odds/?regions=${regions}&markets=${markets}&apiKey=${config.api_key}`;

  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch from The Odds API');
  
  const data = await response.json();
  
  // Transform The Odds API format to our Match format
  return data.map((item: any) => ({
    id: item.id,
    sport: item.sport_key,
    league: item.sport_title,
    homeTeam: { name: item.home_team, logo: '🏟️' },
    awayTeam: { name: item.away_team, logo: '🏟️' },
    odds: {
      home: item.bookmakers[0]?.markets[0]?.outcomes.find((o: any) => o.name === item.home_team)?.price || 1.0,
      draw: item.bookmakers[0]?.markets[0]?.outcomes.find((o: any) => o.name === 'Draw')?.price,
      away: item.bookmakers[0]?.markets[0]?.outcomes.find((o: any) => o.name === item.away_team)?.price || 1.0,
    },
    isLive: false,
    startTime: item.commence_time,
  }));
}
