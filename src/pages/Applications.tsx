import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Building, Calendar, MapPin, Plus, Search, 
  TrendingUp, Users, CheckCircle, XCircle, AlertCircle,
  Download, Upload, SortAsc, SortDesc, Filter, Star, Clock
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ApplicationForm from "@/components/ApplicationForm";
import ApplicationActions from "@/components/ApplicationActions";

const Applications = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedApps, setSelectedApps] = useState<number[]>([]);
  
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

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <Star className="h-4 w-4 text-yellow-500 fill-current" />;
      case "medium":
        return <Clock className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
              Candidatures
            </h1>
            <p className="text-lg text-gray-600">Gérez toutes vos candidatures avec efficacité</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2 hover:bg-gray-50 border-gray-300">
              <Download className="h-4 w-4" />
              Exporter
            </Button>
            <Button variant="outline" className="gap-2 hover:bg-gray-50 border-gray-300">
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
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Total</p>
                  <p className="text-3xl font-bold text-blue-800">{stats.total}</p>
                </div>
                <Building className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-600 text-sm font-medium">En cours</p>
                  <p className="text-3xl font-bold text-yellow-800">{stats.pending}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Entretiens</p>
                  <p className="text-3xl font-bold text-green-800">{stats.interview}</p>
                </div>
                <Users className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-600 text-sm font-medium">Acceptés</p>
                  <p className="text-3xl font-bold text-emerald-800">{stats.accepted}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-emerald-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-600 text-sm font-medium">Refusés</p>
                  <p className="text-3xl font-bold text-red-800">{stats.rejected}</p>
                </div>
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="bg-white shadow-sm border-0 shadow-xl">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex flex-1 items-center gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Rechercher par entreprise, poste ou compétence..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-2 focus:border-blue-500 transition-colors"
                  />
                </div>
                
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-48 border-2 focus:border-blue-500">
                    <SelectValue placeholder="Filtrer par statut" />
                  </SelectTrigger>
                  <SelectContent className="bg-white shadow-xl border-0 rounded-xl">
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="En cours">En cours</SelectItem>
                    <SelectItem value="Entretien">Entretien</SelectItem>
                    <SelectItem value="En attente">En attente</SelectItem>
                    <SelectItem value="Accepté">Accepté</SelectItem>
                    <SelectItem value="Refusé">Refusé</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48 border-2 focus:border-blue-500">
                    <SelectValue placeholder="Trier par" />
                  </SelectTrigger>
                  <SelectContent className="bg-white shadow-xl border-0 rounded-xl">
                    <SelectItem value="date">Date de candidature</SelectItem>
                    <SelectItem value="company">Entreprise</SelectItem>
                    <SelectItem value="salary">Salaire</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                  className="gap-2 border-2 hover:border-blue-500 hover:bg-blue-50"
                >
                  {sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                </Button>
              </div>

              {selectedApps.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 font-medium">{selectedApps.length} sélectionnée(s)</span>
                  <Button variant="outline" size="sm" className="hover:bg-blue-50 border-blue-300">
                    Actions groupées
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Bulk Actions */}
        {sortedApplications.length > 0 && (
          <div className="flex items-center gap-4 py-2">
            <Checkbox
              checked={selectedApps.length === sortedApplications.length}
              onCheckedChange={handleSelectAll}
              className="border-2"
            />
            <span className="text-sm text-gray-600">
              Sélectionner tout ({sortedApplications.length} candidatures)
            </span>
          </div>
        )}

        {/* Applications List */}
        <div className="space-y-4">
          {sortedApplications.map((app) => (
            <Card key={app.id} className="hover:shadow-2xl transition-all duration-300 border-l-4 border-l-transparent hover:border-l-blue-500 bg-white shadow-lg">
              <CardContent className="p-0">
                <div className="flex items-start p-6 gap-6">
                  <Checkbox
                    checked={selectedApps.includes(app.id)}
                    onCheckedChange={() => handleSelectApp(app.id)}
                    className="mt-1 border-2"
                  />
                  
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center flex-shrink-0 overflow-hidden shadow-md">
                    <img 
                      src={app.logo} 
                      alt={app.company}
                      className="w-full h-full object-cover rounded-2xl"
                      onError={(e) => {
                        e.currentTarget.src = '';
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <Building className="h-8 w-8 text-gray-500" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-bold text-gray-900">{app.company}</h3>
                        {getPriorityIcon(app.priority)}
                        <Badge className={`${app.statusColor} font-medium px-3 py-1`}>
                          {app.status}
                        </Badge>
                      </div>
                      
                      <ApplicationActions application={app} />
                    </div>

                    <h4 className="text-lg font-semibold text-gray-800 mb-2">{app.position}</h4>
                    <p className="text-gray-600 mb-4 line-clamp-2">{app.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {app.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs px-3 py-1 bg-gray-50">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span>{app.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>{new Date(app.appliedDate).toLocaleDateString('fr-FR')}</span>
                      </div>
                      <div className="flex items-center gap-2 font-semibold text-green-600">
                        <TrendingUp className="h-4 w-4" />
                        <span>{app.salary}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-blue-500" />
                        <span className="font-medium">{app.nextStep}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Users className="h-4 w-4" />
                          <span>{app.contactPerson}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

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
