
import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Building, Calendar, MapPin, ExternalLink, Plus, Search, 
  Filter, MoreHorizontal, Edit, Trash2, Eye 
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Applications = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const applications = [
    {
      id: 1,
      company: "TechCorp",
      position: "Développeur Frontend React",
      location: "Paris, France",
      status: "En cours",
      appliedDate: "2024-01-15",
      salary: "45-55k €",
      statusColor: "bg-blue-100 text-blue-800",
      description: "Développement d'applications web modernes avec React et TypeScript"
    },
    {
      id: 2,
      company: "StartupXYZ",
      position: "UX/UI Designer",
      location: "Lyon, France",
      status: "Entretien",
      appliedDate: "2024-01-12",
      salary: "40-50k €",
      statusColor: "bg-green-100 text-green-800",
      description: "Conception d'interfaces utilisateur innovantes"
    },
    {
      id: 3,
      company: "DataCorp",
      position: "Data Analyst",
      location: "Marseille, France",
      status: "Refusé",
      appliedDate: "2024-01-10",
      salary: "35-45k €",
      statusColor: "bg-red-100 text-red-800",
      description: "Analyse de données et création de rapports"
    },
    {
      id: 4,
      company: "InnovLab",
      position: "Product Manager",
      location: "Toulouse, France",
      status: "En attente",
      appliedDate: "2024-01-08",
      salary: "50-60k €",
      statusColor: "bg-yellow-100 text-yellow-800",
      description: "Gestion de produits technologiques"
    },
  ];

  const filteredApplications = applications.filter(app =>
    app.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Candidatures</h1>
            <p className="text-gray-600 mt-1">Gérez toutes vos candidatures en un seul endroit</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle candidature
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher par entreprise ou poste..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filtrer
          </Button>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">Toutes ({applications.length})</TabsTrigger>
            <TabsTrigger value="pending">En cours (1)</TabsTrigger>
            <TabsTrigger value="interview">Entretien (1)</TabsTrigger>
            <TabsTrigger value="waiting">En attente (1)</TabsTrigger>
            <TabsTrigger value="rejected">Refusé (1)</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="grid gap-4">
              {filteredApplications.map((app) => (
                <Card key={app.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <Building className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900">{app.company}</h3>
                            <p className="text-lg text-gray-700">{app.position}</p>
                          </div>
                          <Badge className={app.statusColor}>
                            {app.status}
                          </Badge>
                        </div>
                        
                        <p className="text-gray-600 mb-4">{app.description}</p>
                        
                        <div className="flex items-center gap-6 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {app.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(app.appliedDate).toLocaleDateString('fr-FR')}
                          </div>
                          <div className="font-medium text-green-600">
                            {app.salary}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Voir
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Voir l'offre
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Applications;
