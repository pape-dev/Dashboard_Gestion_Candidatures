import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Save, X } from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";
import { useToast } from "@/hooks/use-toast";
import { Interview } from "@/hooks/useApplicationsData";

interface InterviewEditFormProps {
  interview: Interview | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const InterviewEditForm = ({ interview, open, onOpenChange }: InterviewEditFormProps) => {
  const [formData, setFormData] = useState({
    company: "",
    position: "",
    date: "",
    time: "",
    type: "",
    location: "",
    interviewer: "",
    duration: "",
    status: "",
    notes: "",
    meetingLink: ""
  });

  const { updateInterview } = useAppContext();
  const { toast } = useToast();

  useEffect(() => {
    if (interview) {
      setFormData({
        company: interview.company || "",
        position: interview.position || "",
        date: interview.date || "",
        time: interview.time || "",
        type: interview.type || "",
        location: interview.location || "",
        interviewer: interview.interviewer || "",
        duration: interview.duration || "",
        status: interview.status || "",
        notes: interview.notes || "",
        meetingLink: interview.meetingLink || ""
      });
    }
  }, [interview]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!interview) return;

    if (!formData.company || !formData.position || !formData.date || !formData.time) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    const updatedInterview = {
      ...interview,
      ...formData
    };

    updateInterview(interview.id, updatedInterview);
    
    toast({
      title: "✅ Entretien modifié",
      description: `L'entretien avec ${formData.company} a été mis à jour avec succès`,
    });

    onOpenChange(false);
  };

  if (!interview) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Calendar className="h-5 w-5 text-blue-600" />
            Modifier l'entretien avec {interview.company}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-company">Entreprise *</Label>
              <Input
                id="edit-company"
                value={formData.company}
                onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                placeholder="Nom de l'entreprise"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-position">Poste *</Label>
              <Input
                id="edit-position"
                value={formData.position}
                onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                placeholder="Intitulé du poste"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-date">Date *</Label>
              <Input
                id="edit-date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-time">Heure *</Label>
              <Input
                id="edit-time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-type">Type d'entretien</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Entretien RH">Entretien RH</SelectItem>
                  <SelectItem value="Entretien technique">Entretien technique</SelectItem>
                  <SelectItem value="Entretien avec l'équipe">Entretien avec l'équipe</SelectItem>
                  <SelectItem value="Entretien final">Entretien final</SelectItem>
                  <SelectItem value="Entretien téléphonique">Entretien téléphonique</SelectItem>
                  <SelectItem value="Présentation">Présentation</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-duration">Durée estimée</Label>
              <Select value={formData.duration} onValueChange={(value) => setFormData(prev => ({ ...prev, duration: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Durée" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30min">30 minutes</SelectItem>
                  <SelectItem value="45min">45 minutes</SelectItem>
                  <SelectItem value="1h">1 heure</SelectItem>
                  <SelectItem value="1h30">1h30</SelectItem>
                  <SelectItem value="2h">2 heures</SelectItem>
                  <SelectItem value="2h30">2h30</SelectItem>
                  <SelectItem value="3h">3 heures</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-location">Lieu / Format</Label>
              <Input
                id="edit-location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Ex: Visioconférence, Paris 9ème, etc."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-interviewer">Intervieweur</Label>
              <Input
                id="edit-interviewer"
                value={formData.interviewer}
                onChange={(e) => setFormData(prev => ({ ...prev, interviewer: e.target.value }))}
                placeholder="Nom de l'intervieweur"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-status">Statut</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="à confirmer">À confirmer</SelectItem>
                <SelectItem value="confirmé">Confirmé</SelectItem>
                <SelectItem value="en attente">En attente</SelectItem>
                <SelectItem value="reporté">Reporté</SelectItem>
                <SelectItem value="annulé">Annulé</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-meetingLink">Lien de visioconférence</Label>
            <Input
              id="edit-meetingLink"
              value={formData.meetingLink}
              onChange={(e) => setFormData(prev => ({ ...prev, meetingLink: e.target.value }))}
              placeholder="https://meet.google.com/xyz-abc-def"
              type="url"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-notes">Notes / Préparation</Label>
            <Textarea
              id="edit-notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Notes importantes, points à aborder, documents à préparer..."
              rows={3}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="gap-2"
            >
              <X className="h-4 w-4" />
              Annuler
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 gap-2"
            >
              <Save className="h-4 w-4" />
              Sauvegarder les modifications
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InterviewEditForm;