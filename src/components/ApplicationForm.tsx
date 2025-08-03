
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
import { Calendar } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useAppContext } from "@/contexts/AppContext";
import { useToast } from "@/hooks/use-toast";

const applicationSchema = z.object({
  company: z.string().min(1, "Le nom de l'entreprise est requis"),
  position: z.string().min(1, "Le poste est requis"),
  location: z.string().optional(),
  salary: z.string().optional(),
  status: z.string().default("En cours"),
  appliedDate: z.date(),
  description: z.string().optional(),
  contactPerson: z.string().optional(),
  contactEmail: z.string().email("Email invalide").optional().or(z.literal("")),
  jobUrl: z.string().url("URL invalide").optional().or(z.literal("")),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  tags: z.string().optional(),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

interface ApplicationFormData {
  company: string;
  position: string;
  location: string;
  salary: string;
  status: string;
  appliedDate: Date;
  description: string;
  contactPerson: string;
  contactEmail: string;
  jobUrl: string;
  priority: string;
  tags: string;
}

interface ApplicationFormProps {
  children: React.ReactNode;
  onSubmit?: (data: ApplicationFormData) => void;
}

const ApplicationForm = ({ children, onSubmit }: ApplicationFormProps) => {
  const [open, setOpen] = useState(false);
  const { addApplication } = useAppContext();
  const { toast } = useToast();
  
  const form = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      company: "",
      position: "",
      location: "",
      salary: "",
      status: "En cours",
      appliedDate: new Date(),
      description: "",
      contactPerson: "",
      contactEmail: "",
      jobUrl: "",
      priority: "medium",
      tags: "",
    },
  });

  const handleSubmit = (data: ApplicationFormData) => {
    try {
      const applicationData = {
        company: data.company,
        position: data.position,
        location: data.location || "",
        status: data.status,
        appliedDate: data.appliedDate.toISOString().split('T')[0],
        salary: data.salary || "",
        description: data.description || "",
        priority: data.priority,
        contactPerson: data.contactPerson || "",
        contactEmail: data.contactEmail || "",
        nextStep: "Candidature envoyée",
        tags: data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
        statusColor: "bg-blue-100 text-blue-800 border-blue-200"
      };
      
      addApplication(applicationData);
      onSubmit?.(data);
      setOpen(false);
      form.reset();
      
      toast({
        title: "Candidature créée",
        description: `Candidature pour ${data.position} chez ${data.company} ajoutée avec succès`,
      });
    } catch (error) {
      console.error('Erreur lors de la création de la candidature:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la candidature",
        variant: "destructive",
      });
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
            Nouvelle Candidature
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Ajoutez une nouvelle candidature à votre suivi d'emploi
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
                name="salary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-700">Salaire</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Ex: 50-60k €"
                        className="border-2 focus:border-blue-500 transition-colors"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

              <FormField
                control={form.control}
                name="appliedDate"
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
                name="contactPerson"
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
                name="contactEmail"
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
              name="jobUrl"
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
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-gray-700">Compétences/Tags</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="React, TypeScript, Remote (séparés par des virgules)"
                      className="border-2 focus:border-blue-500 transition-colors"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-gray-500">
                    Séparez les compétences par des virgules
                  </FormDescription>
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
              >
                Annuler
              </Button>
              <Button 
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6"
              >
                Créer la candidature
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationForm;
