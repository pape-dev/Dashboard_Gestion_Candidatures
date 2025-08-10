import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Loader2, Target } from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Label } from "@/components/ui/label";

const taskSchema = z.object({
  application_id: z.string().optional(),
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().optional(),
  due_date: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  status: z.enum(["todo", "in-progress", "completed"]).default("todo"),
  category: z.enum(["application", "interview", "follow-up", "research", "other"]).default("other"),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskFormProps {
  children?: React.ReactNode;
  task?: any;
  onSuccess?: () => void;
}

const TaskForm = ({ children, task, onSuccess }: TaskFormProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { applications, addTask, updateTask } = useAppContext();

  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      application_id: task?.application_id || "",
      title: task?.title || "",
      description: task?.description || "",
      due_date: task?.due_date || "",
      priority: task?.priority || "medium",
      status: task?.status || "todo",
      category: task?.category || "other",
    },
  });

  const handleSubmit = async (data: TaskFormData) => {
    try {
      setLoading(true);
      
      const taskData = {
        application_id: data.application_id || null,
        title: data.title,
        description: data.description || null,
        due_date: data.due_date || null,
        priority: data.priority,
        status: data.status,
        category: data.category,
        completed: data.status === 'completed',
        completed_at: data.status === 'completed' ? new Date().toISOString() : null,
      };

      if (task) {
        await updateTask(task.id, taskData);
      } else {
        await addTask(taskData);
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 gap-2">
            <Plus className="h-4 w-4" />
            Nouvelle tâche
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Target className="h-5 w-5 text-green-600" />
            {task ? "Modifier la tâche" : "Créer une nouvelle tâche"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="application_id">Candidature associée (optionnel)</Label>
            <Select 
              value={form.watch('application_id')} 
              onValueChange={(value) => form.setValue('application_id', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choisir une candidature" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Aucune</SelectItem>
                {applications.map((app) => (
                  <SelectItem key={app.id} value={app.id}>
                    {app.company} - {app.position}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Titre *</Label>
            <Input
              id="title"
              placeholder="Ex: Préparer entretien TechCorp"
              {...form.register('title')}
            />
            {form.formState.errors.title && (
              <p className="text-sm text-red-600">{form.formState.errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Détails de la tâche..."
              rows={3}
              {...form.register('description')}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="due_date">Date d'échéance</Label>
              <Input
                id="due_date"
                type="date"
                {...form.register('due_date')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priorité</Label>
              <Select 
                value={form.watch('priority')} 
                onValueChange={(value) => form.setValue('priority', value as any)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">Haute</SelectItem>
                  <SelectItem value="medium">Moyenne</SelectItem>
                  <SelectItem value="low">Faible</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Catégorie</Label>
              <Select 
                value={form.watch('category')} 
                onValueChange={(value) => form.setValue('category', value as any)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="application">Candidature</SelectItem>
                  <SelectItem value="interview">Entretien</SelectItem>
                  <SelectItem value="follow-up">Suivi</SelectItem>
                  <SelectItem value="research">Recherche</SelectItem>
                  <SelectItem value="other">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Select 
                value={form.watch('status')} 
                onValueChange={(value) => form.setValue('status', value as any)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">À faire</SelectItem>
                  <SelectItem value="in-progress">En cours</SelectItem>
                  <SelectItem value="completed">Terminé</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
                  {task ? "Modification..." : "Création..."}
                </>
              ) : (
                <>
                  <Target className="h-4 w-4 mr-2" />
                  {task ? "Modifier la tâche" : "Créer la tâche"}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskForm;