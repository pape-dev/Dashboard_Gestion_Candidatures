import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  MoreHorizontal, Edit, Trash2, Eye, Mail, Phone, 
  ExternalLink, Star, Clock, Copy, Archive, 
  Calendar, MessageSquare, Download, Users, CheckCircle, XCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import ApplicationForm from "@/components/ApplicationForm";
import InterviewForm from "@/components/InterviewForm";

import { Application } from "@/contexts/AppContext";

interface ApplicationActionsProps {
  application: Application;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onView?: (id: string) => void;
  onStatusChange?: (id: string, status: string) => void;
}

const ApplicationActions = ({ 
  application, 
  onEdit, 
  onDelete, 
  onView, 
  onStatusChange 
}: ApplicationActionsProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const { toast } = useToast();

  const handleDelete = () => {
    onDelete?.(application.id);
  };

  const handleEdit = () => {
    onEdit?.(application.id);
  };

  const handleView = () => {
    setShowDetails(true);
  };

  const handleStatusChange = (newStatus: string) => {
    onStatusChange?.(application.id, newStatus);
  };

  const handleEmail = () => {
    if (application.contact_email) {
      const subject = encodeURIComponent(`Candidature - ${application.position}`);
      const body = encodeURIComponent(`Bonjour ${application.contact_person || 'Madame, Monsieur'},\n\nJe me permets de vous recontacter concernant ma candidature pour le poste de ${application.position} chez ${application.company}.\n\nCordialement`);
      window.open(`mailto:${application.contact_email}?subject=${subject}&body=${body}`);
      
      toast({
        title: "Email ouvert",
        description: "Votre client email s'est ouvert avec le message pré-rempli",
      });
    } else {
      toast({
        title: "Email non disponible",
        description: "Aucune adresse email de contact n'est renseignée",
        variant: "destructive",
      });
    }
  };

  const handleCall = () => {
    toast({
      title: "Préparation de l'appel",
      description: `Prêt à appeler ${application.contact_person || 'le contact'} chez ${application.company}`,
    });
  };

  const handleViewOffer = () => {
    if (application.job_url) {
      window.open(application.job_url, '_blank');
      toast({
        title: "Offre ouverte",
        description: "L'offre d'emploi s'est ouverte dans un nouvel onglet",
      });
    } else {
      toast({
        title: "Lien non disponible",
        description: "Aucun lien vers l'offre n'est renseigné",
        variant: "destructive",
      });
    }
  };

  const handleCopyDetails = () => {
    const details = `Candidature: ${application.position} chez ${application.company}
Statut: ${application.status}
Date: ${application.applied_date ? new Date(application.applied_date).toLocaleDateString('fr-FR') : 'Non spécifié'}
Contact: ${application.contact_person || 'Non spécifié'}
Email: ${application.contact_email || 'Non spécifié'}
Localisation: ${application.location || 'Non spécifié'}
Salaire: ${application.salary_min && application.salary_max ? `${application.salary_min}-${application.salary_max}${application.salary_currency}` : 'Non spécifié'}`;
    
    navigator.clipboard.writeText(details).then(() => {
      toast({
        title: "Détails copiés",
        description: "Les informations ont été copiées dans le presse-papiers",
      });
    });
  };

  const handleExport = () => {
    const data = {
      ...application,
      exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `candidature-${application.company}-${application.position}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export réussi",
      description: "Les données ont été exportées",
    });
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleView}
        >
          <Eye className="h-4 w-4" />
        </Button>
        
        <ApplicationForm application={application}>
          <Button variant="ghost" size="sm">
            <Edit className="h-4 w-4" />
          </Button>
        </ApplicationForm>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleEmail}
        >
          <Mail className="h-4 w-4" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            <DropdownMenuItem onClick={handleView}>
              <Eye className="h-4 w-4 mr-2" />
              Voir les détails
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={handleEmail}>
              <Mail className="h-4 w-4 mr-2" />
              Envoyer un email
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={handleCall}>
              <Phone className="h-4 w-4 mr-2" />
              Appeler
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={handleViewOffer}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Voir l'offre
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuLabel>Changer le statut</DropdownMenuLabel>
            
            <DropdownMenuItem onClick={() => handleStatusChange("En cours")}>
              <Clock className="h-4 w-4 mr-2" />
              En cours
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={() => handleStatusChange("Entretien")}>
              <Users className="h-4 w-4 mr-2" />
              Entretien
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={() => handleStatusChange("Accepté")}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Accepté
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={() => handleStatusChange("Refusé")}>
              <XCircle className="h-4 w-4 mr-2" />
              Refusé
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            
            <DropdownMenuItem onClick={handleCopyDetails}>
              <Copy className="h-4 w-4 mr-2" />
              Copier les détails
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem 
                  className="text-red-600 focus:text-red-600"
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
                    Êtes-vous sûr de vouloir supprimer la candidature pour{" "}
                    <span className="font-semibold">{application.position}</span> chez{" "}
                    <span className="font-semibold">{application.company}</span> ?
                    Cette action est irréversible.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDelete}
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

      {/* Dialog des détails */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-3">
              {application.company}
            </DialogTitle>
            <DialogDescription className="text-lg">
              {application.position}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Badge className={getStatusColor(application.status)}>
                {application.status}
              </Badge>
              <span className="text-sm text-gray-500">
                Candidature du {application.applied_date ? new Date(application.applied_date).toLocaleDateString('fr-FR') : 'Date non spécifiée'}
              </span>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informations générales</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Localisation</label>
                    <p className="text-gray-900">{application.location || 'Non spécifié'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Salaire</label>
                    <p className="text-green-600 font-semibold">
                      {application.salary_min && application.salary_max 
                        ? `${application.salary_min}-${application.salary_max}${application.salary_currency}` 
                        : 'Non spécifié'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Priorité</label>
                    <p className="capitalize">{application.priority || 'Non définie'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Prochaine étape</label>
                    <p className="text-blue-600 font-medium">{application.next_step || 'Aucune action définie'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {application.description && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Description du poste</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">{application.description}</p>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-semibold text-gray-700">Personne de contact</label>
                  <p className="text-gray-900">{application.contact_person || 'Non spécifié'}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700">Email</label>
                  <p className="text-blue-600">{application.contact_email || 'Non spécifié'}</p>
                </div>
              </CardContent>
            </Card>

            {application.notes && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">{application.notes}</p>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowDetails(false)}>
              Fermer
            </Button>
            <ApplicationForm application={application}>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Edit className="h-4 w-4 mr-2" />
                Modifier
              </Button>
            </ApplicationForm>
            <InterviewForm>
              <Button className="bg-green-600 hover:bg-green-700">
                <Calendar className="h-4 w-4 mr-2" />
                Planifier entretien
              </Button>
            </InterviewForm>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

const getStatusColor = (status: string | null) => {
  switch (status) {
    case "En cours": return "bg-blue-100 text-blue-800 border-blue-200";
    case "Entretien": return "bg-green-100 text-green-800 border-green-200";
    case "En attente": return "bg-amber-100 text-amber-800 border-amber-200";
    case "Accepté": return "bg-emerald-100 text-emerald-800 border-emerald-200";
    case "Refusé": return "bg-red-100 text-red-800 border-red-200";
    default: return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export default ApplicationActions;