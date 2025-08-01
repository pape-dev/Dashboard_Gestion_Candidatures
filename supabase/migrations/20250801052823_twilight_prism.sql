/*
  # Création de la table des contacts

  1. Nouvelles Tables
    - `contacts`
      - `id` (uuid, primary key)
      - `user_id` (uuid, référence user_profiles)
      - `name` (text)
      - `email` (text)
      - `phone` (text)
      - `company` (text)
      - `position` (text)
      - `notes` (text)
      - `linkedin_url` (text)
      - `last_contact_date` (date)
      - `avatar_url` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Sécurité
    - Enable RLS sur `contacts`
    - Politique pour que les utilisateurs accèdent seulement à leurs contacts
*/

CREATE TABLE IF NOT EXISTS contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  email text DEFAULT '',
  phone text DEFAULT '',
  company text DEFAULT '',
  position text DEFAULT '',
  notes text DEFAULT '',
  linkedin_url text DEFAULT '',
  last_contact_date date,
  avatar_url text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own contacts"
  ON contacts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own contacts"
  ON contacts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own contacts"
  ON contacts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own contacts"
  ON contacts
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS contacts_user_id_idx ON contacts(user_id);
CREATE INDEX IF NOT EXISTS contacts_company_idx ON contacts(company);
CREATE INDEX IF NOT EXISTS contacts_email_idx ON contacts(email);