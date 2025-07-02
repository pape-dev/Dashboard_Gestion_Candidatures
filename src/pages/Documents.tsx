
import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  FileText, Upload, Download, Eye, Share2, 
  Plus, Search, Filter, MoreHorizontal, 
  Edit, Trash2, Copy, Calendar, File
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Documents = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const documents = [
    {
      id: 1,
      name: "CV_Alexandre_Dubois_2024.pdf",
      type: "CV",
      size: "2.3 MB",
      lastModified: "2024-01-20",
      category: "Personnel",
      shared: true,
      icon: FileText,
      color: "text-red-500"
    },
    {
      id: 2,
      name: "Lettre_Motivation_TechCorp.docx",
      type: "Lettre de motivation",
      size: "1.1 MB",
      lastModified: "2024-01-18",
      category: "Candidature",
      shared: false,
      icon: FileText,
      color: "text-blue-500"
    },
    {
      id: 3,
      name: "Portfolio_Projets_2024.pdf",
      type: "Portfolio",
      size: "15.7 MB",
      lastModified: "2024-01-15",
      category: "Personnel",
      shared: true,
      icon: File,
      color: "text-purple-500"
    },
    {
      id: 4,
      name: "Certificat_AWS_Developer.pdf",
      type: "Certificat",
      size: "856 KB",
      lastModified: "2024-01-12",
      category: "Certification",
      shared: false,
      icon: FileText,
      color: "text-green-500"
    },
    {
      id: 5,
      name: "Recommandation_Pierre_Martin.pdf",
      type: "Recommandation",
      size: "542 KB",
      lastModified: "2024-01-10",
      category: "Référence",
      shared: false,
      icon: FileText,
      color: "text-orange-500"
    },
    {
      id: 6,
      name: "Contrat_Stage_WebStudio.pdf",
      type: "Contrat",
      size: "1.8 MB",
      lastModified: "2024-01-08",
      category: "Légal",
      shared: false,
      icon: FileText,
      color: "text-gray-500"
    }
  ];

  const filteredDocuments = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryColor = (category: string) => {
    const colors = {
      "Personnel": "bg-blue-100 text-blue-800",
      "Candidature": "bg-green-100 text-green-800",
      "Certification": "bg-purple-100 text-purple-800",
      "Référence": "bg-orange-100 text-orange-800",
      "Légal": "bg-gray-100 text-gray-800"
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const categories = ["Tous", "Personnel", "Candidature", "Certification", "Référence", "Légal"];
  const [selectedCategory, setSelectedCategory] = useState("Tous");

  const categoryFilteredDocs = selectedCategory === "Tous" 
    ? filteredDocuments 
    : filteredDocuments.filter(doc => doc.category === selectedCategory);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Documents</h1>
            <p className="text-gray-600 mt-1">Gérez vos documents de candidature</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Upload className="h-4 w-4 mr-2" />
            Télécharger
          </Button>
        </div>

        {/* Filtres */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher un document..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="text-xs"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Total documents</p>
                  <p className="text-2xl font-bold">{documents.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Share2 className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Partagés</p>
                  <p className="text-2xl font-bold">{documents.filter(d => d.shared).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Ce mois</p>
                  <p className="text-2xl font-bold">4</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Download className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600">Téléchargements</p>
                  <p className="text-2xl font-bold">23</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Liste des documents */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Mes documents ({categoryFilteredDocs.length})</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Trier
                </Button>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Nouveau dossier
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {categoryFilteredDocs.map((doc) => (
                <div key={doc.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <doc.icon className={`h-5 w-5 ${doc.color}`} />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-gray-900 truncate">{doc.name}</h3>
                      {doc.shared && (
                        <Share2 className="h-4 w-4 text-blue-500" />
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span>{doc.type}</span>
                      <span>•</span>
                      <span>{doc.size}</span>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(doc.lastModified).toLocaleDateString('fr-FR')}
                      </div>
                      <Badge className={getCategoryColor(doc.category)} variant="outline">
                        {doc.category}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Share2 className="h-4 w-4" />
                    </Button>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          Prévisualiser
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Renommer
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="h-4 w-4 mr-2" />
                          Dupliquer
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Share2 className="h-4 w-4 mr-2" />
                          Partager
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="h-4 w-4 mr-2" />
                          Télécharger
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Documents;
