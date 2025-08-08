import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  FileText, Upload, Download, Eye, Share2, 
  Plus, Search, Filter, MoreHorizontal, 
  Edit, Trash2, Copy, Calendar, File, Loader2
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

const Documents = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  // Simuler le chargement des documents
  useEffect(() => {
    setLoading(true);
    // Simuler un délai de chargement
    setTimeout(() => {
      setDocuments([]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.doc,.docx,.jpg,.jpeg,.png';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // Simuler l'upload
        toast({
          title: "Upload en cours",
          description: `Téléchargement de ${file.name}...`,
        });
        
        setTimeout(() => {
          const newDoc = {
            id: Date.now(),
            name: file.name,
            type: file.name.includes('CV') ? 'CV' : 'Document',
            size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
            lastModified: new Date().toISOString().split('T')[0],
            category: 'Personnel',
            shared: false,
            icon: FileText,
            color: 'text-blue-500'
          };
          
          setDocuments(prev => [newDoc, ...prev]);
          
          toast({
            title: "Upload réussi",
            description: `${file.name} a été téléchargé avec succès`,
          });
        }, 2000);
      }
    };
    input.click();
  };

  const handleDownload = (doc: any) => {
    toast({
      title: "Téléchargement",
      description: `Téléchargement de ${doc.name}...`,
    });
  };

  const handleShare = (doc: any) => {
    toast({
      title: "Partage",
      description: `Lien de partage généré pour ${doc.name}`,
    });
  };

  const handleDelete = (docId: number) => {
    setDocuments(prev => prev.filter(doc => doc.id !== docId));
    toast({
      title: "Document supprimé",
      description: "Le document a été supprimé avec succès",
    });
  };

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

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-lg font-medium text-slate-700 dark:text-slate-300">Chargement des documents...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Documents</h1>
            <p className="text-gray-600 mt-1">Gérez vos documents de candidature</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleUpload}>
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
                  <p className="text-2xl font-bold">{documents.length}</p>
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
                  <p className="text-2xl font-bold">0</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Liste des documents */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Mes documents ({filteredDocuments.length})</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Trier
                </Button>
                <Button variant="outline" size="sm" onClick={handleUpload}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nouveau document
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredDocuments.length === 0 ? (
              <div className="text-center py-16">
                <div className="p-4 rounded-full bg-blue-100 dark:bg-blue-900 w-fit mx-auto mb-6">
                  <FileText className="h-12 w-12 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">
                  Aucun document
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  Commencez par télécharger votre CV ou d'autres documents importants
                </p>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleUpload}>
                  <Upload className="h-4 w-4 mr-2" />
                  Télécharger mon premier document
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredDocuments.map((doc) => (
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
                      <Button variant="ghost" size="sm" onClick={() => handleDownload(doc)}>
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleShare(doc)}>
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
                          <DropdownMenuItem onClick={() => handleShare(doc)}>
                            <Share2 className="h-4 w-4 mr-2" />
                            Partager
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDownload(doc)}>
                            <Download className="h-4 w-4 mr-2" />
                            Télécharger
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => handleDelete(doc.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Documents;