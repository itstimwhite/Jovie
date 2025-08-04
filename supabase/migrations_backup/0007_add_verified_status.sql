-- Add verified status to artists table
-- This migration adds an is_verified column to track verified artist profiles

-- Add the is_verified column
alter table artists 
add column is_verified boolean default false;

-- Add an index for better query performance
create index idx_artists_verified on artists(is_verified);

-- Verify Tim White as the first verified artist
update artists 
set is_verified = true 
where handle = 'tim'; 