import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const documentSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  type: z.enum(["cv", "portfolio", "certificate", "other"]),
  description: z.string().optional(),
  is_public: z.boolean().default(false),
});

type DocumentFormData = z.infer<typeof documentSchema>;

const Documents = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingDoc, setEditingDoc] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const form = useForm<DocumentFormData>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      name: '',
      type: 'other',
      description: '',
      is_public: false,
    }
  });

  useEffect(() => {
    if (user) {
      loadDocuments();
    }
  }, [user]);

  const loadDocuments = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_documents')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les documents",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      form.setValue('name', file.name);
      
      // Déterminer le type automatiquement
      if (file.name.toLowerCase().includes('cv')) {
        form.setValue('type', 'cv');
      } else if (file.type.startsWith('image/')) {
        form.setValue('type', 'portfolio');
      } else {
        form.setValue('type', 'other');
      }
    }
  };

  const handleSubmit = async (data: DocumentFormData) => {
    if (!user || !selectedFile) {
      toast({
        title: "Fichier manquant",
        description: "Veuillez sélectionner un fichier",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploading(true);

      // Upload du fichier
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(fileName);

      // Enregistrer les métadonnées
      const { data: newDoc, error: insertError } = await supabase
        .from('user_documents')
        .insert({
          user_id: user.id,
          name: data.name,
          type: data.type,
          description: data.description || null,
          is_public: data.is_public,
          file_url: publicUrl,
          file_size: selectedFile.size,
          mime_type: selectedFile.type,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      setDocuments(prev => [newDoc, ...prev]);
      setShowForm(false);
      setSelectedFile(null);
      form.reset();

      toast({
        title: "Document ajouté",
        description: "Le document a été téléchargé avec succès",
      });
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
      toast({
        title: "Erreur",
        description: "Impossible de télécharger le document",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const doc = documents.find(d => d.id === id);
      if (!doc) return;

      // Supprimer le fichier du storage
      const fileName = doc.file_url.split('/').pop();
      await supabase.storage
        .from('documents')
        .remove([`${user.id}/${fileName}`]);

      // Supprimer les métadonnées
      const { error } = await supabase
        .from('user_documents')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setDocuments(prev => prev.filter(d => d.id !== id));

      toast({
        title: "Document supprimé",
        description: "Le document a été supprimé avec succès",
      });
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le document",
        variant: "destructive",
      });
    }
  };

  const handleDownload = (doc: any) => {
    window.open(doc.file_url, '_blank');
    toast({
      title: "Téléchargement",
      description: `Téléchargement de ${doc.name}`,
    });
  };

  const handleShare = async (doc: any) => {
    try {
      await navigator.clipboard.writeText(doc.file_url);
      toast({
        title: "Lien copié",
        description: "Le lien de partage a été copié",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de copier le lien",
        variant: "destructive",
      });
    }
  };

  const filteredDocuments = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryColor = (type: string) => {
    const colors = {
      "cv": "bg-blue-100 text-blue-800",
      "portfolio": "bg-green-100 text-green-800",
      "certificate": "bg-purple-100 text-purple-800",
      "other": "bg-gray-100 text-gray-800"
    };
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'cv': return FileText;
      case 'portfolio': return Eye;
      case 'certificate': return Award;
      default: return File;
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-lg font-medium">Chargement des documents...</p>
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
          <Dialog open={showForm} onOpenChange={setShowForm}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Upload className="h-4 w-4 mr-2" />
                Télécharger
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter un document</DialogTitle>
              </DialogHeader>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="file">Fichier *</Label>
                  <Input
                    id="file"
                    type="file"
                    onChange={handleFileSelect}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp"
                  />
                  <p className="text-sm text-gray-500">
                    Formats acceptés: PDF, DOC, DOCX, JPG, PNG, WebP
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Nom du document *</Label>
                  <Input
                    id="name"
                    {...form.register('name')}
                    placeholder="Mon CV 2024"
                  />
                  {form.formState.errors.name && (
                    <p className="text-sm text-red-600">{form.formState.errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Type *</Label>
                  <Select 
                    value={form.watch('type')} 
                    onValueChange={(value) => form.setValue('type', value as any)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cv">CV</SelectItem>
                      <SelectItem value="portfolio">Portfolio</SelectItem>
                      <SelectItem value="certificate">Certificat</SelectItem>
                      <SelectItem value="other">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    {...form.register('description')}
                    placeholder="Description du document..."
                    rows={3}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_public"
                    {...form.register('is_public')}
                    className="rounded"
                  />
                  <Label htmlFor="is_public">Document public</Label>
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowForm(false)}
                  >
                    Annuler
                  </Button>
                  <Button type="submit" disabled={uploading || !selectedFile}>
                    {uploading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Upload...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Télécharger
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filtres */}
        <div className="flex items-center gap-4">
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
                <FileText className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">CV</p>
                  <p className="text-2xl font-bold">{documents.filter(d => d.type === 'cv').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Portfolio</p>
                  <p className="text-2xl font-bold">{documents.filter(d => d.type === 'portfolio').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Share2 className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600">Publics</p>
                  <p className="text-2xl font-bold">{documents.filter(d => d.is_public).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Liste des documents */}
        <Card>
          <CardHeader>
            <CardTitle>Mes documents ({filteredDocuments.length})</CardTitle>
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
                  Commencez par télécharger votre CV ou d'autres documents
                </p>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700" 
                  onClick={() => setShowForm(true)}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Télécharger mon premier document
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredDocuments.map((doc) => {
                  const IconComponent = getTypeIcon(doc.type);
                  return (
                    <div key={doc.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <IconComponent className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-gray-900 truncate">{doc.name}</h3>
                          {doc.is_public && (
                            <Share2 className="h-4 w-4 text-blue-500" />
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          <Badge className={getCategoryColor(doc.type)} variant="outline">
                            {doc.type === 'cv' ? 'CV' : 
                             doc.type === 'portfolio' ? 'Portfolio' : 
                             doc.type === 'certificate' ? 'Certificat' : 'Autre'}
                          </Badge>
                          <span>{(doc.file_size / 1024 / 1024).toFixed(1)} MB</span>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(doc.created_at).toLocaleDateString('fr-FR')}
                          </div>
                        </div>
                        {doc.description && (
                          <p className="text-sm text-gray-600 mt-1">{doc.description}</p>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => window.open(doc.file_url, '_blank')}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDownload(doc)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleShare(doc)}
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => window.open(doc.file_url, '_blank')}>
                              <Eye className="h-4 w-4 mr-2" />
                              Prévisualiser
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDownload(doc)}>
                              <Download className="h-4 w-4 mr-2" />
                              Télécharger
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleShare(doc)}>
                              <Share2 className="h-4 w-4 mr-2" />
                              Partager
                            </DropdownMenuItem>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem 
                                  className="text-red-600"
                                  onSelect={(e) => e.preventDefault()}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Supprimer
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Êtes-vous sûr de vouloir supprimer "{doc.name}" ?
                                    Cette action est irréversible.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleDelete(doc.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Supprimer
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Documents;