/*
  # Création de la table des entretiens

  1. Nouvelles Tables
    - `interviews`
      - `id` (uuid, primary key)
      - `user_id` (uuid, référence user_profiles)
      - `application_id` (uuid, référence applications, optionnel)
      - `company` (text)
      - `position` (text)
      - `interview_date` (date)
      - `interview_time` (time)
      - `type` (text)
      - `location` (text)
      - `interviewer` (text)
      - `duration` (text)
      - `status` (text)
      - `notes` (text)
      - `meeting_link` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Sécurité
    - Enable RLS sur `interviews`
    - Politique pour que les utilisateurs accèdent seulement à leurs entretiens
*/

CREATE TABLE IF NOT EXISTS interviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  application_id uuid REFERENCES applications(id) ON DELETE SET NULL,
  company text NOT NULL,
  position text NOT NULL,
  interview_date date NOT NULL,
  interview_time time NOT NULL,
  type text DEFAULT 'Entretien RH',
  location text DEFAULT '',
  interviewer text DEFAULT '',
  duration text DEFAULT '1h',
  status text DEFAULT 'à confirmer' CHECK (status IN ('à confirmer', 'confirmé', 'en attente', 'reporté', 'annulé', 'terminé')),
  notes text DEFAULT '',
  meeting_link text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own interviews"
  ON interviews
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own interviews"
  ON interviews
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own interviews"
  ON interviews
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own interviews"
  ON interviews
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS interviews_user_id_idx ON interviews(user_id);
CREATE INDEX IF NOT EXISTS interviews_application_id_idx ON interviews(application_id);
CREATE INDEX IF NOT EXISTS interviews_date_idx ON interviews(interview_date);
CREATE INDEX IF NOT EXISTS interviews_status_idx ON interviews(status);