-- Migration pour améliorer le système de profil
-- Ajout des tables pour expériences, compétences, documents et analytics

-- Table des expériences professionnelles
CREATE TABLE IF NOT EXISTS experiences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  company text NOT NULL,
  location text,
  start_date date NOT NULL,
  end_date date,
  is_current boolean DEFAULT false,
  description text,
  achievements text[],
  technologies text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table des compétences utilisateur
CREATE TABLE IF NOT EXISTS user_skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  skill_name text NOT NULL,
  level integer CHECK (level >= 1 AND level <= 5),
  category text,
  years_of_experience integer,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table des documents (CV, portfolio, etc.)
CREATE TABLE IF NOT EXISTS user_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  type text NOT NULL, -- 'cv', 'portfolio', 'certificate', 'other'
  file_url text NOT NULL,
  file_size integer,
  mime_type text,
  description text,
  is_public boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table des réseaux sociaux
CREATE TABLE IF NOT EXISTS user_social_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  platform text NOT NULL, -- 'linkedin', 'github', 'twitter', 'website', 'portfolio'
  url text NOT NULL,
  is_public boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table des analytics de profil
CREATE TABLE IF NOT EXISTS profile_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_views integer DEFAULT 0,
  cv_downloads integer DEFAULT 0,
  last_profile_update timestamptz,
  profile_completion_percentage integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Amélioration de la table user_profiles
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS cv_url text;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS portfolio_url text;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS github_url text;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS twitter_url text;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS years_of_experience integer;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS preferred_work_type text[]; -- ['remote', 'hybrid', 'onsite']
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS salary_expectations_min integer;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS salary_expectations_max integer;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS currency text DEFAULT 'EUR';
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS availability text; -- 'immediate', '2_weeks', '1_month', '3_months'
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS languages text[];

-- Index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_experiences_user_id ON experiences(user_id);
CREATE INDEX IF NOT EXISTS idx_user_skills_user_id ON user_skills(user_id);
CREATE INDEX IF NOT EXISTS idx_user_documents_user_id ON user_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_user_social_links_user_id ON user_social_links(user_id);
CREATE INDEX IF NOT EXISTS idx_profile_analytics_user_id ON profile_analytics(user_id);

-- Activation RLS sur toutes les nouvelles tables
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_analytics ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour experiences
CREATE POLICY "Users can manage own experiences"
  ON experiences FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Politiques RLS pour user_skills
CREATE POLICY "Users can manage own skills"
  ON user_skills FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Politiques RLS pour user_documents
CREATE POLICY "Users can manage own documents"
  ON user_documents FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Politiques RLS pour user_social_links
CREATE POLICY "Users can manage own social links"
  ON user_social_links FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Politiques RLS pour profile_analytics
CREATE POLICY "Users can manage own analytics"
  ON profile_analytics FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Fonction pour calculer le pourcentage de complétion du profil
CREATE OR REPLACE FUNCTION calculate_profile_completion(user_uuid uuid)
RETURNS integer AS $$
DECLARE
  completion_score integer := 0;
  profile_data record;
  experience_count integer;
  skill_count integer;
  document_count integer;
BEGIN
  -- Récupérer les données du profil
  SELECT * INTO profile_data FROM user_profiles WHERE id = user_uuid;
  
  -- Compter les expériences
  SELECT COUNT(*) INTO experience_count FROM experiences WHERE user_id = user_uuid;
  
  -- Compter les compétences
  SELECT COUNT(*) INTO skill_count FROM user_skills WHERE user_id = user_uuid;
  
  -- Compter les documents
  SELECT COUNT(*) INTO document_count FROM user_documents WHERE user_id = user_uuid;
  
  -- Calculer le score (max 100)
  completion_score := 0;
  
  -- Informations de base (40 points)
  IF profile_data.first_name IS NOT NULL AND profile_data.first_name != '' THEN completion_score := completion_score + 5; END IF;
  IF profile_data.last_name IS NOT NULL AND profile_data.last_name != '' THEN completion_score := completion_score + 5; END IF;
  IF profile_data.title IS NOT NULL AND profile_data.title != '' THEN completion_score := completion_score + 10; END IF;
  IF profile_data.bio IS NOT NULL AND profile_data.bio != '' THEN completion_score := completion_score + 10; END IF;
  IF profile_data.location IS NOT NULL AND profile_data.location != '' THEN completion_score := completion_score + 5; END IF;
  IF profile_data.phone IS NOT NULL AND profile_data.phone != '' THEN completion_score := completion_score + 5; END IF;
  
  -- Expériences (30 points)
  IF experience_count >= 1 THEN completion_score := completion_score + 15; END IF;
  IF experience_count >= 3 THEN completion_score := completion_score + 15; END IF;
  
  -- Compétences (20 points)
  IF skill_count >= 3 THEN completion_score := completion_score + 10; END IF;
  IF skill_count >= 5 THEN completion_score := completion_score + 10; END IF;
  
  -- Documents (10 points)
  IF document_count >= 1 THEN completion_score := completion_score + 10; END IF;
  
  RETURN LEAST(completion_score, 100);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour mettre à jour automatiquement les analytics
CREATE OR REPLACE FUNCTION update_profile_analytics()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profile_analytics (user_id, profile_completion_percentage, last_profile_update)
  VALUES (NEW.id, calculate_profile_completion(NEW.id), now())
  ON CONFLICT (user_id) DO UPDATE SET
    profile_completion_percentage = calculate_profile_completion(NEW.id),
    last_profile_update = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour mettre à jour les analytics
CREATE OR REPLACE TRIGGER trigger_update_profile_analytics
  AFTER INSERT OR UPDATE ON user_profiles
  FOR EACH ROW EXECUTE PROCEDURE update_profile_analytics();

-- Fonction pour créer automatiquement les analytics lors de la création d'un profil
CREATE OR REPLACE FUNCTION create_profile_analytics()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profile_analytics (user_id, profile_completion_percentage)
  VALUES (NEW.id, calculate_profile_completion(NEW.id));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour créer les analytics automatiquement
CREATE OR REPLACE TRIGGER trigger_create_profile_analytics
  AFTER INSERT ON user_profiles
  FOR EACH ROW EXECUTE PROCEDURE create_profile_analytics(); 