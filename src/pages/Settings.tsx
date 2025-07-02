
import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { 
  Settings as SettingsIcon, User, Bell, Shield, 
  Palette, Download, Upload, Trash2, Save,
  Mail, Phone, MapPin, Globe, Lock, Key
} from "lucide-react";

const Settings = () => {
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
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile">Profil</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="privacy">Confidentialité</TabsTrigger>
            <TabsTrigger value="appearance">Apparence</TabsTrigger>
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
                    <Input id="firstName" defaultValue="Alexandre" />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Nom</Label>
                    <Input id="lastName" defaultValue="Dubois" />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input id="email" type="email" defaultValue="alexandre.dubois@email.com" className="pl-10" />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="phone">Téléphone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input id="phone" type="tel" defaultValue="+33 6 12 34 56 78" className="pl-10" />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="location">Localisation</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input id="location" defaultValue="Paris, France" className="pl-10" />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="website">Site web</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input id="website" type="url" placeholder="https://votre-site.com" className="pl-10" />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="bio">Présentation</Label>
                  <Textarea 
                    id="bio" 
                    placeholder="Parlez-nous de vous..."
                    defaultValue="Développeur passionné avec 5 ans d'expérience dans le développement web moderne."
                    rows={4}
                  />
                </div>
                
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Save className="h-4 w-4 mr-2" />
                  Sauvegarder les modifications
                </Button>
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
                      <Label htmlFor="push-notifications">Notifications push</Label>
                      <p className="text-sm text-gray-500">Recevoir des notifications push dans le navigateur</p>
                    </div>
                    <Switch 
                      id="push-notifications"
                      checked={notifications.push}
                      onCheckedChange={(checked) => setNotifications({...notifications, push: checked})}
                    />
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-medium mb-4">Types de notifications</h3>
                  <div className="space-y-4">
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
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="weekly-notifications">Résumé hebdomadaire</Label>
                        <p className="text-sm text-gray-500">Recevoir un résumé de votre activité chaque semaine</p>
                      </div>
                      <Switch 
                        id="weekly-notifications"
                        checked={notifications.weekly}
                        onCheckedChange={(checked) => setNotifications({...notifications, weekly: checked})}
                      />
                    </div>
                  </div>
                </div>
                
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Save className="h-4 w-4 mr-2" />
                  Sauvegarder les préférences
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
                      <Label htmlFor="show-phone">Afficher le téléphone</Label>
                      <p className="text-sm text-gray-500">Rendre votre numéro visible sur votre profil public</p>
                    </div>
                    <Switch 
                      id="show-phone"
                      checked={privacy.showPhone}
                      onCheckedChange={(checked) => setPrivacy({...privacy, showPhone: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="analytics">Données d'utilisation</Label>
                      <p className="text-sm text-gray-500">Permettre la collecte de données anonymes pour améliorer l'application</p>
                    </div>
                    <Switch 
                      id="analytics"
                      checked={privacy.analytics}
                      onCheckedChange={(checked) => setPrivacy({...privacy, analytics: checked})}
                    />
                  </div>
                </div>
                
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Save className="h-4 w-4 mr-2" />
                  Sauvegarder les paramètres
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5 text-blue-600" />
                  Apparence
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-base font-medium">Thème</Label>
                  <p className="text-sm text-gray-500 mb-4">Choisissez l'apparence de l'application</p>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="relative">
                      <input type="radio" id="theme-light" name="theme" value="light" className="sr-only" defaultChecked />
                      <label htmlFor="theme-light" className="block p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                        <div className="w-full h-16 bg-white border rounded mb-2"></div>
                        <p className="text-sm font-medium text-center">Clair</p>
                      </label>
                    </div>
                    <div className="relative">
                      <input type="radio" id="theme-dark" name="theme" value="dark" className="sr-only" />
                      <label htmlFor="theme-dark" className="block p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                        <div className="w-full h-16 bg-gray-900 border rounded mb-2"></div>
                        <p className="text-sm font-medium text-center">Sombre</p>
                      </label>
                    </div>
                    <div className="relative">
                      <input type="radio" id="theme-auto" name="theme" value="auto" className="sr-only" />
                      <label htmlFor="theme-auto" className="block p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                        <div className="w-full h-16 bg-gradient-to-r from-white to-gray-900 border rounded mb-2"></div>
                        <p className="text-sm font-medium text-center">Auto</p>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label className="text-base font-medium">Couleur d'accent</Label>
                  <p className="text-sm text-gray-500 mb-4">Personnalisez la couleur principale de l'interface</p>
                  <div className="grid grid-cols-6 gap-3">
                    {['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-red-500', 'bg-orange-500', 'bg-pink-500'].map((color) => (
                      <div key={color} className={`w-10 h-10 ${color} rounded-lg cursor-pointer hover:scale-110 transition-transform`}></div>
                    ))}
                  </div>
                </div>
                
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Save className="h-4 w-4 mr-2" />
                  Appliquer les changements
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
                  <Input id="current-password" type="password" />
                </div>
                
                <div>
                  <Label htmlFor="new-password">Nouveau mot de passe</Label>
                  <Input id="new-password" type="password" />
                </div>
                
                <div>
                  <Label htmlFor="confirm-password">Confirmer le nouveau mot de passe</Label>
                  <Input id="confirm-password" type="password" />
                </div>
                
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Key className="h-4 w-4 mr-2" />
                  Changer le mot de passe
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
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Exporter les données
                  </Button>
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="font-medium mb-2 text-red-600">Zone de danger</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    La suppression de votre compte est irréversible. Toutes vos données seront définitivement supprimées.
                  </p>
                  <Button variant="destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Supprimer le compte
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
