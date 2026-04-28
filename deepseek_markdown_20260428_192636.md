# 🗄️ AquaWatch Database Setup Guide

## Overview
This guide migrates AquaWatch from browser LocalStorage to **Supabase** (a free, hosted PostgreSQL database with real-time capabilities). This means:
- Reports persist permanently (not lost when browser cache is cleared)
- Multiple users can see the same data in real-time
- Admin changes reflect instantly for all viewers
- Proper user authentication (optional, can add later)

---

## Why Supabase?

| Feature | LocalStorage (Current) | Supabase (New) |
|---------|----------------------|----------------|
| Data persistence | ❌ Lost on cache clear | ✅ Permanent |
| Multi-device sync | ❌ No | ✅ Real-time |
| File storage for photos | ❌ Base64 bloat | ✅ Proper image URLs |
| Row-level security | ❌ None | ✅ Built-in |
| Free tier | N/A | ✅ 500MB database + 1GB storage |

---

## Step 1: Create Supabase Project (5 minutes)

1. Go to https://supabase.com
2. Click **"Start your project"** (sign up with GitHub)
3. Create a new project:
   - Name: `aquawatch`
   - Database Password: `AquaWatch2024!` (save this)
   - Region: `Asia Pacific (Mumbai)` - closest to Bangalore
   - Pricing: **Free tier**
4. Wait 2 minutes for the database to provision
5. Go to **Project Settings > API**
6. Copy these two values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public key** (starts with `eyJ...`)
7. Save them - you'll paste these into the code later

---

## Step 2: Database Schema (SQL)

Go to **SQL Editor** in your Supabase dashboard. Click **"New Query"** and paste the ENTIRE SQL block below. Then click **"Run"**.

```sql
-- ============================================
-- AQUAWATCH DATABASE SCHEMA
-- Run this entire script in Supabase SQL Editor
-- ============================================

-- 1. Create the reports table
CREATE TABLE reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Report details
    category TEXT NOT NULL CHECK (category IN (
        '💧 Contaminated Water',
        '🔧 Broken Facility', 
        '🕳️ Open Drainage',
        '🧼 Lack of Hygiene',
        '⚠️ Other Issue'
    )),
    description TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'Open' CHECK (status IN ('Open', 'Investigating', 'Resolved')),
    
    -- Location
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    location_name TEXT DEFAULT '',
    
    -- Photo (stores Supabase Storage URL)
    photo_url TEXT DEFAULT '',
    
    -- Reporter info (optional, for future auth)
    reporter_name TEXT DEFAULT 'Anonymous',
    reporter_contact TEXT DEFAULT '',
    
    -- Gamification
    points INTEGER DEFAULT 10,
    upvotes INTEGER DEFAULT 0
);

-- 2. Create indexes for fast queries
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_category ON reports(category);
CREATE INDEX idx_reports_created_at ON reports(created_at DESC);
CREATE INDEX idx_reports_location ON reports USING GIST (
    ll_to_earth(latitude, longitude)
);

-- 3. Auto-update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_timestamp
    BEFORE UPDATE ON reports
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

-- 4. Create a view for dashboard stats
CREATE VIEW report_stats AS
SELECT
    COUNT(*) AS total_reports,
    COUNT(*) FILTER (WHERE status = 'Open') AS open_count,
    COUNT(*) FILTER (WHERE status = 'Investigating') AS investigating_count,
    COUNT(*) FILTER (WHERE status = 'Resolved') AS resolved_count,
    COUNT(*) FILTER (WHERE photo_url != '') AS with_photos_count,
    COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '24 hours') AS last_24h_count
FROM reports;

-- 5. Create a view for leaderboard
CREATE VIEW leaderboard AS
SELECT
    reporter_name,
    COUNT(*) AS total_reports,
    SUM(points) AS total_points,
    COUNT(*) FILTER (WHERE status = 'Resolved') AS resolved_count
FROM reports
GROUP BY reporter_name
ORDER BY total_points DESC
LIMIT 10;

-- 6. Enable Row Level Security (RLS)
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- 7. Create RLS policies (allow anyone to read and insert)
-- In production, you'd restrict to authenticated users
CREATE POLICY "Allow public read access"
    ON reports FOR SELECT
    USING (true);

CREATE POLICY "Allow public insert access"
    ON reports FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow public update access"
    ON reports FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- 8. Create a function to get nearby reports (for map clustering)
CREATE OR REPLACE FUNCTION get_nearby_reports(
    center_lat DOUBLE PRECISION,
    center_lng DOUBLE PRECISION,
    radius_km DOUBLE PRECISION DEFAULT 10
)
RETURNS TABLE (
    id UUID,
    category TEXT,
    description TEXT,
    status TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    photo_url TEXT,
    created_at TIMESTAMPTZ,
    distance_km DOUBLE PRECISION
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        r.id,
        r.category,
        r.description,
        r.status,
        r.latitude,
        r.longitude,
        r.photo_url,
        r.created_at,
        earth_distance(
            ll_to_earth(center_lat, center_lng),
            ll_to_earth(r.latitude, r.longitude)
        ) / 1000.0 AS distance_km
    FROM reports r
    WHERE earth_distance(
        ll_to_earth(center_lat, center_lng),
        ll_to_earth(r.latitude, r.longitude)
    ) <= radius_km * 1000
    ORDER BY distance_km ASC;
END;
$$ LANGUAGE plpgsql;

-- Note: The earth_distance function requires the earthdistance extension
-- Run this separately:
-- CREATE EXTENSION IF NOT EXISTS earthdistance CASCADE;