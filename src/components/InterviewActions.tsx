import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
import {
  MoreHorizontal, Edit, Trash2, Calendar, Video, Phone,
  Mail, Copy, CheckCircle, XCircle, AlertCircle, Clock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import InterviewForm from "@/components/InterviewForm";
import { Interview } from "@/contexts/AppContext";

interface InterviewActionsProps {
  interview: Interview;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onStatusChange?: (id: string, status: string) => void;
}

const InterviewActions = ({ 
  interview, 
  onEdit, 
  onDelete, 
  onStatusChange 
}: InterviewActionsProps) => {
  const { toast } = useToast();

  const handleJoinMeeting = () => {
    if (interview.meeting_link) {
      window.open(interview.meeting_link, '_blank');
      toast({
        title: "Réunion ouverte",
        description: "Redirection vers la visioconférence",
      });
    } else {
      toast({
        title: "Aucun lien disponible",
        description: "Pas de lien de réunion configuré",
        variant: "destructive",
      });
      // L'erreur est déjà gérée dans le contexte
      // L'erreur est déjà gérée dans le contexte
    }
  };

  const handleCall = () => {
    toast({
      title: "Appel initié",
      description: `Préparation de l'appel avec ${interview.interviewer || 'l\'intervieweur'}`,
    });
  };

  const handleEmail = () => {
    const subject = `Entretien ${interview.company} - ${interview.position}`;
    const body = `Bonjour ${interview.interviewer || 'Madame, Monsieur'},\n\nConcernant notre entretien prévu le ${new Date(interview.interview_date).toLocaleDateString('fr-FR')} à ${interview.interview_time}.\n\nCordialement`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
    
    toast({
      title: "Email ouvert",
      description: "Votre client email s'est ouvert",
    });
  };

  const handleCopyDetails = () => {
    const details = `Entretien: ${interview.position} chez ${interview.company}
Date: ${new Date(interview.interview_date).toLocaleDateString('fr-FR')}
Heure: ${interview.interview_time}
Type: ${interview.type}
Lieu: ${interview.location || 'Non spécifié'}
Intervieweur: ${interview.interviewer || 'Non spécifié'}
Statut: ${interview.status}
${interview.meeting_link ? `Lien: ${interview.meeting_link}` : ''}`;
    
    navigator.clipboard.writeText(details).then(() => {
      toast({
        title: "Détails copiés",
        description: "Les informations ont été copiées",
      });
    });
  };

  const handleDelete = () => {
    onDelete?.(interview.id);
  };

  return (
    <div className="flex items-center gap-2">
      {interview.meeting_link && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleJoinMeeting}
        >
          <Video className="h-4 w-4" />
        </Button>
      )}
      
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={handleCall}
      >
        <Phone className="h-4 w-4" />
      </Button>
      
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
          
          <DropdownMenuItem onClick={handleCopyDetails}>
            <Copy className="h-4 w-4 mr-2" />
            Copier les détails
          </DropdownMenuItem>
          
          <InterviewForm interview={interview}>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <Edit className="h-4 w-4 mr-2" />
              Modifier l'entretien
            </DropdownMenuItem>
          </InterviewForm>

          <DropdownMenuSeparator />
          <DropdownMenuLabel>Changer le statut</DropdownMenuLabel>
          
          <DropdownMenuItem onClick={() => onStatusChange?.(interview.id, "confirmé")}>
            <CheckCircle className="h-4 w-4 mr-2" />
            Confirmer
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => onStatusChange?.(interview.id, "à confirmer")}>
            <AlertCircle className="h-4 w-4 mr-2" />
            À confirmer
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => onStatusChange?.(interview.id, "reporté")}>
            <Calendar className="h-4 w-4 mr-2" />
            Reporter
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => onStatusChange?.(interview.id, "annulé")}>
            <XCircle className="h-4 w-4 mr-2" />
            Annuler
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
                  Êtes-vous sûr de vouloir supprimer cet entretien ?
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
  );
};

export default InterviewActions;