import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, MapPin, Users, Plus } from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const interviewSchema = z.object({
  applicationId: z.string().optional(),
  company: z.string().min(1, "Le nom de l'entreprise est requis"),
  position: z.string().min(1, "Le poste est requis"),
  date: z.string().min(1, "La date est requise"),
  time: z.string().min(1, "L'heure est requise"),
  type: z.string().optional(),
  location: z.string().optional(),
  interviewer: z.string().optional(),
  duration: z.string().optional(),
  status: z.string().default("à confirmer"),
  notes: z.string().optional(),
  meetingLink: z.string().url("URL invalide").optional().or(z.literal("")),
});

type InterviewFormData = z.infer<typeof interviewSchema>;

interface InterviewFormProps {
  trigger?: React.ReactNode;
}

const InterviewForm = ({ trigger }: InterviewFormProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<InterviewFormData>({
    applicationId: "",
    company: "",
    position: "",
    date: "",
    time: "",
    type: "",
    location: "",
    interviewer: "",
    duration: "",
    status: "à confirmer",
    notes: "",
    meetingLink: ""
  });

  const { applications, addInterview } = useAppContext();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validation avec Zod
      const validatedData = interviewSchema.parse(formData);
      
      // Trouver l'application correspondante si sélectionnée
      const selectedApp = applications.find(app => app.id.toString() === validatedData.applicationId);
      
      const newInterview = {
        applicationId: validatedData.applicationId ? parseInt(validatedData.applicationId) : 0,
        company: selectedApp ? selectedApp.company : validatedData.company,
        position: selectedApp ? selectedApp.position : validatedData.position,
        date: validatedData.date,
        time: validatedData.time,
        type: validatedData.type || "Entretien RH",
        location: validatedData.location || "",
        interviewer: validatedData.interviewer || "",
        duration: validatedData.duration || "1h",
        status: validatedData.status,
        notes: validatedData.notes || "",
        meetingLink: validatedData.meetingLink || ""
      };

      addInterview(newInterview);
      
      // Reset form
      setFormData({
        applicationId: "",
        company: "",
        position: "",
        date: "",
        time: "",
        type: "",
        location: "",
        interviewer: "",
        duration: "",
        status: "à confirmer",
        notes: "",
        meetingLink: ""
      });
      
      setOpen(false);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        toast({
          title: "Erreur de validation",
          description: firstError.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Erreur",
          description: "Impossible de créer l'entretien",
          variant: "destructive",
        });
      }
    }
  };

  const handleApplicationSelect = (appId: string) => {
    if (appId === "none") {
      setFormData(prev => ({
        ...prev,
        applicationId: "",
        company: "",
        position: "",
        interviewer: ""
      }));
      return;
    }
    
    const selectedApp = applications.find(app => app.id.toString() === appId);
    if (selectedApp) {
      setFormData(prev => ({
        ...prev,
        applicationId: appId,
        company: selectedApp.company,
        position: selectedApp.position,
        interviewer: selectedApp.contactPerson
      }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 gap-2 shadow-lg">
            <Plus className="h-4 w-4" />
            Nouvel entretien
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Calendar className="h-5 w-5 text-blue-600" />
            Planifier un nouvel entretien
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Sélection d'une candidature existante */}
          <div className="space-y-2">
            <Label htmlFor="applicationId">Candidature associée (optionnel)</Label>
            <Select value={formData.applicationId} onValueChange={handleApplicationSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Choisir une candidature existante" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Aucune (entretien indépendant)</SelectItem>
                {applications.map((app) => (
                  <SelectItem key={app.id} value={app.id.toString()}>
                    {app.company} - {app.position}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Entreprise */}
            <div className="space-y-2">
              <Label htmlFor="company">Entreprise *</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                placeholder="Nom de l'entreprise"
                required
              />
            </div>

            {/* Poste */}
            <div className="space-y-2">
              <Label htmlFor="position">Poste *</Label>
              <Input
                id="position"
                value={formData.position}
                onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                placeholder="Intitulé du poste"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Date */}
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                required
              />
            </div>

            {/* Heure */}
            <div className="space-y-2">
              <Label htmlFor="time">Heure *</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Type d'entretien */}
            <div className="space-y-2">
              <Label htmlFor="type">Type d'entretien</Label>
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

            {/* Durée */}
            <div className="space-y-2">
              <Label htmlFor="duration">Durée estimée</Label>
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
            {/* Lieu/Format */}
            <div className="space-y-2">
              <Label htmlFor="location">Lieu / Format</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Ex: Visioconférence, Paris 9ème, etc."
              />
            </div>

            {/* Intervieweur */}
            <div className="space-y-2">
              <Label htmlFor="interviewer">Intervieweur</Label>
              <Input
                id="interviewer"
                value={formData.interviewer}
                onChange={(e) => setFormData(prev => ({ ...prev, interviewer: e.target.value }))}
                placeholder="Nom de l'intervieweur"
              />
            </div>
          </div>

          {/* Statut */}
          <div className="space-y-2">
            <Label htmlFor="status">Statut</Label>
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

          {/* Lien de meeting */}
          <div className="space-y-2">
            <Label htmlFor="meetingLink">Lien de visioconférence</Label>
            <Input
              id="meetingLink"
              value={formData.meetingLink}
              onChange={(e) => setFormData(prev => ({ ...prev, meetingLink: e.target.value }))}
              placeholder="https://meet.google.com/xyz-abc-def"
              type="url"
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes / Préparation</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Notes importantes, points à aborder, documents à préparer..."
              rows={3}
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Planifier l'entretien
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InterviewForm;