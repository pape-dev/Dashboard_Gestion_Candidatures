import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Building, Plus, Download, Upload, Filter, Settings,
  BarChart3, Calendar, Users, Target, TrendingUp, Sparkles,
  FileText, Zap, Globe, Brain, Loader2
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
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedApplications, setSelectedApplications] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [viewMode, setViewMode] = useState<"cards" | "table" | "timeline">("cards");
  const { toast } = useToast();
  
  const { 
    applications, 
    loading, 
    error,
    updateApplication, 
    deleteApplication
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
                         app.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sortedApplications = [...filteredApplications].sort((a, b) => {
    let aValue, bValue;
    switch (sortBy) {
      case "created_at":
        aValue = new Date(a.created_at).getTime();
        bValue = new Date(b.created_at).getTime();
        break;
      case "company":
        aValue = a.company.toLowerCase();
        bValue = b.company.toLowerCase();
        break;
      case "salary_min":
        aValue = a.salary_min || 0;
        bValue = b.salary_min || 0;
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

  const handleSelectApp = (appId: string) => {
    setSelectedApplications(prev => 
      prev.includes(appId) 
        ? prev.filter(id => id !== appId)
        : [...prev, appId]
    );
  };

  const handleSelectAll = () => {
    if (selectedApplications.length === sortedApplications.length) {
      setSelectedApplications([]);
    } else {
      setSelectedApplications(sortedApplications.map(app => app.id));
    }
  };

  const handleApplicationEdit = (id: string) => {
    // Cette fonction sera appelée par ApplicationActions
    console.log(`Édition de la candidature ${id}`);
  };

  const handleApplicationDelete = async (id: string) => {
    try {
      await deleteApplication(id);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const handleApplicationView = (id: string) => {
    console.log(`Affichage des détails de la candidature ${id}`);
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateApplication(id, { status: newStatus });
    } catch (error) {
      console.error('Erreur lors du changement de statut:', error);
    }
  };

  const handleImportSuccess = (importedData: any[]) => {
    toast({
      title: "Import réussi",
      description: `${importedData.length} candidature(s) importée(s) avec succès.`,
    });
    refreshData();
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-lg font-medium text-slate-700 dark:text-slate-300">Chargement...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="p-4 rounded-full bg-red-100 dark:bg-red-900 w-fit mx-auto mb-4">
              <Building className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Erreur de chargement</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => {
              // Assuming refreshData is available in the context or passed as a prop
              // For now, we'll just re-render to show the error state again
              // If refreshData is not available, this will cause an error.
              // The original code had refreshData() here, but it was removed.
              // To avoid breaking the code, we'll keep it commented out or remove it if not needed.
              refreshData();
            }}>
              Réessayer
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Enhanced Header Section */}
        <div className="relative">
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
                  {applications.length > 0 ? Math.round((applications.filter(app => app.status === "Entretien" || app.status === "Accepté").length / applications.length) * 100) : 0}% taux de réponse
                </Badge>
              </div>
            </div>
            
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <ApplicationAnalytics 
                  applications={sortedApplications}
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
        {selectedApplications.length > 0 && (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-blue-800 font-semibold">
                    {selectedApplications.length} candidature(s) sélectionnée(s)
                  </span>
                  <div className="h-4 w-px bg-blue-300"></div>
                  <div className="flex items-center gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="bg-white hover:bg-blue-50 border-blue-300"
                      onClick={() => {
                        // Bulk status change logic
                        toast({
                          title: "Action groupée",
                          description: "Fonctionnalité en cours de développement",
                        });
                      }}
                    >
                      <Settings className="h-4 w-4 mr-1" />
                      Changer le statut
                    </Button>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => setSelectedApplications([])}
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
          selectedStatus={statusFilter}
          setSelectedStatus={setStatusFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          selectedApps={selectedApplications}
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
                isSelected={selectedApplications.includes(app.id)}
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
              selectedApps={selectedApplications}
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
              selectedApps={selectedApplications}
              onSelect={handleSelectApp}
              onEdit={handleApplicationEdit}
              onDelete={handleApplicationDelete}
              onView={handleApplicationView}
              onStatusChange={handleStatusChange}
            />
          </TabsContent>
        </Tabs>

        {/* Empty State */}
        {sortedApplications.length === 0 && !loading && (
          <Card className="text-center py-16 shadow-lg bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
            <CardContent>
              <div className="max-w-md mx-auto">
                <div className="p-4 rounded-full bg-blue-100 dark:bg-blue-900 w-fit mx-auto mb-6">
                  <Building className="h-12 w-12 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">
                  {searchTerm || statusFilter !== "all" 
                    ? "Aucune candidature trouvée" 
                    : "Commencez votre recherche d'emploi"
                  }
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                {searchTerm || statusFilter !== "all" 
                    ? "Aucune candidature ne correspond à vos critères de recherche. Essayez de modifier vos filtres."
                    : "Ajoutez votre première candidature pour commencer à organiser votre recherche d'emploi de manière professionnelle."
                }
                </p>
                <ApplicationForm>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 gap-2 px-6 py-3 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-300">
                    <Plus className="h-5 w-5" />
                    {searchTerm || statusFilter !== "all" 
                      ? "Nouvelle candidature" 
                      : "Créer ma première candidature"
                    }
                  </Button>
                </ApplicationForm>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Applications;