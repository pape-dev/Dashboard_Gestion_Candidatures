import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  Download, Upload, FileJson, FileSpreadsheet, Globe, 
  Zap, Settings, CheckCircle, AlertTriangle, Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import { Application } from "@/contexts/AppContext";

interface ExportImportModalProps {
  applications: Application[];
  onImport: (data: any[]) => void;
  trigger: React.ReactNode;
}

const ExportImportModal = ({ applications, onImport, trigger }: ExportImportModalProps) => {
  const [exportFormat, setExportFormat] = useState<"json" | "csv">("json");
  const [exportFields, setExportFields] = useState({
    basic: true,
    contact: true,
    metadata: true,
    tags: true
  });
  const [webhookUrl, setWebhookUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleExport = () => {
    const fieldsToExport = [];
    
    if (exportFields.basic) {
      fieldsToExport.push('company', 'position', 'location', 'status', 'applied_date', 'salary_min', 'salary_max', 'salary_currency');
    }
    if (exportFields.contact) {
      fieldsToExport.push('contact_person', 'contact_email');
    }
    if (exportFields.metadata) {
      fieldsToExport.push('description', 'priority', 'next_step', 'notes');
    }

    const dataToExport = applications.map(app => {
      const filtered: any = { id: app.id };
      fieldsToExport.forEach(field => {
        filtered[field] = app[field as keyof Application];
      });
      filtered.exportDate = new Date().toISOString();
      return filtered;
    });

    if (exportFormat === "json") {
      const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `candidatures-export-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      // CSV Export
      const headers = Object.keys(dataToExport[0]).join(',');
      const csvContent = dataToExport.map(row => 
        Object.values(row).map(value => 
          typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
        ).join(',')
      ).join('\n');
      
      const blob = new Blob([headers + '\n' + csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `candidatures-export-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }

    toast({
      title: "Export réussi",
      description: `${applications.length} candidature(s) exportée(s) en format ${exportFormat.toUpperCase()}`,
    });
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,.csv';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        setIsLoading(true);
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            let data;
            if (file.name.endsWith('.json')) {
              data = JSON.parse(e.target?.result as string);
            } else {
              // Simple CSV parsing
              const lines = (e.target?.result as string).split('\n');
              const headers = lines[0].split(',');
              data = lines.slice(1).filter(line => line.trim()).map(line => {
                const values = line.split(',');
                const obj: any = {};
                headers.forEach((header, index) => {
                  obj[header.trim()] = values[index]?.replace(/"/g, '').trim();
                });
                return obj;
              });
            }
            
            onImport(data);
            toast({
              title: "Import réussi",
              description: `${data.length} candidature(s) importée(s)`,
            });
          } catch (error) {
            toast({
              title: "Erreur d'import",
              description: "Le fichier n'est pas valide",
              variant: "destructive",
            });
          } finally {
            setIsLoading(false);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleZapierExport = async () => {
    if (!webhookUrl) {
      toast({
        title: "URL manquante",
        description: "Veuillez entrer votre URL Zapier webhook",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors",
        body: JSON.stringify({
          applications,
          timestamp: new Date().toISOString(),
          source: "job-tracker-app",
          total: applications.length
        }),
      });

      toast({
        title: "Données envoyées",
        description: "Les candidatures ont été envoyées vers Zapier. Vérifiez l'historique de votre Zap.",
      });
    } catch (error) {
      toast({
        title: "Erreur Zapier",
        description: "Impossible d'envoyer les données vers Zapier",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5 text-blue-600" />
            Exporter / Importer des candidatures
          </DialogTitle>
          <DialogDescription>
            Exportez vos candidatures ou importez des données existantes
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="export" className="mt-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="export" className="gap-2">
              <Download className="h-4 w-4" />
              Exporter
            </TabsTrigger>
            <TabsTrigger value="import" className="gap-2">
              <Upload className="h-4 w-4" />
              Importer
            </TabsTrigger>
            <TabsTrigger value="zapier" className="gap-2">
              <Zap className="h-4 w-4" />
              Zapier
            </TabsTrigger>
          </TabsList>

          <TabsContent value="export" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Configuration d'export</CardTitle>
                <CardDescription>
                  Personnalisez les données à exporter
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-base font-medium">Format d'export</Label>
                  <div className="flex gap-3 mt-2">
                    <Button
                      variant={exportFormat === "json" ? "default" : "outline"}
                      onClick={() => setExportFormat("json")}
                      className="gap-2"
                    >
                      <FileJson className="h-4 w-4" />
                      JSON
                    </Button>
                    <Button
                      variant={exportFormat === "csv" ? "default" : "outline"}
                      onClick={() => setExportFormat("csv")}
                      className="gap-2"
                    >
                      <FileSpreadsheet className="h-4 w-4" />
                      CSV
                    </Button>
                  </div>
                </div>

                <div>
                  <Label className="text-base font-medium">Champs à exporter</Label>
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Informations de base</div>
                        <div className="text-sm text-slate-600">Entreprise, poste, localisation, statut</div>
                      </div>
                      <Switch
                        checked={exportFields.basic}
                        onCheckedChange={(checked) => 
                          setExportFields(prev => ({ ...prev, basic: checked }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Contacts</div>
                        <div className="text-sm text-slate-600">Personne de contact, email</div>
                      </div>
                      <Switch
                        checked={exportFields.contact}
                        onCheckedChange={(checked) => 
                          setExportFields(prev => ({ ...prev, contact: checked }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Métadonnées</div>
                        <div className="text-sm text-slate-600">Description, priorité, prochaine étape</div>
                      </div>
                      <Switch
                        checked={exportFields.metadata}
                        onCheckedChange={(checked) => 
                          setExportFields(prev => ({ ...prev, metadata: checked }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Tags</div>
                        <div className="text-sm text-slate-600">Compétences et technologies</div>
                      </div>
                      <Switch
                        checked={exportFields.tags}
                        onCheckedChange={(checked) => 
                          setExportFields(prev => ({ ...prev, tags: checked }))
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="font-medium text-blue-900 dark:text-blue-100">
                        {applications.length} candidature(s) prête(s) à exporter
                      </div>
                      <div className="text-sm text-blue-700 dark:text-blue-300">
                        Format: {exportFormat.toUpperCase()}
                      </div>
                    </div>
                  </div>
                  <Button onClick={handleExport} className="bg-blue-600 hover:bg-blue-700">
                    Exporter maintenant
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="import" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Importer des candidatures</CardTitle>
                <CardDescription>
                  Importez des candidatures depuis un fichier JSON ou CSV
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border-2 border-dashed border-slate-300 rounded-lg text-center">
                    <FileJson className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <div className="font-medium">Fichier JSON</div>
                    <div className="text-sm text-slate-600 mb-3">Format recommandé</div>
                    <Badge variant="outline">Préservation complète des données</Badge>
                  </div>
                  <div className="p-4 border-2 border-dashed border-slate-300 rounded-lg text-center">
                    <FileSpreadsheet className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <div className="font-medium">Fichier CSV</div>
                    <div className="text-sm text-slate-600 mb-3">Compatible Excel</div>
                    <Badge variant="outline">Import simplifié</Badge>
                  </div>
                </div>

                <div className="p-4 bg-amber-50 dark:bg-amber-950 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                    <div className="font-medium text-amber-900 dark:text-amber-100">
                      Instructions d'import
                    </div>
                  </div>
                  <ul className="text-sm text-amber-800 dark:text-amber-200 space-y-1">
                    <li>• Les données existantes seront fusionnées avec les nouvelles</li>
                    <li>• Assurez-vous que la structure correspond à vos exports</li>
                    <li>• Les IDs en conflit seront automatiquement réassignés</li>
                  </ul>
                </div>

                <Button 
                  onClick={handleImport} 
                  className="w-full" 
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Import en cours...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Sélectionner un fichier à importer
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="zapier" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Zap className="h-5 w-5 text-orange-600" />
                  Intégration Zapier
                </CardTitle>
                <CardDescription>
                  Connectez vos candidatures à des milliers d'applications via Zapier
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="webhook">URL du webhook Zapier</Label>
                  <Input
                    id="webhook"
                    placeholder="https://hooks.zapier.com/hooks/catch/..."
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    className="mt-2"
                  />
                  <div className="text-sm text-slate-600 mt-2">
                    Créez un Zap avec un déclencheur "Webhook" et copiez l'URL ici
                  </div>
                </div>

                <div className="p-4 bg-orange-50 dark:bg-orange-950 rounded-lg">
                  <div className="font-medium text-orange-900 dark:text-orange-100 mb-2">
                    Exemples d'automatisations possibles :
                  </div>
                  <ul className="text-sm text-orange-800 dark:text-orange-200 space-y-1">
                    <li>• Synchroniser avec Google Sheets ou Airtable</li>
                    <li>• Envoyer des notifications Slack pour chaque candidature</li>
                    <li>• Créer des tâches dans Trello ou Asana</li>
                    <li>• Ajouter des contacts dans votre CRM</li>
                  </ul>
                </div>

                <Button 
                  onClick={handleZapierExport} 
                  className="w-full bg-orange-600 hover:bg-orange-700" 
                  size="lg"
                  disabled={isLoading || !webhookUrl}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Envoyer vers Zapier
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ExportImportModal;