import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Plus, Loader2 } from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const interviewSchema = z.object({
  application_id: z.string().optional(),
  company: z.string().min(1, "Le nom de l'entreprise est requis"),
  position: z.string().min(1, "Le poste est requis"),
  interview_date: z.string().min(1, "La date est requise"),
  interview_time: z.string().min(1, "L'heure est requise"),
  type: z.string().default("Entretien RH"),
  location: z.string().optional(),
  interviewer: z.string().optional(),
  duration: z.string().default("1h"),
  status: z.string().default("à confirmer"),
  notes: z.string().optional(),
  meeting_link: z.string().url("URL invalide").optional().or(z.literal("")),
});

type InterviewFormData = z.infer<typeof interviewSchema>;

interface InterviewFormProps {
  children?: React.ReactNode;
  interview?: any;
  onSuccess?: () => void;
}

const InterviewForm = ({ children, interview, onSuccess }: InterviewFormProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { applications, addInterview, updateInterview } = useAppContext();

  const form = useForm<InterviewFormData>({
    resolver: zodResolver(interviewSchema),
    defaultValues: {
      application_id: interview?.application_id || "",
      company: interview?.company || "",
      position: interview?.position || "",
      interview_date: interview?.interview_date || "",
      interview_time: interview?.interview_time || "",
      type: interview?.type || "Entretien RH",
      location: interview?.location || "",
      interviewer: interview?.interviewer || "",
      duration: interview?.duration || "1h",
      status: interview?.status || "à confirmer",
      notes: interview?.notes || "",
      meeting_link: interview?.meeting_link || ""
    },
  });

  const handleSubmit = async (data: InterviewFormData) => {
    try {
      setLoading(true);
      
      // Trouver l'application correspondante si sélectionnée
      const selectedApp = applications.find(app => app.id === data.application_id);
      
      const interviewData = {
        application_id: data.application_id || null,
        company: selectedApp ? selectedApp.company : data.company,
        position: selectedApp ? selectedApp.position : data.position,
        interview_date: data.interview_date,
        interview_time: data.interview_time,
        type: data.type,
        location: data.location || null,
        interviewer: data.interviewer || null,
        duration: data.duration,
        status: data.status,
        notes: data.notes || null,
        meeting_link: data.meeting_link || null
      };

      if (interview) {
        await updateInterview(interview.id, interviewData);
      } else {
        await addInterview(interviewData);
      }
      
      form.reset();
      setOpen(false);
      onSuccess?.();
      
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplicationSelect = (appId: string) => {
    if (appId === "none") {
      form.setValue("application_id", "");
      form.setValue("company", "");
      form.setValue("position", "");
      return;
    }
    
    const selectedApp = applications.find(app => app.id === appId);
    if (selectedApp) {
      form.setValue("application_id", appId);
      form.setValue("company", selectedApp.company);
      form.setValue("position", selectedApp.position);
      form.setValue("interviewer", selectedApp.contact_person || "");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
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
            {interview ? "Modifier l'entretien" : "Planifier un nouvel entretien"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Sélection d'une candidature existante */}
          <div className="space-y-2">
            <Label htmlFor="application_id">Candidature associée (optionnel)</Label>
            <Select 
              value={form.watch('application_id')} 
              onValueChange={handleApplicationSelect}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choisir une candidature existante" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Aucune (entretien indépendant)</SelectItem>
                {applications.map((app) => (
                  <SelectItem key={app.id} value={app.id}>
                    {app.company} - {app.position}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company">Entreprise *</Label>
              <Input
                id="company"
                placeholder="Nom de l'entreprise"
                {...form.register('company')}
              />
              {form.formState.errors.company && (
                <p className="text-sm text-red-600">{form.formState.errors.company.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Poste *</Label>
              <Input
                id="position"
                placeholder="Intitulé du poste"
                {...form.register('position')}
              />
              {form.formState.errors.position && (
                <p className="text-sm text-red-600">{form.formState.errors.position.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="interview_date">Date *</Label>
              <Input
                id="interview_date"
                type="date"
                {...form.register('interview_date')}
              />
              {form.formState.errors.interview_date && (
                <p className="text-sm text-red-600">{form.formState.errors.interview_date.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="interview_time">Heure *</Label>
              <Input
                id="interview_time"
                type="time"
                {...form.register('interview_time')}
              />
              {form.formState.errors.interview_time && (
                <p className="text-sm text-red-600">{form.formState.errors.interview_time.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type d'entretien</Label>
              <Select 
                value={form.watch('type')} 
                onValueChange={(value) => form.setValue('type', value)}
              >
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
              <Label htmlFor="duration">Durée estimée</Label>
              <Select 
                value={form.watch('duration')} 
                onValueChange={(value) => form.setValue('duration', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Durée" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30min">30 minutes</SelectItem>
                  <SelectItem value="45min">45 minutes</SelectItem>
                  <SelectItem value="1h">1 heure</SelectItem>
                  <SelectItem value="1h30">1h30</SelectItem>
                  <SelectItem value="2h">2 heures</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Lieu / Format</Label>
              <Input
                id="location"
                placeholder="Ex: Visioconférence, Paris 9ème"
                {...form.register('location')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="interviewer">Intervieweur</Label>
              <Input
                id="interviewer"
                placeholder="Nom de l'intervieweur"
                {...form.register('interviewer')}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Statut</Label>
            <Select 
              value={form.watch('status')} 
              onValueChange={(value) => form.setValue('status', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="à confirmer">À confirmer</SelectItem>
                <SelectItem value="confirmé">Confirmé</SelectItem>
                <SelectItem value="en attente">En attente</SelectItem>
                <SelectItem value="reporté">Reporté</SelectItem>
                <SelectItem value="annulé">Annulé</SelectItem>
                <SelectItem value="terminé">Terminé</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="meeting_link">Lien de visioconférence</Label>
            <Input
              id="meeting_link"
              placeholder="https://meet.google.com/xyz-abc-def"
              type="url"
              {...form.register('meeting_link')}
            />
            {form.formState.errors.meeting_link && (
              <p className="text-sm text-red-600">{form.formState.errors.meeting_link.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes / Préparation</Label>
            <Textarea
              id="notes"
              placeholder="Notes importantes, points à aborder..."
              rows={3}
              {...form.register('notes')}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {interview ? "Modification..." : "Planification..."}
                </>
              ) : (
                <>
                  <Calendar className="h-4 w-4 mr-2" />
                  {interview ? "Modifier l'entretien" : "Planifier l'entretien"}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InterviewForm;