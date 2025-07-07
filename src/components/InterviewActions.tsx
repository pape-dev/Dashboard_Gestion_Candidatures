
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  MoreHorizontal, Edit, Trash2, Calendar, Video, Phone,
  Mail, MapPin, Clock, CheckCircle, XCircle, AlertCircle, Copy
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Interview } from "@/hooks/useApplicationsData";

interface InterviewActionsProps {
  interview: Interview;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onStatusChange?: (id: number, status: string) => void;
}

const InterviewActions = ({ 
  interview, 
  onEdit, 
  onDelete, 
  onStatusChange 
}: InterviewActionsProps) => {
  const { toast } = useToast();

  const handleJoinMeeting = () => {
    if (interview.meetingLink) {
      window.open(interview.meetingLink, '_blank');
      toast({
        title: "Réunion ouverte",
        description: `Redirection vers la visioconférence`,
      });
    } else {
      toast({
        title: "Aucun lien disponible",
        description: "Pas de lien de réunion configuré pour cet entretien",
        variant: "destructive",
      });
    }
  };

  const handleCall = () => {
    toast({
      title: "Appel initié",
      description: `Préparation de l'appel avec ${interview.interviewer}`,
    });
  };

  const handleEmail = () => {
    const subject = `Entretien ${interview.company} - ${interview.position}`;
    const body = `Bonjour ${interview.interviewer},\n\nConcernant notre entretien prévu le ${new Date(interview.date).toLocaleDateString('fr-FR')} à ${interview.time}.\n\nCordialement`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  const handleReschedule = () => {
    toast({
      title: "Reprogrammer l'entretien",
      description: "Ouverture du calendrier de reprogrammation...",
    });
  };

  const handleCopyDetails = () => {
    const details = `Entretien ${interview.company}\nPoste: ${interview.position}\nDate: ${new Date(interview.date).toLocaleDateString('fr-FR')}\nHeure: ${interview.time}\nType: ${interview.type}\nLieu: ${interview.location}\nIntervieweur: ${interview.interviewer}`;
    navigator.clipboard.writeText(details);
    toast({
      title: "Détails copiés",
      description: "Les informations de l'entretien ont été copiées",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmé":
        return "bg-green-100 text-green-800";
      case "à confirmer":
        return "bg-yellow-100 text-yellow-800";
      case "en attente":
        return "bg-blue-100 text-blue-800";
      case "annulé":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* Actions rapides principales */}
      <div className="flex items-center gap-1">
        {interview.meetingLink && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 px-3 text-blue-600 hover:bg-blue-50 hover:text-blue-700 border border-blue-200 hover:border-blue-300 transition-all"
            onClick={handleJoinMeeting}
            title="Rejoindre la réunion"
          >
            <Video className="h-4 w-4 mr-1" />
            <span className="text-xs font-medium">Rejoindre</span>
          </Button>
        )}
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 px-3 text-green-600 hover:bg-green-50 hover:text-green-700 border border-green-200 hover:border-green-300 transition-all"
          onClick={handleCall}
          title="Appeler"
        >
          <Phone className="h-4 w-4 mr-1" />
          <span className="text-xs font-medium">Appeler</span>
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 px-3 text-purple-600 hover:bg-purple-50 hover:text-purple-700 border border-purple-200 hover:border-purple-300 transition-all"
          onClick={handleEmail}
          title="Envoyer un email"
        >
          <Mail className="h-4 w-4 mr-1" />
          <span className="text-xs font-medium">Email</span>
        </Button>
      </div>

      {/* Menu d'actions avancées */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100 transition-colors">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64 bg-white shadow-xl border border-gray-200 rounded-lg">
          <DropdownMenuLabel className="font-semibold text-gray-900">Actions disponibles</DropdownMenuLabel>
          
          <DropdownMenuItem onClick={handleCopyDetails} className="hover:bg-blue-50 transition-colors">
            <Copy className="mr-3 h-4 w-4 text-blue-600" />
            <div>
              <p className="font-medium">Copier les détails</p>
              <p className="text-xs text-gray-500">Copier toutes les informations</p>
            </div>
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => onEdit?.(interview.id)} className="hover:bg-orange-50 transition-colors">
            <Edit className="mr-3 h-4 w-4 text-orange-600" />
            <div>
              <p className="font-medium">Modifier l'entretien</p>
              <p className="text-xs text-gray-500">Éditer les informations</p>
            </div>
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={handleReschedule} className="hover:bg-purple-50 transition-colors">
            <Calendar className="mr-3 h-4 w-4 text-purple-600" />
            <div>
              <p className="font-medium">Reprogrammer</p>
              <p className="text-xs text-gray-500">Changer la date/heure</p>
            </div>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          <DropdownMenuLabel className="font-semibold text-gray-900">Changer le statut</DropdownMenuLabel>
          
          <DropdownMenuItem onClick={() => onStatusChange?.(interview.id, "confirmé")} className="hover:bg-green-50 transition-colors">
            <CheckCircle className="mr-3 h-4 w-4 text-green-600" />
            <div>
              <p className="font-medium text-green-700">Confirmer</p>
              <p className="text-xs text-gray-500">Marquer comme confirmé</p>
            </div>
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => onStatusChange?.(interview.id, "à confirmer")} className="hover:bg-yellow-50 transition-colors">
            <AlertCircle className="mr-3 h-4 w-4 text-yellow-600" />
            <div>
              <p className="font-medium text-yellow-700">À confirmer</p>
              <p className="text-xs text-gray-500">En attente de confirmation</p>
            </div>
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => onStatusChange?.(interview.id, "en attente")} className="hover:bg-blue-50 transition-colors">
            <Clock className="mr-3 h-4 w-4 text-blue-600" />
            <div>
              <p className="font-medium text-blue-700">En attente</p>
              <p className="text-xs text-gray-500">En attente de réponse</p>
            </div>
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => onStatusChange?.(interview.id, "reporté")} className="hover:bg-orange-50 transition-colors">
            <Calendar className="mr-3 h-4 w-4 text-orange-600" />
            <div>
              <p className="font-medium text-orange-700">Reporter</p>
              <p className="text-xs text-gray-500">Reporter à plus tard</p>
            </div>
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => onStatusChange?.(interview.id, "annulé")} className="hover:bg-red-50 transition-colors">
            <XCircle className="mr-3 h-4 w-4 text-red-600" />
            <div>
              <p className="font-medium text-red-700">Annuler</p>
              <p className="text-xs text-gray-500">Annuler définitivement</p>
            </div>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={() => onDelete?.(interview.id)}
            className="text-red-600 focus:text-red-600 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="mr-3 h-4 w-4 text-red-600" />
            <div>
              <p className="font-medium text-red-700">Supprimer</p>
              <p className="text-xs text-red-500">Suppression définitive</p>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default InterviewActions;
