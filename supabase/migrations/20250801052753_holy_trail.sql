/*
  # Création de la table des candidatures

  1. Nouvelles Tables
    - `applications`
      - `id` (uuid, primary key)
      - `user_id` (uuid, référence user_profiles)
      - `company` (text)
      - `position` (text)
      - `location` (text)
      - `status` (text)
      - `applied_date` (date)
      - `salary_min` (integer)
      - `salary_max` (integer)
      - `salary_currency` (text)
      - `description` (text)
      - `priority` (text)
      - `contact_person` (text)
      - `contact_email` (text)
      - `next_step` (text)
      - `job_url` (text)
      - `company_logo_url` (text)
      - `notes` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Sécurité
    - Enable RLS sur `applications`
    - Politique pour que les utilisateurs accèdent seulement à leurs candidatures
*/

CREATE TABLE IF NOT EXISTS applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  company text NOT NULL,
  position text NOT NULL,
  location text DEFAULT '',
  status text DEFAULT 'En cours' CHECK (status IN ('En cours', 'Entretien', 'En attente', 'Accepté', 'Refusé')),
  applied_date date DEFAULT CURRENT_DATE,
  salary_min integer,
  salary_max integer,
  salary_currency text DEFAULT '€',
  description text DEFAULT '',
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  contact_person text DEFAULT '',
  contact_email text DEFAULT '',
  next_step text DEFAULT '',
  job_url text DEFAULT '',
  company_logo_url text DEFAULT '',
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own applications"
  ON applications
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own applications"
  ON applications
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own applications"
  ON applications
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own applications"
  ON applications
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS applications_user_id_idx ON applications(user_id);
CREATE INDEX IF NOT EXISTS applications_status_idx ON applications(status);
CREATE INDEX IF NOT EXISTS applications_applied_date_idx ON applications(applied_date);