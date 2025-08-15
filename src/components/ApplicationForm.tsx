import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Calendar, Loader2, Plus } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useAppContext } from "@/contexts/AppContext";

const applicationSchema = z.object({
  company: z.string().min(1, "Le nom de l'entreprise est requis"),
  position: z.string().min(1, "Le poste est requis"),
  location: z.string().optional(),
  salary_min: z.number().optional(),
  salary_max: z.number().optional(),
  salary_currency: z.string().default("€"),
  status: z.string().default("En cours"),
  applied_date: z.date(),
  description: z.string().optional(),
  contact_person: z.string().optional(),
  contact_email: z.string().email("Email invalide").optional().or(z.literal("")),
  job_url: z.string().url("URL invalide").optional().or(z.literal("")),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  notes: z.string().optional(),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

interface ApplicationFormProps {
  children: React.ReactNode;
  application?: any;
  onSuccess?: () => void;
}

const ApplicationForm = ({ children, application, onSuccess }: ApplicationFormProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { addApplication, updateApplication } = useAppContext();
  
  const form = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      company: application?.company || "",
      position: application?.position || "",
      location: application?.location || "",
      salary_min: application?.salary_min || undefined,
      salary_max: application?.salary_max || undefined,
      salary_currency: application?.salary_currency || "€",
      status: application?.status || "En cours",
      applied_date: application?.applied_date ? new Date(application.applied_date) : new Date(),
      description: application?.description || "",
      contact_person: application?.contact_person || "",
      contact_email: application?.contact_email || "",
      job_url: application?.job_url || "",
      priority: application?.priority || "medium",
      notes: application?.notes || "",
    },
  });

  const handleSubmit = async (data: ApplicationFormData) => {
    try {
      setLoading(true);
      
      const applicationData = {
        company: data.company,
        position: data.position,
        location: data.location || null,
        status: data.status,
        applied_date: data.applied_date.toISOString().split('T')[0],
        salary_min: data.salary_min || null,
        salary_max: data.salary_max || null,
        salary_currency: data.salary_currency,
        description: data.description || null,
        priority: data.priority,
        contact_person: data.contact_person || null,
        contact_email: data.contact_email || null,
        next_step: "Candidature envoyée",
        job_url: data.job_url || null,
        notes: data.notes || null,
        company_logo_url: null,
      };
      
      if (application) {
        await updateApplication(application.id, applicationData);
      } else {
        await addApplication(applicationData);
      }
      
      setOpen(false);
      form.reset();
      onSuccess?.();
      
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {application ? "Modifier la candidature" : "Nouvelle Candidature"}
          </DialogTitle>
          <DialogDescription>
            {application ? "Modifiez les informations de votre candidature" : "Ajoutez une nouvelle candidature à votre suivi"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company">Entreprise *</Label>
              <Input 
                id="company"
                placeholder="Ex: Google, Microsoft..."
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
                placeholder="Ex: Développeur Frontend..."
                {...form.register('position')}
              />
              {form.formState.errors.position && (
                <p className="text-sm text-red-600">{form.formState.errors.position.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Localisation</Label>
              <Input 
                id="location"
                placeholder="Ex: Paris, Remote..."
                {...form.register('location')}
              />
            </div>

            <div className="space-y-2">
              <Label>Date de candidature</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full pl-3 text-left font-normal",
                      !form.watch('applied_date') && "text-muted-foreground"
                    )}
                  >
                    {form.watch('applied_date') ? (
                      format(form.watch('applied_date'), "dd/MM/yyyy")
                    ) : (
                      <span>Sélectionner une date</span>
                    )}
                    <Calendar className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={form.watch('applied_date')}
                    onSelect={(date) => form.setValue('applied_date', date || new Date())}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="salary_min">Salaire min</Label>
              <Input 
                id="salary_min"
                type="number"
                placeholder="40000"
                {...form.register('salary_min', { valueAsNumber: true })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="salary_max">Salaire max</Label>
              <Input 
                id="salary_max"
                type="number"
                placeholder="60000"
                {...form.register('salary_max', { valueAsNumber: true })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Select 
                value={form.watch('status')} 
                onValueChange={(value) => form.setValue('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="En cours">En cours</SelectItem>
                  <SelectItem value="Entretien">Entretien</SelectItem>
                  <SelectItem value="En attente">En attente</SelectItem>
                  <SelectItem value="Accepté">Accepté</SelectItem>
                  <SelectItem value="Refusé">Refusé</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priorité</Label>
              <Select 
                value={form.watch('priority')} 
                onValueChange={(value) => form.setValue('priority', value as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Priorité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">Haute</SelectItem>
                  <SelectItem value="medium">Moyenne</SelectItem>
                  <SelectItem value="low">Faible</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description du poste</Label>
            <Textarea
              id="description"
              placeholder="Décrivez le poste et les responsabilités..."
              {...form.register('description')}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact_person">Personne de contact</Label>
              <Input 
                id="contact_person"
                placeholder="Ex: Marie Dupont"
                {...form.register('contact_person')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact_email">Email de contact</Label>
              <Input 
                id="contact_email"
                type="email"
                placeholder="marie.dupont@entreprise.com"
                {...form.register('contact_email')}
              />
              {form.formState.errors.contact_email && (
                <p className="text-sm text-red-600">{form.formState.errors.contact_email.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="job_url">Lien de l'offre</Label>
            <Input 
              id="job_url"
              type="url"
              placeholder="https://..."
              {...form.register('job_url')}
            />
            {form.formState.errors.job_url && (
              <p className="text-sm text-red-600">{form.formState.errors.job_url.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea 
              id="notes"
              placeholder="Notes personnelles sur cette candidature..."
              {...form.register('notes')}
            />
          </div>

          <DialogFooter className="gap-2">
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
                  {application ? "Modification..." : "Création..."}
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  {application ? "Modifier" : "Créer la candidature"}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationForm;