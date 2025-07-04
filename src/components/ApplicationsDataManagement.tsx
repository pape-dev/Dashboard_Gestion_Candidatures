import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Database, Upload, Download, Archive, Trash2, 
  Filter, SortAsc, Search, Star, Clock, AlertCircle,
  Loader2, CheckCircle, XCircle, RefreshCw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Application {
  id: number;
  company: string;
  position: string;
  location: string;
  status: string;
  appliedDate: string;
  salary: string;
  statusColor: string;
  description: string;
  priority: string;
  contactPerson: string;
  contactEmail: string;
  nextStep: string;
  tags: string[];
  logo?: string;
}

interface ApplicationsDataManagementProps {
  applications: Application[];
  onUpdateApplications: (applications: Application[]) => void;
}

const ApplicationsDataManagement = ({ applications, onUpdateApplications }: ApplicationsDataManagementProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [backupName, setBackupName] = useState("");
  const [bulkEditData, setBulkEditData] = useState({
    field: "",
    oldValue: "",
    newValue: ""
  });
  const [autoBackup, setAutoBackup] = useState(true);
  const [syncEnabled, setSyncEnabled] = useState(false);
  const { toast } = useToast();

  const handleCreateBackup = () => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = backupName || `backup-${timestamp}`;
    
    const backupData = {
      timestamp,
      version: "1.0",
      applications,
      metadata: {
        total: applications.length,
        statuses: applications.reduce((acc, app) => {
          acc[app.status] = (acc[app.status] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      }
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.backup.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Sauvegarde créée",
      description: `Backup "${filename}" téléchargé avec succès`,
    });
  };

  const handleRestoreBackup = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.backup.json,.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        setIsProcessing(true);
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const backupData = JSON.parse(e.target?.result as string);
            
            if (backupData.applications && Array.isArray(backupData.applications)) {
              onUpdateApplications(backupData.applications);
              toast({
                title: "Restauration réussie",
                description: `${backupData.applications.length} candidature(s) restaurée(s)`,
              });
            } else {
              throw new Error("Format de sauvegarde invalide");
            }
          } catch (error) {
            toast({
              title: "Erreur de restauration",
              description: "Le fichier de sauvegarde n'est pas valide",
              variant: "destructive",
            });
          } finally {
            setIsProcessing(false);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleBulkEdit = () => {
    if (!bulkEditData.field || !bulkEditData.newValue) {
      toast({
        title: "Données manquantes",
        description: "Veuillez remplir tous les champs pour l'édition en masse",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    const updatedApplications = applications.map(app => {
      const fieldValue = app[bulkEditData.field as keyof Application];
      
      if (!bulkEditData.oldValue || 
          (typeof fieldValue === 'string' && fieldValue.includes(bulkEditData.oldValue))) {
        return {
          ...app,
          [bulkEditData.field]: bulkEditData.newValue
        };
      }
      return app;
    });

    const changedCount = updatedApplications.filter((app, index) => 
      app[bulkEditData.field as keyof Application] !== applications[index][bulkEditData.field as keyof Application]
    ).length;

    onUpdateApplications(updatedApplications);
    
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Édition en masse réussie",
        description: `${changedCount} candidature(s) mise(s) à jour`,
      });
    }, 1000);
  };

  const handleCleanupData = () => {
    setIsProcessing(true);
    
    // Nettoyer les données (supprimer les doublons, standardiser les formats, etc.)
    const cleanedApplications = applications.filter((app, index, arr) => 
      arr.findIndex(a => a.company === app.company && a.position === app.position) === index
    ).map(app => ({
      ...app,
      company: app.company.trim(),
      position: app.position.trim(),
      location: app.location.trim(),
      tags: [...new Set(app.tags.map(tag => tag.trim()))], // Supprimer les doublons de tags
    }));

    const removedCount = applications.length - cleanedApplications.length;
    
    onUpdateApplications(cleanedApplications);
    
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Nettoyage terminé",
        description: `${removedCount} doublon(s) supprimé(s), données standardisées`,
      });
    }, 1000);
  };

  const handleArchiveOldApplications = () => {
    const cutoffDate = new Date();
    cutoffDate.setMonth(cutoffDate.getMonth() - 6); // Applications de plus de 6 mois

    const recentApplications = applications.filter(app => 
      new Date(app.appliedDate) > cutoffDate
    );
    
    const archivedCount = applications.length - recentApplications.length;
    
    if (archivedCount === 0) {
      toast({
        title: "Aucune candidature à archiver",
        description: "Toutes vos candidatures sont récentes (moins de 6 mois)",
      });
      return;
    }

    onUpdateApplications(recentApplications);
    
    toast({
      title: "Archivage terminé",
      description: `${archivedCount} candidature(s) ancienne(s) archivée(s)`,
    });
  };

  const getDataHealthScore = () => {
    let score = 100;
    let issues = [];

    // Vérifier les doublons
    const duplicates = applications.filter((app, index, arr) => 
      arr.findIndex(a => a.company === app.company && a.position === app.position) !== index
    );
    if (duplicates.length > 0) {
      score -= 20;
      issues.push(`${duplicates.length} doublon(s) détecté(s)`);
    }

    // Vérifier les champs manquants
    const missingData = applications.filter(app => 
      !app.contactPerson || !app.nextStep || app.tags.length === 0
    );
    if (missingData.length > 0) {
      score -= 15;
      issues.push(`${missingData.length} candidature(s) avec données incomplètes`);
    }

    // Vérifier les candidatures anciennes sans suivi
    const oldApplications = applications.filter(app => {
      const daysSince = Math.floor((new Date().getTime() - new Date(app.appliedDate).getTime()) / (1000 * 60 * 60 * 24));
      return daysSince > 30 && app.status === "En cours";
    });
    if (oldApplications.length > 0) {
      score -= 10;
      issues.push(`${oldApplications.length} candidature(s) en cours sans suivi récent`);
    }

    return { score: Math.max(0, score), issues };
  };

  const healthData = getDataHealthScore();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Data Health Dashboard */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-blue-600" />
            Tableau de bord des données
          </CardTitle>
          <CardDescription>
            État de santé et gestion de vos données de candidatures
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{applications.length}</div>
              <div className="text-sm text-blue-700 dark:text-blue-300">Total candidatures</div>
            </div>
            <div className="text-center p-4 bg-emerald-50 dark:bg-emerald-950 rounded-lg">
              <div className="text-2xl font-bold text-emerald-600">{healthData.score}%</div>
              <div className="text-sm text-emerald-700 dark:text-emerald-300">Score de santé</div>
            </div>
            <div className="text-center p-4 bg-amber-50 dark:bg-amber-950 rounded-lg">
              <div className="text-2xl font-bold text-amber-600">{healthData.issues.length}</div>
              <div className="text-sm text-amber-700 dark:text-amber-300">Problèmes détectés</div>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {new Set(applications.map(app => app.company)).size}
              </div>
              <div className="text-sm text-purple-700 dark:text-purple-300">Entreprises uniques</div>
            </div>
          </div>

          {healthData.issues.length > 0 && (
            <div className="mb-6">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                Problèmes détectés
              </h4>
              <div className="space-y-2">
                {healthData.issues.map((issue, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-amber-50 dark:bg-amber-950 rounded">
                    <XCircle className="h-4 w-4 text-amber-600" />
                    <span className="text-sm text-amber-800 dark:text-amber-200">{issue}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Backup & Restore */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Archive className="h-5 w-5 text-emerald-600" />
            Sauvegarde & Restauration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="backup-name">Nom de la sauvegarde (optionnel)</Label>
            <Input
              id="backup-name"
              placeholder="backup-candidatures-2024"
              value={backupName}
              onChange={(e) => setBackupName(e.target.value)}
              className="mt-2"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Sauvegarde automatique</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Sauvegarde quotidienne automatique
              </div>
            </div>
            <Switch
              checked={autoBackup}
              onCheckedChange={setAutoBackup}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button onClick={handleCreateBackup} className="w-full" variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Créer sauvegarde
            </Button>
            <Button 
              onClick={handleRestoreBackup} 
              className="w-full" 
              variant="outline"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Upload className="h-4 w-4 mr-2" />
              )}
              Restaurer
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Operations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-purple-600" />
            Opérations en masse
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Champ à modifier</Label>
            <Select value={bulkEditData.field} onValueChange={(value) => 
              setBulkEditData(prev => ({ ...prev, field: value }))
            }>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Sélectionner un champ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="status">Statut</SelectItem>
                <SelectItem value="priority">Priorité</SelectItem>
                <SelectItem value="location">Localisation</SelectItem>
                <SelectItem value="nextStep">Prochaine étape</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Ancienne valeur (optionnel)</Label>
            <Input
              placeholder="Laisser vide pour tous"
              value={bulkEditData.oldValue}
              onChange={(e) => setBulkEditData(prev => ({ ...prev, oldValue: e.target.value }))}
              className="mt-2"
            />
          </div>

          <div>
            <Label>Nouvelle valeur</Label>
            <Input
              placeholder="Nouvelle valeur"
              value={bulkEditData.newValue}
              onChange={(e) => setBulkEditData(prev => ({ ...prev, newValue: e.target.value }))}
              className="mt-2"
            />
          </div>

          <Button 
            onClick={handleBulkEdit} 
            className="w-full"
            disabled={isProcessing || !bulkEditData.field || !bulkEditData.newValue}
          >
            {isProcessing ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Appliquer les modifications
          </Button>
        </CardContent>
      </Card>

      {/* Data Maintenance */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-red-600" />
            Maintenance des données
          </CardTitle>
          <CardDescription>
            Outils de nettoyage et d'optimisation de vos données
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              onClick={handleCleanupData} 
              variant="outline" 
              className="h-auto p-4 flex flex-col gap-2"
              disabled={isProcessing}
            >
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                <Filter className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-center">
                <div className="font-medium">Nettoyer les données</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">
                  Supprimer doublons et standardiser
                </div>
              </div>
            </Button>

            <Button 
              onClick={handleArchiveOldApplications} 
              variant="outline" 
              className="h-auto p-4 flex flex-col gap-2"
            >
              <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900">
                <Archive className="h-5 w-5 text-amber-600" />
              </div>
              <div className="text-center">
                <div className="font-medium">Archiver anciennes</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">
                  Candidatures de +6 mois
                </div>
              </div>
            </Button>

            <div className="p-4 border rounded-lg bg-slate-50 dark:bg-slate-900">
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium">Synchronisation</div>
                <Switch
                  checked={syncEnabled}
                  onCheckedChange={setSyncEnabled}
                />
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400">
                Sync avec LinkedIn et autres plateformes
              </div>
              {syncEnabled && (
                <Badge className="mt-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Activé
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApplicationsDataManagement;