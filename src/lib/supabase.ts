import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Region = {
  id: number;
  name: string;
  description: string;
  gradient: string;
  accent: string;
};

export type DialectWord = {
  id: number;
  region_id: number;
  word: string;
  meaning: string;
  example: string;
};

export type WordWithRegion = DialectWord & {
  regions: Region;
};
