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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {application ? "Modifier la candidature" : "Nouvelle Candidature"}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {application ? "Modifiez les informations de votre candidature" : "Ajoutez une nouvelle candidature à votre suivi d'emploi"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-700">Entreprise *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Ex: Google, Microsoft..."
                        className="border-2 focus:border-blue-500 transition-colors"
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
                    <FormLabel className="text-sm font-semibold text-gray-700">Poste *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Ex: Développeur Frontend..."
                        className="border-2 focus:border-blue-500 transition-colors"
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
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-700">Localisation</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Ex: Paris, Remote..."
                        className="border-2 focus:border-blue-500 transition-colors"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="applied_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-700">Date de candidature</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal border-2 focus:border-blue-500",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "dd/MM/yyyy")
                            ) : (
                              <span>Sélectionner une date</span>
                            )}
                            <Calendar className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <FormField
                control={form.control}
                name="salary_min"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-700">Salaire min</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        placeholder="40000"
                        className="border-2 focus:border-blue-500 transition-colors"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="salary_max"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-700">Salaire max</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        placeholder="60000"
                        className="border-2 focus:border-blue-500 transition-colors"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-700">Statut</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-2 focus:border-blue-500">
                          <SelectValue placeholder="Sélectionner un statut" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="En cours">En cours</SelectItem>
                        <SelectItem value="Entretien">Entretien</SelectItem>
                        <SelectItem value="En attente">En attente</SelectItem>
                        <SelectItem value="Accepté">Accepté</SelectItem>
                        <SelectItem value="Refusé">Refusé</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-700">Priorité</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-2 focus:border-blue-500">
                          <SelectValue placeholder="Sélectionner la priorité" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="high">Haute</SelectItem>
                        <SelectItem value="medium">Moyenne</SelectItem>
                        <SelectItem value="low">Faible</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-gray-700">Description du poste</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Décrivez le poste et les responsabilités..."
                      className="border-2 focus:border-blue-500 transition-colors min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="contact_person"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-700">Personne de contact</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Ex: Marie Dupont"
                        className="border-2 focus:border-blue-500 transition-colors"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contact_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-700">Email de contact</FormLabel>
                    <FormControl>
                      <Input 
                        type="email"
                        placeholder="marie.dupont@entreprise.com"
                        className="border-2 focus:border-blue-500 transition-colors"
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
              name="job_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-gray-700">Lien de l'offre</FormLabel>
                  <FormControl>
                    <Input 
                      type="url"
                      placeholder="https://..."
                      className="border-2 focus:border-blue-500 transition-colors"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-gray-500">
                    URL vers l'offre d'emploi originale
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-gray-700">Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Notes personnelles sur cette candidature..."
                      className="border-2 focus:border-blue-500 transition-colors"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setOpen(false)}
                className="px-6"
                disabled={loading}
              >
                Annuler
              </Button>
              <Button 
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6"
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
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationForm;