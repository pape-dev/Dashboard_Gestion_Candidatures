/*
  # Création de la table des compétences utilisateur

  1. Nouvelles Tables
    - `user_skills`
      - `id` (uuid, primary key)
      - `user_id` (uuid, référence user_profiles)
      - `skill_name` (text)
      - `level` (integer) - niveau de 1 à 5
      - `category` (text) - technique, langue, soft skills
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Sécurité
    - Enable RLS sur `user_skills`
    - Politique pour que les utilisateurs accèdent seulement à leurs compétences
*/

CREATE TABLE IF NOT EXISTS user_skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  skill_name text NOT NULL,
  level integer DEFAULT 1 CHECK (level >= 1 AND level <= 5),
  category text DEFAULT 'technique' CHECK (category IN ('technique', 'langue', 'soft')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own skills"
  ON user_skills
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own skills"
  ON user_skills
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own skills"
  ON user_skills
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own skills"
  ON user_skills
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS user_skills_user_id_idx ON user_skills(user_id);
CREATE INDEX IF NOT EXISTS user_skills_category_idx ON user_skills(category);