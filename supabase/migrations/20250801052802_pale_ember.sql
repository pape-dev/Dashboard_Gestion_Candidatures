/*
  # Création de la table des tags/compétences

  1. Nouvelles Tables
    - `application_tags`
      - `id` (uuid, primary key)
      - `application_id` (uuid, référence applications)
      - `tag` (text)
      - `created_at` (timestamp)

  2. Sécurité
    - Enable RLS sur `application_tags`
    - Politique basée sur l'ownership de l'application
*/

CREATE TABLE IF NOT EXISTS application_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid REFERENCES applications(id) ON DELETE CASCADE NOT NULL,
  tag text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE application_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own application tags"
  ON application_tags
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM applications 
      WHERE applications.id = application_tags.application_id 
      AND applications.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own application tags"
  ON application_tags
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM applications 
      WHERE applications.id = application_tags.application_id 
      AND applications.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own application tags"
  ON application_tags
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM applications 
      WHERE applications.id = application_tags.application_id 
      AND applications.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own application tags"
  ON application_tags
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM applications 
      WHERE applications.id = application_tags.application_id 
      AND applications.user_id = auth.uid()
    )
  );

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS application_tags_application_id_idx ON application_tags(application_id);
CREATE INDEX IF NOT EXISTS application_tags_tag_idx ON application_tags(tag);