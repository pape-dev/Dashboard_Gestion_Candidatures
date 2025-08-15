/*
  # Création de la table des tâches

  1. Nouvelles Tables
    - `tasks`
      - `id` (uuid, primary key)
      - `user_id` (uuid, référence user_profiles)
      - `application_id` (uuid, référence applications, optionnel)
      - `title` (text)
      - `description` (text)
      - `due_date` (date)
      - `priority` (text)
      - `status` (text)
      - `category` (text)
      - `completed` (boolean)
      - `completed_at` (timestamp)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Sécurité
    - Enable RLS sur `tasks`
    - Politique pour que les utilisateurs accèdent seulement à leurs tâches
*/

CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  application_id uuid REFERENCES applications(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text DEFAULT '',
  due_date date,
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  status text DEFAULT 'todo' CHECK (status IN ('todo', 'in-progress', 'completed')),
  category text DEFAULT 'other' CHECK (category IN ('application', 'interview', 'follow-up', 'research', 'other')),
  completed boolean DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own tasks"
  ON tasks
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tasks"
  ON tasks
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tasks"
  ON tasks
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tasks"
  ON tasks
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS tasks_user_id_idx ON tasks(user_id);
CREATE INDEX IF NOT EXISTS tasks_application_id_idx ON tasks(application_id);
CREATE INDEX IF NOT EXISTS tasks_due_date_idx ON tasks(due_date);
CREATE INDEX IF NOT EXISTS tasks_status_idx ON tasks(status);
CREATE INDEX IF NOT EXISTS tasks_completed_idx ON tasks(completed);