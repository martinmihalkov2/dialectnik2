import { createClient } from '@supabase/supabase-js';
import { mockRegions, mockWords } from './mockData';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

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

// ---------------------------------------------------------------------------
// Client selection.
//
// When VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are set, we use the real
// Supabase client. Otherwise we fall back to an in-memory mock that mimics the
// small slice of the query-builder API this app uses, so the UI runs
// standalone with no backend. See src/lib/mockData.ts for the sample content.
// ---------------------------------------------------------------------------

type QueryResult<T> = { data: T | null; error: { message: string } | null };

// A minimal chainable query builder over an in-memory array. It supports only
// the operators used in App.tsx: select, eq, ilike, order, limit — and is
// awaitable (thenable), resolving to { data, error }.
class MockQuery<T extends Record<string, unknown>> implements PromiseLike<QueryResult<T[]>> {
  private rows: T[];
  private withRegions = false;

  constructor(rows: T[]) {
    this.rows = [...rows];
  }

  select(columns = '*') {
    // e.g. '*, regions(*)' — embed the related region on each row.
    if (columns.includes('regions')) this.withRegions = true;
    return this;
  }

  eq(column: keyof T, value: unknown) {
    this.rows = this.rows.filter((r) => r[column] === value);
    return this;
  }

  ilike(column: keyof T, pattern: string) {
    const needle = pattern.replace(/%/g, '').toLowerCase();
    this.rows = this.rows.filter((r) =>
      String(r[column] ?? '').toLowerCase().includes(needle)
    );
    return this;
  }

  order(column: keyof T) {
    this.rows = [...this.rows].sort((a, b) => {
      const av = a[column];
      const bv = b[column];
      if (typeof av === 'number' && typeof bv === 'number') return av - bv;
      return String(av).localeCompare(String(bv), 'bg');
    });
    return this;
  }

  limit(n: number) {
    this.rows = this.rows.slice(0, n);
    return this;
  }

  private resolveRows(): T[] {
    if (!this.withRegions) return this.rows;
    return this.rows.map((r) => ({
      ...r,
      regions: mockRegions.find((reg) => reg.id === (r as { region_id?: number }).region_id) ?? null,
    })) as T[];
  }

  then<R1 = QueryResult<T[]>, R2 = never>(
    onfulfilled?: ((value: QueryResult<T[]>) => R1 | PromiseLike<R1>) | null,
    onrejected?: ((reason: unknown) => R2 | PromiseLike<R2>) | null
  ): PromiseLike<R1 | R2> {
    const result: QueryResult<T[]> = { data: this.resolveRows(), error: null };
    return Promise.resolve(result).then(onfulfilled, onrejected);
  }
}

const mockClient = {
  from(table: string) {
    if (table === 'regions') return new MockQuery<Record<string, unknown>>(mockRegions as unknown as Record<string, unknown>[]);
    if (table === 'dialect_words') return new MockQuery<Record<string, unknown>>(mockWords as unknown as Record<string, unknown>[]);
    return new MockQuery<Record<string, unknown>>([]);
  },
};

// Mock mode is the DEFAULT: the original Supabase backend is no longer
// available, so the deployed app would otherwise hang on "loading...". To use a
// real database you must explicitly opt in with VITE_USE_SUPABASE=true AND
// provide both credentials (see .env.example).
const useMock = import.meta.env.VITE_USE_SUPABASE !== 'true' || !supabaseUrl || !supabaseAnonKey;

if (useMock) {
  // eslint-disable-next-line no-console
  console.info(
    '[dialectnik] Running with in-memory mock data (demo mode). ' +
      'To use a real database, set VITE_USE_SUPABASE=true plus VITE_SUPABASE_URL ' +
      'and VITE_SUPABASE_ANON_KEY (see .env.example).'
  );
}

export const supabase = useMock
  ? (mockClient as unknown as ReturnType<typeof createClient>)
  : createClient(supabaseUrl, supabaseAnonKey);
