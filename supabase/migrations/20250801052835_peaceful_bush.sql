/*
  # Création de la table des expériences professionnelles

  1. Nouvelles Tables
    - `experiences`
      - `id` (uuid, primary key)
      - `user_id` (uuid, référence user_profiles)
      - `title` (text)
      - `company` (text)
      - `location` (text)
      - `start_date` (date)
      - `end_date` (date, optionnel)
      - `is_current` (boolean)
      - `description` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Sécurité
    - Enable RLS sur `experiences`
    - Politique pour que les utilisateurs accèdent seulement à leurs expériences
*/

CREATE TABLE IF NOT EXISTS experiences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  company text NOT NULL,
  location text DEFAULT '',
  start_date date NOT NULL,
  end_date date,
  is_current boolean DEFAULT false,
  description text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own experiences"
  ON experiences
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own experiences"
  ON experiences
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own experiences"
  ON experiences
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own experiences"
  ON experiences
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS experiences_user_id_idx ON experiences(user_id);
CREATE INDEX IF NOT EXISTS experiences_start_date_idx ON experiences(start_date);