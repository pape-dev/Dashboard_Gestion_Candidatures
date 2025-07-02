
import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, MapPin, Calendar, Building, Star, 
  ExternalLink, Bookmark, Filter, Briefcase,
  Clock, Euro, Users
} from "lucide-react";

const JobSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  
  const jobOffers = [
    {
      id: 1,
      title: "Développeur Full Stack React/Node.js",
      company: "TechVision",
      location: "Paris, France",
      salary: "45-60k €",
      type: "CDI",
      remote: "Hybride",
      postedDate: "2024-01-20",
      description: "Rejoignez une équipe dynamique pour développer des applications web innovantes. Vous travaillerez sur des projets variés avec les dernières technologies.",
      requirements: ["React", "Node.js", "TypeScript", "MongoDB"],
      benefits: ["Télétravail", "Tickets restaurant", "Mutuelle", "Formation"],
      saved: false
    },
    {
      id: 2,
      title: "UX/UI Designer Senior",
      company: "Design Studio",
      location: "Lyon, France",
      salary: "40-55k €",
      type: "CDI",
      remote: "100% remote",
      postedDate: "2024-01-18",
      description: "Nous recherchons un designer expérimenté pour concevoir des interfaces utilisateur exceptionnelles pour nos clients.",
      requirements: ["Figma", "Adobe Creative Suite", "Design System", "Prototypage"],
      benefits: ["Remote", "Congés illimités", "Budget formation", "Équipement fourni"],
      saved: true
    },
    {
      id: 3,
      title: "Product Manager",
      company: "StartupGrow",
      location: "Toulouse, France",
      salary: "50-70k €",
      type: "CDI",
      remote: "Hybride",
      postedDate: "2024-01-15",
      description: "Pilotez le développement de nos produits digitaux et travaillez étroitement avec les équipes techniques et marketing.",
      requirements: ["Product Management", "Analytics", "Roadmap", "Agile"],
      benefits: ["Stock-options", "Flexible", "Team building", "Conciergerie"],
      saved: false
    },
    {
      id: 4,
      title: "Data Scientist",
      company: "DataLab",
      location: "Bordeaux, France",
      salary: "42-58k €",
      type: "CDI",
      remote: "Présentiel",
      postedDate: "2024-01-12",
      description: "Analysez et exploitez les données pour générer des insights business et améliorer nos algorithmes de recommandation.",
      requirements: ["Python", "Machine Learning", "SQL", "Statistics"],
      benefits: ["Formation", "Congés supplémentaires", "Café illimité", "Salle de sport"],
      saved: true
    }
  ];

  const getTypeColor = (type: string) => {
    const colors = {
      "CDI": "bg-green-100 text-green-800",
      "CDD": "bg-yellow-100 text-yellow-800",
      "Freelance": "bg-blue-100 text-blue-800",
      "Stage": "bg-purple-100 text-purple-800"
    };
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getRemoteColor = (remote: string) => {
    const colors = {
      "100% remote": "bg-green-100 text-green-800",
      "Hybride": "bg-blue-100 text-blue-800",
      "Présentiel": "bg-gray-100 text-gray-800"
    };
    return colors[remote as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Recherche d'emploi</h1>
            <p className="text-gray-600 mt-1">Trouvez votre prochain emploi idéal</p>
          </div>
        </div>

        {/* Filtres de recherche */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Poste, compétences..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Localisation"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-2">
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                  <Search className="h-4 w-4 mr-2" />
                  Rechercher
                </Button>
                <Button variant="outline">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Résultats */}
        <div className="grid gap-6">
          {jobOffers.map((job) => (
            <Card key={job.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <Building className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                        <p className="text-lg text-gray-700">{job.company}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-1 text-gray-600">
                        <MapPin className="h-4 w-4" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-1 text-green-600 font-medium">
                        <Euro className="h-4 w-4" />
                        {job.salary}
                      </div>
                      <Badge className={getTypeColor(job.type)}>
                        {job.type}
                      </Badge>
                      <Badge className={getRemoteColor(job.remote)}>
                        {job.remote}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className={job.saved ? "text-yellow-600" : "text-gray-400"}
                    >
                      <Star className={`h-4 w-4 ${job.saved ? "fill-current" : ""}`} />
                    </Button>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Voir l'offre
                    </Button>
                  </div>
                </div>

                <p className="text-gray-600 mb-4">{job.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Compétences requises</h4>
                    <div className="flex flex-wrap gap-2">
                      {job.requirements.map((req, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {req}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Avantages</h4>
                    <div className="flex flex-wrap gap-2">
                      {job.benefits.map((benefit, index) => (
                        <Badge key={index} variant="outline" className="text-xs bg-green-50 text-green-700">
                          {benefit}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Clock className="h-4 w-4" />
                    Publié le {new Date(job.postedDate).toLocaleDateString('fr-FR')}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Bookmark className="h-4 w-4 mr-2" />
                      Sauvegarder
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-700" size="sm">
                      <Briefcase className="h-4 w-4 mr-2" />
                      Postuler
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default JobSearch;
