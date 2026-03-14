-- Add training_done to neuroscore_entries (Entrenamiento Mental Diario)
-- Run in Supabase SQL Editor if using neuroscore API with logged-in users

ALTER TABLE neuroscore_entries
ADD COLUMN IF NOT EXISTS training_done boolean DEFAULT false;
