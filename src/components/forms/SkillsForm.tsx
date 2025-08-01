import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Star, Plus, Edit, Trash2, Loader2 } from "lucide-react";
import { useProfile, UserSkill } from "@/hooks/useProfile";

const skillSchema = z.object({
  skill_name: z.string().min(1, "Le nom de la compétence est requis"),
  level: z.number().min(1).max(5).default(1),
  category: z.string().min(1, "La catégorie est requise"),
});

type SkillFormData = z.infer<typeof skillSchema>;

interface SkillsFormProps {
  skills: UserSkill[];
}

const SkillsForm = ({ skills }: SkillsFormProps) => {
  const { addSkill, updateSkill, deleteSkill } = useProfile();
  const [editingSkill, setEditingSkill] = useState<UserSkill | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<SkillFormData>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      skill_name: "",
      level: 1,
      category: "technique",
    },
  });

  const resetForm = () => {
    form.reset({
      skill_name: "",
      level: 1,
      category: "technique",
    });
    setEditingSkill(null);
  };

  const onSubmit = async (data: SkillFormData) => {
    const skillData = {
      skill_name: data.skill_name,
      level: data.level,
      category: data.category,
    };

    if (editingSkill) {
      await updateSkill(editingSkill.id, skillData);
    } else {
      await addSkill(skillData);
    }
    resetForm();
    setIsDialogOpen(false);
  };

  const handleEdit = (skill: UserSkill) => {
    setEditingSkill(skill);
    form.reset({
      skill_name: skill.skill_name,
      level: skill.level || 1,
      category: skill.category || "technique",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette compétence ?")) {
      await deleteSkill(id);
    }
  };

  const renderStars = (level: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${index < level ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'technique': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'soft': return 'bg-green-100 text-green-800 border-green-200';
      case 'langue': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'outils': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const groupedSkills = skills.reduce((acc, skill) => {
    const category = skill.category || 'autre';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, UserSkill[]>);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5 text-primary" />
          Compétences
        </CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingSkill ? "Modifier la compétence" : "Ajouter une compétence"}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="skill_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom de la compétence</FormLabel>
                      <FormControl>
                        <Input placeholder="ex: React, Leadership, Anglais..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Catégorie</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez une catégorie" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="technique">Technique</SelectItem>
                          <SelectItem value="soft">Soft Skills</SelectItem>
                          <SelectItem value="langue">Langues</SelectItem>
                          <SelectItem value="outils">Outils</SelectItem>
                          <SelectItem value="autre">Autre</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Niveau (1-5)</FormLabel>
                      <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value.toString()}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez un niveau" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">1 - Débutant</SelectItem>
                          <SelectItem value="2">2 - Novice</SelectItem>
                          <SelectItem value="3">3 - Intermédiaire</SelectItem>
                          <SelectItem value="4">4 - Avancé</SelectItem>
                          <SelectItem value="5">5 - Expert</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex gap-2">
                  <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : null}
                    {editingSkill ? "Modifier" : "Ajouter"}
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
          {Object.keys(groupedSkills).length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Aucune compétence ajoutée. Cliquez sur "Ajouter" pour commencer.
            </p>
          ) : (
            Object.entries(groupedSkills).map(([category, categorySkills]) => (
              <div key={category} className="space-y-3">
                <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {categorySkills.map((skill) => (
                    <div 
                      key={skill.id} 
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Badge 
                          variant="outline" 
                          className={getCategoryColor(skill.category || 'autre')}
                        >
                          {skill.skill_name}
                        </Badge>
                        <div className="flex">
                          {renderStars(skill.level || 1)}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(skill)}>
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(skill.id)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SkillsForm;