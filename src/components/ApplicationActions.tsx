
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  MoreHorizontal, Edit, Trash2, Eye, Mail, Phone, 
  ExternalLink, Star, Clock, Settings, Copy, Archive 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface Application {
  id: number;
  company: string;
  position: string;
  location: string;
  status: string;
  appliedDate: string;
  salary: string;
  statusColor: string;
  description: string;
  priority: string;
  contactPerson: string;
  contactEmail: string;
  nextStep: string;
  tags: string[];
}

interface ApplicationActionsProps {
  application: Application;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onView?: (id: number) => void;
}

const ApplicationActions = ({ application, onEdit, onDelete, onView }: ApplicationActionsProps) => {
  const [showDetails, setShowDetails] = useState(false);

  const handleDelete = () => {
    console.log(`Suppression de la candidature ${application.id}`);
    onDelete?.(application.id);
  };

  const handleEdit = () => {
    console.log(`Modification de la candidature ${application.id}`);
    onEdit?.(application.id);
  };

  const handleView = () => {
    console.log(`Affichage des détails de la candidature ${application.id}`);
    onView?.(application.id);
    setShowDetails(true);
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

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "high": return "Haute";
      case "medium": return "Moyenne";
      case "low": return "Faible";
      default: return "Non définie";
    }
  };

  return (
    <>
      {/* Boutons d'action rapide */}
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          onClick={handleView}
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 px-2 text-green-600 hover:text-green-700 hover:bg-green-50"
          onClick={handleEdit}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 px-2 text-gray-600 hover:text-gray-700 hover:bg-gray-50"
        >
          <Mail className="h-4 w-4" />
        </Button>

        {/* Menu déroulant avec plus d'options */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 text-gray-600 hover:text-gray-700 hover:bg-gray-100"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-white shadow-xl border-0 rounded-xl">
            <DropdownMenuLabel className="font-semibold text-gray-900">
              Actions rapides
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            <DropdownMenuItem 
              className="gap-3 py-2.5 cursor-pointer hover:bg-blue-50 text-blue-700"
              onClick={handleView}
            >
              <Eye className="h-4 w-4" />
              <span className="font-medium">Voir les détails</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              className="gap-3 py-2.5 cursor-pointer hover:bg-green-50 text-green-700"
              onClick={handleEdit}
            >
              <Edit className="h-4 w-4" />
              <span className="font-medium">Modifier</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem className="gap-3 py-2.5 cursor-pointer hover:bg-purple-50 text-purple-700">
              <Mail className="h-4 w-4" />
              <span className="font-medium">Envoyer un email</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem className="gap-3 py-2.5 cursor-pointer hover:bg-indigo-50 text-indigo-700">
              <Phone className="h-4 w-4" />
              <span className="font-medium">Appeler</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem className="gap-3 py-2.5 cursor-pointer hover:bg-teal-50 text-teal-700">
              <ExternalLink className="h-4 w-4" />
              <span className="font-medium">Voir l'offre</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem className="gap-3 py-2.5 cursor-pointer hover:bg-gray-50 text-gray-700">
              <Copy className="h-4 w-4" />
              <span className="font-medium">Dupliquer</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem className="gap-3 py-2.5 cursor-pointer hover:bg-orange-50 text-orange-700">
              <Archive className="h-4 w-4" />
              <span className="font-medium">Archiver</span>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem 
                  className="gap-3 py-2.5 cursor-pointer hover:bg-red-50 text-red-600 focus:bg-red-50 focus:text-red-600"
                  onSelect={(e) => e.preventDefault()}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="font-medium">Supprimer</span>
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent className="sm:max-w-md">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-red-600">
                    Confirmer la suppression
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-gray-600">
                    Êtes-vous sûr de vouloir supprimer la candidature pour{" "}
                    <span className="font-semibold">{application.position}</span> chez{" "}
                    <span className="font-semibold">{application.company}</span> ?
                    Cette action est irréversible.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="border-gray-300">
                    Annuler
                  </AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDelete}
                    className="bg-red-600 hover:bg-red-700 text-white"
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
            <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              {application.company}
              {getPriorityIcon(application.priority)}
            </DialogTitle>
            <DialogDescription className="text-lg text-gray-600">
              {application.position}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Badge className={`${application.statusColor} font-medium px-3 py-1`}>
                {application.status}
              </Badge>
              <span className="text-sm text-gray-500">
                Candidature du {new Date(application.appliedDate).toLocaleDateString('fr-FR')}
              </span>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings className="h-5 w-5 text-blue-600" />
                  Informations générales
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Localisation</label>
                    <p className="text-gray-900">{application.location}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Salaire</label>
                    <p className="text-green-600 font-semibold">{application.salary}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Priorité</label>
                    <p className="flex items-center gap-2">
                      {getPriorityIcon(application.priority)}
                      {getPriorityLabel(application.priority)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Prochaine étape</label>
                    <p className="text-blue-600 font-medium">{application.nextStep}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Description du poste</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{application.description}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-semibold text-gray-700">Personne de contact</label>
                  <p className="text-gray-900">{application.contactPerson}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700">Email</label>
                  <p className="text-blue-600">{application.contactEmail}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Compétences</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {application.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="px-3 py-1">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowDetails(false)}>
              Fermer
            </Button>
            <Button 
              onClick={handleEdit}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Edit className="h-4 w-4 mr-2" />
              Modifier
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ApplicationActions;
