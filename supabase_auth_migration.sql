-- ============================================
-- GAJIAN NEST - Authentication Migration
-- ============================================
-- This migration adds authentication support with collaborative access
-- All authenticated users can create/edit/delete any nest
-- Non-authenticated users can only view via share links

-- ============================================
-- 1. ADD USER TRACKING COLUMNS
-- ============================================

-- Add user_id to track who created each nest
ALTER TABLE nests ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
ALTER TABLE nests ADD COLUMN IF NOT EXISTS created_by_email TEXT;

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_nests_user_id ON nests(user_id);

-- ============================================
-- 2. ENABLE ROW LEVEL SECURITY
-- ============================================

ALTER TABLE nests ENABLE ROW LEVEL SECURITY;
ALTER TABLE nest_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE nest_barang ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 3. NESTS TABLE POLICIES
-- ============================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view nests" ON nests;
DROP POLICY IF EXISTS "Authenticated users can create nests" ON nests;
DROP POLICY IF EXISTS "Authenticated users can update any nest" ON nests;
DROP POLICY IF EXISTS "Authenticated users can delete any nest" ON nests;

-- Policy: Anyone can read nests (for share links)
CREATE POLICY "Anyone can view nests"
  ON nests FOR SELECT
  USING (true);

-- Policy: Only authenticated users can create nests
CREATE POLICY "Authenticated users can create nests"
  ON nests FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Policy: Only authenticated users can update nests
CREATE POLICY "Authenticated users can update any nest"
  ON nests FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Policy: Only authenticated users can delete nests
CREATE POLICY "Authenticated users can delete any nest"
  ON nests FOR DELETE
  USING (auth.role() = 'authenticated');

-- ============================================
-- 4. NEST_PLAYERS TABLE POLICIES
-- ============================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view nest_players" ON nest_players;
DROP POLICY IF EXISTS "Authenticated users can manage nest_players" ON nest_players;

-- Policy: Anyone can read nest_players (for share links)
CREATE POLICY "Anyone can view nest_players"
  ON nest_players FOR SELECT
  USING (true);

-- Policy: Authenticated users can manage all nest_players
CREATE POLICY "Authenticated users can manage nest_players"
  ON nest_players FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ============================================
-- 5. NEST_BARANG TABLE POLICIES
-- ============================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view nest_barang" ON nest_barang;
DROP POLICY IF EXISTS "Authenticated users can manage nest_barang" ON nest_barang;

-- Policy: Anyone can read nest_barang (for share links)
CREATE POLICY "Anyone can view nest_barang"
  ON nest_barang FOR SELECT
  USING (true);

-- Policy: Authenticated users can manage all nest_barang
CREATE POLICY "Authenticated users can manage nest_barang"
  ON nest_barang FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ============================================
-- MIGRATION COMPLETE
-- ============================================
-- Next steps:
-- 1. Run this SQL in your Supabase SQL Editor
-- 2. Enable Email authentication in Supabase Dashboard
-- 3. Deploy the updated Next.js application
