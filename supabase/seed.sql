-- Comprehensive seed data for Jovie
-- This file contains all seed data consolidated from migration files
-- Run this after the schema migrations to populate the database with test data

-- Import artist seed data
\i seed_artists.sql

-- Import social links seed data
\i seed_social_links.sql

-- Import releases seed data
\i seed_releases.sql
