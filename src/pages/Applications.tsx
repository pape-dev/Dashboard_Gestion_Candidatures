import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Building, Plus, Download, Upload, Filter, Settings,
  BarChart3, Calendar, Users, Target, TrendingUp
} from "lucide-react";
import ApplicationForm from "@/components/ApplicationForm";
import ApplicationsStats from "@/components/ApplicationsStats";
import ApplicationsFilters from "@/components/ApplicationsFilters";
import ApplicationCard from "@/components/ApplicationCard";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const Applications = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedApps, setSelectedApps] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<"cards" | "table" | "timeline">("cards");
  const { toast } = useToast();
  
  const applications = [
    {
      id: 1,
      company: "Google",
      position: "Senior Frontend Developer",
      location: "Paris, France",
      status: "En cours",
      appliedDate: "2024-01-15",
      salary: "80-95k €",
      statusColor: "bg-blue-100 text-blue-800 border-blue-200",
      description: "Développement d'applications web modernes avec React et TypeScript pour l'équipe Google Workspace. Responsabilités incluant l'architecture frontend, l'optimisation des performances et la collaboration avec les équipes backend.",
      priority: "high",
      contactPerson: "Marie Dubois",
      contactEmail: "marie.dubois@google.com",
      nextStep: "Entretien technique prévu",
      tags: ["React", "TypeScript", "Remote", "Tech Lead"],
      logo: "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=64&h=64&fit=crop&crop=center"
    },
    {
      id: 2,
      company: "Microsoft",
      position: "UX/UI Designer Senior",
      location: "Lyon, France",
      status: "Entretien",
      appliedDate: "2024-01-12",
      salary: "65-75k €",
      statusColor: "bg-green-100 text-green-800 border-green-200",
      description: "Conception d'interfaces utilisateur innovantes pour les produits Microsoft 365. Travail sur les guidelines de design, prototypage et tests utilisateurs.",
      priority: "high",
      contactPerson: "Jean Martin",
      contactEmail: "jean.martin@microsoft.com",
      nextStep: "2ème entretien - 25 Jan",
      tags: ["Figma", "Design System", "UX Research"],
      logo: "https://images.unsplash.com/photo-1633409361618-c73427e4e206?w=64&h=64&fit=crop&crop=center"
    },
    {
      id: 3,
      company: "Airbnb",
      position: "Data Analyst",
      location: "Marseille, France",
      status: "Refusé",
      appliedDate: "2024-01-10",
      salary: "55-65k €",
      statusColor: "bg-red-100 text-red-800 border-red-200",
      description: "Analyse de données et création de rapports pour optimiser l'expérience utilisateur sur la plateforme Airbnb.",
      priority: "medium",
      contactPerson: "Sophie Chen",
      contactEmail: "sophie.chen@airbnb.com",
      nextStep: "Candidature fermée",
      tags: ["Python", "SQL", "Analytics", "Remote"],
      logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=64&h=64&fit=crop&crop=center"
    },
    {
      id: 4,
      company: "Stripe",
      position: "Product Manager",
      location: "Remote",
      status: "En attente",
      appliedDate: "2024-01-08",
      salary: "90-110k €",
      statusColor: "bg-yellow-100 text-yellow-800 border-yellow-200",
      description: "Gestion de produits fintech et coordination avec les équipes techniques pour développer de nouvelles fonctionnalités de paiement.",
      priority: "high",
      contactPerson: "Alex Johnson",
      contactEmail: "alex.johnson@stripe.com",
      nextStep: "Réponse attendue sous 1 semaine",
      tags: ["Product", "Fintech", "Remote", "Strategy"],
      logo: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=64&h=64&fit=crop&crop=center"
    },
    {
      id: 5,
      company: "Netflix",
      position: "DevOps Engineer",
      location: "Toulouse, France",
      status: "Accepté",
      appliedDate: "2024-01-05",
      salary: "75-90k €",
      statusColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
      description: "Infrastructure cloud et déploiement continu pour les services de streaming Netflix. Gestion des pipelines CI/CD et monitoring.",
      priority: "high",
      contactPerson: "Carlos Rodriguez",
      contactEmail: "carlos.rodriguez@netflix.com",
      nextStep: "Signature du contrat",
      tags: ["AWS", "Docker", "Kubernetes", "CI/CD"],
      logo: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=64&h=64&fit=crop&crop=center"
    },
    {
      id: 6,
      company: "Slack",
      position: "Full Stack Developer",
      location: "Nice, France",
      status: "En cours",
      appliedDate: "2024-01-03",
      salary: "70-85k €",
      statusColor: "bg-blue-100 text-blue-800 border-blue-200",
      description: "Développement full-stack pour améliorer les fonctionnalités de collaboration et d'intégration avec les outils tiers.",
      priority: "medium",
      contactPerson: "Emma Wilson",
      contactEmail: "emma.wilson@slack.com",
      nextStep: "Test technique à faire",
      tags: ["React", "Node.js", "GraphQL", "Remote"],
      logo: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=64&h=64&fit=crop&crop=center"
    }
  ];

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
    console.log(`Suppression de la candidature ${id}`);
    // Ici on pourrait mettre à jour l'état local pour retirer la candidature
  };

  const handleApplicationView = (id: number) => {
    console.log(`Affichage des détails de la candidature ${id}`);
  };

  const handleStatusChange = (id: number, newStatus: string) => {
    console.log(`Changement de statut pour la candidature ${id}: ${newStatus}`);
    // Ici on pourrait mettre à jour l'état local
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Enhanced Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
              Gestionnaire de Candidatures
            </h1>
            <p className="text-lg text-gray-600">
              Suivez et gérez toutes vos candidatures professionnelles
            </p>
            <div className="flex items-center gap-4 mt-3">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                {applications.length} candidatures au total
              </Badge>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                {applications.filter(app => app.status === "En cours" || app.status === "Entretien").length} actives
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              className="gap-2 hover:bg-blue-50 border-blue-300 text-blue-700"
              onClick={handleViewAnalytics}
            >
              <BarChart3 className="h-4 w-4" />
              Analytics
            </Button>
            
            <Button 
              variant="outline" 
              className="gap-2 hover:bg-gray-50 border-gray-300"
              onClick={handleExportData}
            >
              <Download className="h-4 w-4" />
              Exporter
            </Button>
            
            <Button 
              variant="outline" 
              className="gap-2 hover:bg-gray-50 border-gray-300"
              onClick={handleImportData}
            >
              <Upload className="h-4 w-4" />
              Importer
            </Button>
            
            <ApplicationForm>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 gap-2 shadow-lg">
                <Plus className="h-4 w-4" />
                Nouvelle candidature
              </Button>
            </ApplicationForm>
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
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-12">
                  <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Vue tableau</h3>
                  <p className="text-gray-600">Cette vue sera disponible prochainement</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timeline" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-12">
                  <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Vue timeline</h3>
                  <p className="text-gray-600">Visualisation chronologique des candidatures</p>
                </div>
              </CardContent>
            </Card>
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
