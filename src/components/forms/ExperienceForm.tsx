import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Briefcase, Plus, Edit, Trash2, Calendar, MapPin, Loader2 } from "lucide-react";
import { useProfile, Experience } from "@/hooks/useProfile";

const experienceSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  company: z.string().min(1, "L'entreprise est requise"),
  location: z.string().optional(),
  start_date: z.string().min(1, "La date de début est requise"),
  end_date: z.string().optional(),
  is_current: z.boolean().default(false),
  description: z.string().optional(),
}).refine((data) => {
  if (!data.is_current && !data.end_date) {
    return false;
  }
  return true;
}, {
  message: "La date de fin est requise si ce n'est pas votre poste actuel",
  path: ["end_date"],
});

type ExperienceFormData = z.infer<typeof experienceSchema>;

interface ExperienceFormProps {
  experiences: Experience[];
}

const ExperienceForm = ({ experiences }: ExperienceFormProps) => {
  const { addExperience, updateExperience, deleteExperience } = useProfile();
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<ExperienceFormData>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      title: "",
      company: "",
      location: "",
      start_date: "",
      end_date: "",
      is_current: false,
      description: "",
    },
  });

  const resetForm = () => {
    form.reset({
      title: "",
      company: "",
      location: "",
      start_date: "",
      end_date: "",
      is_current: false,
      description: "",
    });
    setEditingExperience(null);
  };

  const onSubmit = async (data: ExperienceFormData) => {
    const experienceData = {
      title: data.title,
      company: data.company,
      location: data.location || null,
      start_date: data.start_date,
      end_date: data.end_date || null,
      is_current: data.is_current,
      description: data.description || null,
    };

    if (editingExperience) {
      await updateExperience(editingExperience.id, experienceData);
    } else {
      await addExperience(experienceData);
    }
    resetForm();
    setIsDialogOpen(false);
  };

  const handleEdit = (experience: Experience) => {
    setEditingExperience(experience);
    form.reset({
      title: experience.title,
      company: experience.company,
      location: experience.location || "",
      start_date: experience.start_date,
      end_date: experience.end_date || "",
      is_current: experience.is_current || false,
      description: experience.description || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette expérience ?")) {
      await deleteExperience(id);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-primary" />
          Expérience professionnelle
        </CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingExperience ? "Modifier l'expérience" : "Ajouter une expérience"}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Titre du poste</FormLabel>
                        <FormControl>
                          <Input placeholder="ex: Développeur Frontend" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Entreprise</FormLabel>
                        <FormControl>
                          <Input placeholder="ex: Google" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Localisation</FormLabel>
                        <FormControl>
                          <Input placeholder="ex: Paris, France" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="start_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date de début</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="is_current"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          C'est mon poste actuel
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                
                {!form.watch("is_current") && (
                  <FormField
                    control={form.control}
                    name="end_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date de fin</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Décrivez vos responsabilités et réalisations..."
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex gap-2">
                  <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : null}
                    {editingExperience ? "Modifier" : "Ajouter"}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Annuler
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {experiences.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Aucune expérience ajoutée. Cliquez sur "Ajouter" pour commencer.
            </p>
          ) : (
            experiences.map((exp) => (
              <div key={exp.id} className="border-l-2 border-primary/20 pl-4 pb-6 last:pb-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground">{exp.title}</h3>
                    <p className="text-primary font-medium">{exp.company}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(exp.start_date)} - {exp.is_current ? "Présent" : exp.end_date ? formatDate(exp.end_date) : "N/A"}
                      </div>
                      {exp.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {exp.location}
                        </div>
                      )}
                    </div>
                    {exp.description && (
                      <p className="text-muted-foreground mt-2 text-sm">{exp.description}</p>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(exp)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(exp.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExperienceForm;