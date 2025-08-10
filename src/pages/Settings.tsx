import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Settings as SettingsIcon, User, Bell, Shield, 
  Palette, Download, Trash2, Save,
  Mail, Phone, MapPin, Globe, Lock, Key, Loader2
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    interviews: true,
    applications: true,
    deadlines: true,
    weekly: false
  });

  const [privacy, setPrivacy] = useState({
    profilePublic: false,
    showEmail: false,
    showPhone: false,
    analytics: true
  });

  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  useEffect(() => {
    loadUserProfile();
  }, [user]);

  const loadUserProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setProfile(data);
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error);
    }
  };

  const handleProfileUpdate = async (field: string, value: any) => {
    if (!user) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          id: user.id,
          [field]: value,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      setProfile(prev => ({ ...prev, [field]: value }));
      
      toast({
        title: "Paramètre mis à jour",
        description: "Vos préférences ont été sauvegardées",
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les paramètres",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      toast({
        title: "Champs manquants",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
      return;
    }

    if (passwords.new !== passwords.confirm) {
      toast({
        title: "Mots de passe différents",
        description: "Les nouveaux mots de passe ne correspondent pas",
        variant: "destructive",
      });
      return;
    }

    if (passwords.new.length < 6) {
      toast({
        title: "Mot de passe trop court",
        description: "Le mot de passe doit contenir au moins 6 caractères",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.updateUser({
        password: passwords.new
      });

      if (error) throw error;

      setPasswords({ current: '', new: '', confirm: '' });
      
      toast({
        title: "Mot de passe mis à jour",
        description: "Votre mot de passe a été modifié avec succès",
      });
    } catch (error) {
      console.error('Erreur lors du changement de mot de passe:', error);
      toast({
        title: "Erreur",
        description: "Impossible de changer le mot de passe",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Récupérer toutes les données utilisateur
      const [applicationsRes, interviewsRes, tasksRes, contactsRes] = await Promise.all([
        supabase.from('applications').select('*').eq('user_id', user.id),
        supabase.from('interviews').select('*').eq('user_id', user.id),
        supabase.from('tasks').select('*').eq('user_id', user.id),
        supabase.from('contacts').select('*').eq('user_id', user.id),
      ]);

      const exportData = {
        profile,
        applications: applicationsRes.data || [],
        interviews: interviewsRes.data || [],
        tasks: tasksRes.data || [],
        contacts: contactsRes.data || [],
        exportDate: new Date().toISOString(),
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `jobtracker-export-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);

      toast({
        title: "Export réussi",
        description: "Vos données ont été exportées avec succès",
      });
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'exporter les données",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer définitivement votre compte ? Cette action est irréversible.')) {
      return;
    }

    try {
      setLoading(true);
      
      // Supprimer toutes les données utilisateur
      await Promise.all([
        supabase.from('applications').delete().eq('user_id', user.id),
        supabase.from('interviews').delete().eq('user_id', user.id),
        supabase.from('tasks').delete().eq('user_id', user.id),
        supabase.from('contacts').delete().eq('user_id', user.id),
        supabase.from('user_profiles').delete().eq('id', user.id),
      ]);

      // Supprimer le compte utilisateur
      const { error } = await supabase.auth.admin.deleteUser(user.id);
      if (error) throw error;

      await signOut();
      
      toast({
        title: "Compte supprimé",
        description: "Votre compte a été supprimé définitivement",
      });
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le compte",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
            <p className="text-gray-600 mt-1">Gérez vos préférences et paramètres</p>
          </div>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profil</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="privacy">Confidentialité</TabsTrigger>
            <TabsTrigger value="account">Compte</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600" />
                  Informations personnelles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Prénom</Label>
                    <Input 
                      id="firstName" 
                      value={profile?.first_name || ''} 
                      onChange={(e) => handleProfileUpdate('first_name', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Nom</Label>
                    <Input 
                      id="lastName" 
                      value={profile?.last_name || ''} 
                      onChange={(e) => handleProfileUpdate('last_name', e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input 
                      id="email" 
                      type="email" 
                      value={user?.email || ''} 
                      disabled
                      className="pl-10 bg-gray-50" 
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    L'email ne peut pas être modifié depuis cette interface
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="phone">Téléphone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input 
                      id="phone" 
                      type="tel" 
                      value={profile?.phone || ''} 
                      onChange={(e) => handleProfileUpdate('phone', e.target.value)}
                      className="pl-10" 
                      placeholder="+33 6 12 34 56 78"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="location">Localisation</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input 
                      id="location" 
                      value={profile?.location || ''} 
                      onChange={(e) => handleProfileUpdate('location', e.target.value)}
                      className="pl-10" 
                      placeholder="Paris, France"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="website">Site web</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input 
                      id="website" 
                      type="url" 
                      value={profile?.website || ''} 
                      onChange={(e) => handleProfileUpdate('website', e.target.value)}
                      className="pl-10" 
                      placeholder="https://votre-site.com"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-blue-600" />
                  Préférences de notification
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email-notifications">Notifications par email</Label>
                      <p className="text-sm text-gray-500">Recevoir les notifications importantes par email</p>
                    </div>
                    <Switch 
                      id="email-notifications"
                      checked={notifications.email}
                      onCheckedChange={(checked) => setNotifications({...notifications, email: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="interview-notifications">Rappels d'entretien</Label>
                      <p className="text-sm text-gray-500">Être notifié avant vos entretiens</p>
                    </div>
                    <Switch 
                      id="interview-notifications"
                      checked={notifications.interviews}
                      onCheckedChange={(checked) => setNotifications({...notifications, interviews: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="application-notifications">Suivi de candidatures</Label>
                      <p className="text-sm text-gray-500">Notifications sur l'état de vos candidatures</p>
                    </div>
                    <Switch 
                      id="application-notifications"
                      checked={notifications.applications}
                      onCheckedChange={(checked) => setNotifications({...notifications, applications: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="deadline-notifications">Échéances de tâches</Label>
                      <p className="text-sm text-gray-500">Rappels pour vos tâches importantes</p>
                    </div>
                    <Switch 
                      id="deadline-notifications"
                      checked={notifications.deadlines}
                      onCheckedChange={(checked) => setNotifications({...notifications, deadlines: checked})}
                    />
                  </div>
                </div>
                
                <Button 
                  onClick={() => {
                    toast({
                      title: "Préférences sauvegardées",
                      description: "Vos préférences de notification ont été mises à jour",
                    });
                  }}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Sauvegarde...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Sauvegarder les préférences
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  Confidentialité et sécurité
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="profile-public">Profil public</Label>
                      <p className="text-sm text-gray-500">Permettre aux recruteurs de voir votre profil</p>
                    </div>
                    <Switch 
                      id="profile-public"
                      checked={privacy.profilePublic}
                      onCheckedChange={(checked) => setPrivacy({...privacy, profilePublic: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="show-email">Afficher l'email</Label>
                      <p className="text-sm text-gray-500">Rendre votre email visible sur votre profil public</p>
                    </div>
                    <Switch 
                      id="show-email"
                      checked={privacy.showEmail}
                      onCheckedChange={(checked) => setPrivacy({...privacy, showEmail: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="analytics">Données d'utilisation</Label>
                      <p className="text-sm text-gray-500">Permettre la collecte de données anonymes</p>
                    </div>
                    <Switch 
                      id="analytics"
                      checked={privacy.analytics}
                      onCheckedChange={(checked) => setPrivacy({...privacy, analytics: checked})}
                    />
                  </div>
                </div>
                
                <Button 
                  onClick={() => {
                    toast({
                      title: "Paramètres sauvegardés",
                      description: "Vos paramètres de confidentialité ont été mis à jour",
                    });
                  }}
                  disabled={loading}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Sauvegarder les paramètres
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="account" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-blue-600" />
                  Sécurité du compte
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="current-password">Mot de passe actuel</Label>
                  <Input 
                    id="current-password" 
                    type="password" 
                    value={passwords.current}
                    onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="new-password">Nouveau mot de passe</Label>
                  <Input 
                    id="new-password" 
                    type="password" 
                    value={passwords.new}
                    onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="confirm-password">Confirmer le nouveau mot de passe</Label>
                  <Input 
                    id="confirm-password" 
                    type="password" 
                    value={passwords.confirm}
                    onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                  />
                </div>
                
                <Button 
                  onClick={handlePasswordChange}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Modification...
                    </>
                  ) : (
                    <>
                      <Key className="h-4 w-4 mr-2" />
                      Changer le mot de passe
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5 text-blue-600" />
                  Données du compte
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Exporter vos données</h3>
                  <p className="text-sm text-gray-500 mb-4">Téléchargez une copie de toutes vos données</p>
                  <Button 
                    variant="outline" 
                    onClick={handleExportData}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Export...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Exporter les données
                      </>
                    )}
                  </Button>
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="font-medium mb-2 text-red-600">Zone de danger</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    La suppression de votre compte est irréversible. Toutes vos données seront définitivement supprimées.
                  </p>
                  <Button 
                    variant="destructive" 
                    onClick={handleDeleteAccount}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Suppression...
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Supprimer le compte
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Settings;