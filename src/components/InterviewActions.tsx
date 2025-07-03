
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
        title: "Lien de réunion ouvert",
        description: `Redirection vers ${interview.type}`,
      });
    } else {
      toast({
        title: "Aucun lien disponible",
        description: "Pas de lien de réunion configuré",
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
      <Badge className={getStatusColor(interview.status)}>
        {interview.status}
      </Badge>
      
      {/* Actions rapides */}
      <div className="flex items-center gap-1">
        {interview.type.includes("Visio") && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 px-2 text-blue-600 hover:bg-blue-50"
            onClick={handleJoinMeeting}
          >
            <Video className="h-4 w-4" />
          </Button>
        )}
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 px-2 text-green-600 hover:bg-green-50"
          onClick={handleCall}
        >
          <Phone className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 px-2 text-purple-600 hover:bg-purple-50"
          onClick={handleEmail}
        >
          <Mail className="h-4 w-4" />
        </Button>
      </div>

      {/* Menu d'actions */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={handleCopyDetails}>
            <Copy className="mr-2 h-4 w-4" />
            Copier les détails
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onEdit?.(interview.id)}>
            <Edit className="mr-2 h-4 w-4" />
            Modifier
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleReschedule}>
            <Calendar className="mr-2 h-4 w-4" />
            Reprogrammer
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Changer le statut</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onStatusChange?.(interview.id, "confirmé")}>
            <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
            Confirmer
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onStatusChange?.(interview.id, "à confirmer")}>
            <AlertCircle className="mr-2 h-4 w-4 text-yellow-600" />
            À confirmer
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onStatusChange?.(interview.id, "annulé")}>
            <XCircle className="mr-2 h-4 w-4 text-red-600" />
            Annuler
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={() => onDelete?.(interview.id)}
            className="text-red-600 focus:text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Supprimer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default InterviewActions;
