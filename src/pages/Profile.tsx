import Layout from "@/components/Layout";
import ProfileForm from "@/components/forms/ProfileForm";
import ExperienceForm from "@/components/forms/ExperienceForm";
import SkillsForm from "@/components/forms/SkillsForm";
import ProfileAnalytics from "@/components/profile/ProfileAnalytics";
import { useProfile } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Edit, Loader2 } from "lucide-react";

const Profile = () => {
  const { profile, experiences, skills, loading } = useProfile();

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Chargement du profil...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Profil & CV</h1>
            <p className="text-muted-foreground mt-1">Gérez vos informations professionnelles</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Télécharger CV
            </Button>
            <Button>
              <Edit className="h-4 w-4 mr-2" />
              Modifier
            </Button>
          </div>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profil</TabsTrigger>
            <TabsTrigger value="experience">Expérience</TabsTrigger>
            <TabsTrigger value="skills">Compétences</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <ProfileForm profile={profile} />
          </TabsContent>

          <TabsContent value="experience" className="space-y-6">
            <ExperienceForm experiences={experiences} />
          </TabsContent>

          <TabsContent value="skills" className="space-y-6">
            <SkillsForm skills={skills} />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <ProfileAnalytics />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Profile;