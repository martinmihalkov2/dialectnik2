/*
# Create dialect words schema (single-tenant, no auth)

1. New Tables
- `regions` — id (serial PK), name (text), description (text), gradient (text for CSS gradient classes)
- `dialect_words` — id (serial PK), region_id (FK to regions), word (text), meaning (text), example (text, optional)
2. Security
- Enable RLS on both tables.
- Allow anon + authenticated CRUD because the data is intentionally shared/public (no sign-in).
3. Notes
- Single-tenant app: no user_id, no auth.
- Each region has ~35 dialect words.
- `gradient` stores Tailwind gradient class names for distinct backgrounds per region.
*/

CREATE TABLE IF NOT EXISTS regions (
  id serial PRIMARY KEY,
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  gradient text NOT NULL DEFAULT 'from-slate-700 to-slate-900',
  accent text NOT NULL DEFAULT 'amber',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS dialect_words (
  id serial PRIMARY KEY,
  region_id integer NOT NULL REFERENCES regions(id) ON DELETE CASCADE,
  word text NOT NULL,
  meaning text NOT NULL,
  example text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE dialect_words ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_regions" ON regions;
CREATE POLICY "anon_select_regions" ON regions FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_regions" ON regions;
CREATE POLICY "anon_insert_regions" ON regions FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_regions" ON regions;
CREATE POLICY "anon_update_regions" ON regions FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_regions" ON regions;
CREATE POLICY "anon_delete_regions" ON regions FOR DELETE
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_select_words" ON dialect_words;
CREATE POLICY "anon_select_words" ON dialect_words FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_words" ON dialect_words;
CREATE POLICY "anon_insert_words" ON dialect_words FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_words" ON dialect_words;
CREATE POLICY "anon_update_words" ON dialect_words FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_words" ON dialect_words;
CREATE POLICY "anon_delete_words" ON dialect_words FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_dialect_words_region_id ON dialect_words(region_id);
CREATE INDEX IF NOT EXISTS idx_dialect_words_word ON dialect_words(word);
