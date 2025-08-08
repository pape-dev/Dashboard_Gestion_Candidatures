import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, MapPin, Users, Plus, Loader2 } from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

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
      form.setValue("interviewer", "");
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

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Sélection d'une candidature existante */}
            <FormField
              control={form.control}
              name="application_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Candidature associée (optionnel)</FormLabel>
                  <Select value={field.value} onValueChange={handleApplicationSelect}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir une candidature existante" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">Aucune (entretien indépendant)</SelectItem>
                      {applications.map((app) => (
                        <SelectItem key={app.id} value={app.id}>
                          {app.company} - {app.position}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Entreprise *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nom de l'entreprise"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Poste *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Intitulé du poste"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="interview_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date *</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="interview_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Heure *</FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type d'entretien</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner le type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Entretien RH">Entretien RH</SelectItem>
                        <SelectItem value="Entretien technique">Entretien technique</SelectItem>
                        <SelectItem value="Entretien avec l'équipe">Entretien avec l'équipe</SelectItem>
                        <SelectItem value="Entretien final">Entretien final</SelectItem>
                        <SelectItem value="Entretien téléphonique">Entretien téléphonique</SelectItem>
                        <SelectItem value="Présentation">Présentation</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Durée estimée</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Durée" />
                        </SelectTrigger>
                      </FormControl>
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
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lieu / Format</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: Visioconférence, Paris 9ème, etc."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="interviewer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Intervieweur</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nom de l'intervieweur"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Statut</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="à confirmer">À confirmer</SelectItem>
                      <SelectItem value="confirmé">Confirmé</SelectItem>
                      <SelectItem value="en attente">En attente</SelectItem>
                      <SelectItem value="reporté">Reporté</SelectItem>
                      <SelectItem value="annulé">Annulé</SelectItem>
                      <SelectItem value="terminé">Terminé</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="meeting_link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lien de visioconférence</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://meet.google.com/xyz-abc-def"
                      type="url"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes / Préparation</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Notes importantes, points à aborder, documents à préparer..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Buttons */}
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
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
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
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default InterviewForm;