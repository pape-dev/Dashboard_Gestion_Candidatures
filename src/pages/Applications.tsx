import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Building, Plus, Download, Upload, Filter, Settings,
  BarChart3, Calendar, Users, Target, TrendingUp, Sparkles,
  FileText, Zap, Globe, Brain
} from "lucide-react";
import ApplicationForm from "@/components/ApplicationForm";
import ApplicationsStats from "@/components/ApplicationsStats";
import ApplicationsFilters from "@/components/ApplicationsFilters";
import ApplicationCard from "@/components/ApplicationCard";
import ApplicationsTable from "@/components/ApplicationsTable";
import ApplicationsTimeline from "@/components/ApplicationsTimeline";
import ExportImportModal from "@/components/ExportImportModal";
import ApplicationAnalytics from "@/components/ApplicationAnalytics";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAppContext } from "@/contexts/AppContext";

const Applications = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedApps, setSelectedApps] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<"cards" | "table" | "timeline">("cards");
  const { toast } = useToast();
  
  // Utilisation du contexte global
  const { 
    applications, 
    updateApplication, 
    deleteApplication,
    addApplication
  } = useAppContext();

  const stats = {
    total: applications.length,
    pending: applications.filter(app => app.status === "En cours").length,
    interview: applications.filter(app => app.status === "Entretien").length,
    accepted: applications.filter(app => app.status === "Accepté").length,
    rejected: applications.filter(app => app.status === "Refusé").length,
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = selectedStatus === "all" || app.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const sortedApplications = [...filteredApplications].sort((a, b) => {
    let aValue, bValue;
    switch (sortBy) {
      case "date":
        aValue = new Date(a.appliedDate).getTime();
        bValue = new Date(b.appliedDate).getTime();
        break;
      case "company":
        aValue = a.company.toLowerCase();
        bValue = b.company.toLowerCase();
        break;
      case "salary":
        aValue = parseInt(a.salary.split("-")[0]);
        bValue = parseInt(b.salary.split("-")[0]);
        break;
      default:
        return 0;
    }
    
    if (sortOrder === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const handleSelectApp = (appId: number) => {
    setSelectedApps(prev => 
      prev.includes(appId) 
        ? prev.filter(id => id !== appId)
        : [...prev, appId]
    );
  };

  const handleSelectAll = () => {
    if (selectedApps.length === sortedApplications.length) {
      setSelectedApps([]);
    } else {
      setSelectedApps(sortedApplications.map(app => app.id));
    }
  };

  const handleBulkAction = (action: string) => {
    toast({
      title: "Action groupée",
      description: `Action "${action}" appliquée à ${selectedApps.length} candidature(s)`,
    });
    console.log(`Action groupée: ${action} sur les candidatures:`, selectedApps);
  };

  const handleExportData = () => {
    const dataToExport = sortedApplications.map(app => ({
      ...app,
      exportDate: new Date().toISOString()
    }));
    
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `candidatures-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export réussi",
      description: `${sortedApplications.length} candidature(s) exportée(s)`,
    });
  };

  const handleImportData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target?.result as string);
            console.log('Données importées:', data);
            toast({
              title: "Import réussi",
              description: "Les candidatures ont été importées avec succès",
            });
          } catch (error) {
            toast({
              title: "Erreur d'import",
              description: "Le fichier n'est pas valide",
              variant: "destructive",
            });
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleViewAnalytics = () => {
    toast({
      title: "Analyse des données",
      description: "Ouverture du tableau de bord analytique...",
    });
  };

  const handleApplicationEdit = (id: number) => {
    console.log(`Édition de la candidature ${id}`);
    toast({
      title: "Mode édition",
      description: "Ouverture du formulaire de modification...",
    });
  };

  const handleApplicationDelete = (id: number) => {
    deleteApplication(id);
    toast({
      title: "Candidature supprimée",
      description: "La candidature a été supprimée avec succès.",
    });
  };

  const handleApplicationView = (id: number) => {
    console.log(`Affichage des détails de la candidature ${id}`);
  };

  const handleStatusChange = (id: number, newStatus: string) => {
    updateApplication(id, { status: newStatus });
    toast({
      title: "Statut mis à jour",
      description: `Le statut a été changé vers "${newStatus}".`,
    });
  };

  const handleImportSuccess = (importedData: any[]) => {
    // Ajouter les nouvelles candidatures importées
    importedData.forEach((appData) => {
      const { id, ...applicationWithoutId } = appData;
      addApplication(applicationWithoutId);
    });
    
    toast({
      title: "Import réussi",
      description: `${importedData.length} candidature(s) importée(s) avec succès.`,
    });
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Enhanced Header Section */}
        <div className="relative">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950 dark:via-indigo-950 dark:to-purple-950 rounded-2xl -z-10" />
          
          <div className="flex items-center justify-between p-8">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
                  <Building className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                    Gestionnaire de Candidatures
                  </h1>
                  <p className="text-lg text-slate-600 dark:text-slate-400 mt-1">
                    Gérez intelligemment vos opportunités professionnelles
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 px-4 py-2">
                  <Sparkles className="h-4 w-4 mr-2" />
                  {applications.length} candidatures
                </Badge>
                <Badge className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-0 px-4 py-2">
                  <Target className="h-4 w-4 mr-2" />
                  {applications.filter(app => app.status === "En cours" || app.status === "Entretien").length} actives
                </Badge>
                <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 text-white border-0 px-4 py-2">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  {Math.round((applications.filter(app => app.status === "Entretien" || app.status === "Accepté").length / applications.length) * 100)}% taux de réponse
                </Badge>
              </div>
            </div>
            
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <ApplicationAnalytics 
                  applications={applications}
                  trigger={
                    <Button 
                      variant="outline" 
                      className="gap-2 hover:bg-blue-50 border-blue-300 text-blue-700 shadow-sm"
                    >
                      <Brain className="h-4 w-4" />
                      Analytics IA
                    </Button>
                  }
                />
                
                <ExportImportModal 
                  applications={sortedApplications}
                  onImport={handleImportSuccess}
                  trigger={
                    <Button 
                      variant="outline" 
                      className="gap-2 hover:bg-emerald-50 border-emerald-300 text-emerald-700 shadow-sm"
                    >
                      <FileText className="h-4 w-4" />
                      Export / Import
                    </Button>
                  }
                />
                
                <Button 
                  variant="outline" 
                  className="gap-2 hover:bg-purple-50 border-purple-300 text-purple-700 shadow-sm"
                  onClick={() => window.open("https://www.linkedin.com/jobs", "_blank")}
                >
                  <Globe className="h-4 w-4" />
                  Découvrir jobs
                </Button>
              </div>
              
              <ApplicationForm>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 gap-2 shadow-xl hover:shadow-2xl transition-all duration-300 px-6 py-3">
                  <Plus className="h-5 w-5" />
                  Nouvelle candidature
                  <Sparkles className="h-4 w-4 ml-2" />
                </Button>
              </ApplicationForm>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <ApplicationsStats stats={stats} />

        {/* Action Toolbar */}
        {selectedApps.length > 0 && (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-blue-800 font-semibold">
                    {selectedApps.length} candidature(s) sélectionnée(s)
                  </span>
                  <div className="h-4 w-px bg-blue-300"></div>
                  <div className="flex items-center gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="bg-white hover:bg-blue-50 border-blue-300"
                      onClick={() => handleBulkAction("changer-statut")}
                    >
                      <Settings className="h-4 w-4 mr-1" />
                      Changer le statut
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="bg-white hover:bg-blue-50 border-blue-300"
                      onClick={() => handleBulkAction("archiver")}
                    >
                      Archiver
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="bg-white hover:bg-red-50 border-red-300 text-red-600"
                      onClick={() => handleBulkAction("supprimer")}
                    >
                      Supprimer
                    </Button>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => setSelectedApps([])}
                  className="text-blue-600 hover:bg-blue-100"
                >
                  Désélectionner tout
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Enhanced Filters */}
        <ApplicationsFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          selectedApps={selectedApps}
          handleSelectAll={handleSelectAll}
          totalApplications={sortedApplications.length}
        />

        {/* View Mode Tabs */}
        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as any)} className="w-full">
          <div className="flex items-center justify-between">
            <TabsList className="grid w-full max-w-md grid-cols-3 bg-gray-100">
              <TabsTrigger value="cards" className="gap-2">
                <Building className="h-4 w-4" />
                Cartes
              </TabsTrigger>
              <TabsTrigger value="table" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                Tableau
              </TabsTrigger>
              <TabsTrigger value="timeline" className="gap-2">
                <Calendar className="h-4 w-4" />
                Timeline
              </TabsTrigger>
            </TabsList>
            
            <div className="text-sm text-gray-600">
              Affichage de {sortedApplications.length} candidature(s)
            </div>
          </div>

          <TabsContent value="cards" className="space-y-4 mt-6">
            {sortedApplications.map((app) => (
              <ApplicationCard
                key={app.id}
                application={app}
                isSelected={selectedApps.includes(app.id)}
                onSelect={handleSelectApp}
                onEdit={handleApplicationEdit}
                onDelete={handleApplicationDelete}
                onView={handleApplicationView}
                onStatusChange={handleStatusChange}
              />
            ))}
          </TabsContent>

          <TabsContent value="table" className="mt-6">
            <ApplicationsTable
              applications={sortedApplications}
              selectedApps={selectedApps}
              onSelect={handleSelectApp}
              onEdit={handleApplicationEdit}
              onDelete={handleApplicationDelete}
              onView={handleApplicationView}
              onStatusChange={handleStatusChange}
            />
          </TabsContent>

          <TabsContent value="timeline" className="mt-6">
            <ApplicationsTimeline
              applications={sortedApplications}
              selectedApps={selectedApps}
              onSelect={handleSelectApp}
              onEdit={handleApplicationEdit}
              onDelete={handleApplicationDelete}
              onView={handleApplicationView}
              onStatusChange={handleStatusChange}
            />
          </TabsContent>
        </Tabs>

        {/* Empty State */}
        {sortedApplications.length === 0 && (
          <Card className="text-center py-12 shadow-lg">
            <CardContent>
              <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune candidature trouvée</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || selectedStatus !== "all" 
                  ? "Aucune candidature ne correspond à vos critères de recherche."
                  : "Commencez par ajouter votre première candidature."
                }
              </p>
              <ApplicationForm>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 gap-2">
                  <Plus className="h-4 w-4" />
                  Ajouter une candidature
                </Button>
              </ApplicationForm>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Applications;
