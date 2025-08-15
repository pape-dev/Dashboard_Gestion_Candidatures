import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Target, Plus, Calendar, Clock, AlertCircle, 
  CheckCircle, Circle, Filter, Search, MoreHorizontal,
  Edit, Trash2, Flag, Loader2
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import TaskForm from "@/components/TaskForm";
import { useAppContext } from "@/contexts/AppContext";
import { useToast } from "@/hooks/use-toast";

const Tasks = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { 
    tasks, 
    applications,
    loading, 
    error: contextError,
    updateTask, 
    deleteTask, 
    toggleTaskStatus
  } = useAppContext();
  const { toast } = useToast();

  console.log('🔍 Tasks: Rendu avec tasks:', tasks?.length, 'applications:', applications?.length, 'loading:', loading);

  // Gestion d'erreur globale
  useEffect(() => {
    if (contextError) {
      console.error('❌ Tasks: Erreur du contexte:', contextError);
      setError(contextError);
    }
  }, [contextError]);

  // Gestion d'erreur JavaScript
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('❌ Tasks: Erreur JavaScript capturée:', event.error);
      setError(`Erreur JavaScript: ${event.error?.message || 'Erreur inconnue'}`);
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('❌ Tasks: Promise rejetée non gérée:', event.reason);
      setError(`Erreur Promise: ${event.reason?.message || 'Erreur inconnue'}`);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  const getPriorityColor = (priority: string) => {
    const colors = {
      "high": "bg-red-100 text-red-800",
      "medium": "bg-yellow-100 text-yellow-800",
      "low": "bg-green-100 text-green-800"
    };
    return colors[priority as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getPriorityIcon = (priority: string) => {
    const icons = {
      "high": <Flag className="h-3 w-3 text-red-500" />,
      "medium": <Flag className="h-3 w-3 text-yellow-500" />,
      "low": <Flag className="h-3 w-3 text-green-500" />
    };
    return icons[priority as keyof typeof icons] || <Flag className="h-3 w-3 text-gray-500" />;
  };

  const getStatusIcon = (status: string, completed: boolean) => {
    if (completed) return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (status === "in-progress") return <Clock className="h-4 w-4 text-blue-500" />;
    return <Circle className="h-4 w-4 text-gray-400" />;
  };

  const isOverdue = (dueDate: string | null, completed: boolean | null) => {
    if (!dueDate || completed) return false;
    return new Date(dueDate) < new Date();
  };

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const pendingTasks = filteredTasks.filter(task => !task.completed);
  const completedTasks = filteredTasks.filter(task => task.completed);
  const overdueTasks = filteredTasks.filter(task => isOverdue(task.due_date, task.completed));

  const handleTaskToggle = async (taskId: string) => {
    try {
      await toggleTaskStatus(taskId);
    } catch (error) {
      console.error('Erreur lors du changement de statut:', error);
    }
  };

  const handleTaskEdit = (task: any) => {
    // Cette fonction sera gérée par TaskForm
    console.log('Édition de la tâche:', task.id);
  };

  const handleTaskDelete = async (taskId: string) => {
    try {
      await deleteTask(taskId);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-green-600 mx-auto mb-4" />
            <p className="text-lg font-medium text-slate-700 dark:text-slate-300">Chargement...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Affichage des erreurs */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <h3 className="text-sm font-medium text-red-800">Erreur détectée</h3>
            </div>
            <p className="text-sm text-red-700 mt-1">{error}</p>
            <button
              onClick={() => setError(null)}
              className="text-sm text-red-600 hover:text-red-800 mt-2 underline"
            >
              Fermer
            </button>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tâches</h1>
            <p className="text-gray-600 mt-1">Organisez votre recherche d'emploi</p>
          </div>
          <TaskForm>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle tâche
            </Button>
          </TaskForm>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher une tâche..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filtrer
          </Button>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">Toutes ({filteredTasks.length})</TabsTrigger>
            <TabsTrigger value="pending">En cours ({pendingTasks.length})</TabsTrigger>
            <TabsTrigger value="completed">Terminées ({completedTasks.length})</TabsTrigger>
            <TabsTrigger value="overdue">En retard ({overdueTasks.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-3">
            {filteredTasks.map((task) => {
              const relatedApp = applications.find(app => app.id === task.application_id);
              return (
                <Card key={task.id} className={`hover:shadow-md transition-shadow ${task.completed ? 'opacity-75' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <Checkbox 
                        checked={task.completed || false}
                        onCheckedChange={() => handleTaskToggle(task.id)}
                        className="mt-1"
                      />
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h3 className={`font-semibold ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                              {task.title}
                            </h3>
                            {task.description && (
                              <p className={`text-sm ${task.completed ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                                {task.description}
                              </p>
                            )}
                          </div>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleTaskEdit(task)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Modifier
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-red-600"
                                onClick={() => handleTaskDelete(task.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        
                        <div className="flex items-center gap-3 text-sm">
                          <div className="flex items-center gap-1">
                            {getStatusIcon(task.status || 'todo', task.completed || false)}
                            <span className="text-gray-500 capitalize">{task.status}</span>
                          </div>
                          
                          {task.due_date && (
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              <span className={`${isOverdue(task.due_date, task.completed) ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                                {new Date(task.due_date).toLocaleDateString('fr-FR')}
                              </span>
                              {isOverdue(task.due_date, task.completed) && (
                                <AlertCircle className="h-4 w-4 text-red-500 ml-1" />
                              )}
                            </div>
                          )}
                          
                          {task.priority && (
                            <div className="flex items-center gap-1">
                              {getPriorityIcon(task.priority)}
                              <Badge className={getPriorityColor(task.priority)} variant="outline">
                                {task.priority}
                              </Badge>
                            </div>
                          )}
                          
                          {task.category && (
                            <Badge variant="outline" className="text-xs">
                              {task.category}
                            </Badge>
                          )}
                          
                          {relatedApp && (
                            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                              {relatedApp.company}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          <TabsContent value="pending" className="space-y-3">
            {pendingTasks.map((task) => {
              const relatedApp = applications.find(app => app.id === task.application_id);
              return (
                <Card key={task.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <Checkbox 
                        checked={false} 
                        onCheckedChange={() => handleTaskToggle(task.id)}
                        className="mt-1" 
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{task.title}</h3>
                            {task.description && (
                              <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                            )}
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleTaskEdit(task)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Modifier
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-red-600"
                                onClick={() => handleTaskDelete(task.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <div className="flex items-center gap-1">
                            {getStatusIcon(task.status || 'todo', task.completed || false)}
                            <span className="text-gray-500 capitalize">{task.status}</span>
                          </div>
                          {task.due_date && (
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              <span className={`${isOverdue(task.due_date, task.completed) ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                                {new Date(task.due_date).toLocaleDateString('fr-FR')}
                              </span>
                              {isOverdue(task.due_date, task.completed) && (
                                <AlertCircle className="h-4 w-4 text-red-500 ml-1" />
                              )}
                            </div>
                          )}
                          {task.priority && (
                            <div className="flex items-center gap-1">
                              {getPriorityIcon(task.priority)}
                              <Badge className={getPriorityColor(task.priority)} variant="outline">
                                {task.priority}
                              </Badge>
                            </div>
                          )}
                          {task.category && (
                            <Badge variant="outline" className="text-xs">
                              {task.category}
                            </Badge>
                          )}
                          {relatedApp && (
                            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                              {relatedApp.company}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          <TabsContent value="completed" className="space-y-3">
            {completedTasks.map((task) => {
              const relatedApp = applications.find(app => app.id === task.application_id);
              return (
                <Card key={task.id} className="hover:shadow-md transition-shadow opacity-75">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <Checkbox 
                        checked={true} 
                        onCheckedChange={() => handleTaskToggle(task.id)}
                        className="mt-1" 
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-500 line-through">{task.title}</h3>
                            {task.description && (
                              <p className="text-sm text-gray-400 mt-1">{task.description}</p>
                            )}
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem 
                                className="text-red-600"
                                onClick={() => handleTaskDelete(task.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <div className="flex items-center gap-1">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-gray-400">Terminé</span>
                          </div>
                          {task.due_date && (
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-400">
                                {new Date(task.due_date).toLocaleDateString('fr-FR')}
                              </span>
                            </div>
                          )}
                          {task.category && (
                            <Badge variant="outline" className="text-xs text-gray-400">
                              {task.category}
                            </Badge>
                          )}
                          {relatedApp && (
                            <Badge variant="outline" className="text-xs text-gray-400">
                              {relatedApp.company}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          <TabsContent value="overdue" className="space-y-3">
            {overdueTasks.map((task) => {
              const relatedApp = applications.find(app => app.id === task.application_id);
              return (
                <Card key={task.id} className="hover:shadow-md transition-shadow border-red-200">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <Checkbox 
                        checked={false} 
                        onCheckedChange={() => handleTaskToggle(task.id)}
                        className="mt-1" 
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{task.title}</h3>
                            {task.description && (
                              <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                            )}
                          </div>
                          <Badge variant="destructive" className="text-xs">
                            En retard
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <div className="flex items-center gap-1">
                            <AlertCircle className="h-4 w-4 text-red-500" />
                            <span className="text-red-600 font-medium">En retard</span>
                          </div>
                          {task.due_date && (
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4 text-red-400" />
                              <span className="text-red-600 font-medium">
                                {new Date(task.due_date).toLocaleDateString('fr-FR')}
                              </span>
                            </div>
                          )}
                          {task.priority && (
                            <div className="flex items-center gap-1">
                              {getPriorityIcon(task.priority)}
                              <Badge className={getPriorityColor(task.priority)} variant="outline">
                                {task.priority}
                              </Badge>
                            </div>
                          )}
                          {task.category && (
                            <Badge variant="outline" className="text-xs">
                              {task.category}
                            </Badge>
                          )}
                          {relatedApp && (
                            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                              {relatedApp.company}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>
        </Tabs>

        {/* Empty State */}
        {filteredTasks.length === 0 && !loading && (
          <Card className="text-center py-16">
            <CardContent>
              <div className="max-w-md mx-auto">
                <div className="p-4 rounded-full bg-green-100 dark:bg-green-900 w-fit mx-auto mb-6">
                  <Target className="h-12 w-12 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">
                  Aucune tâche
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  Créez votre première tâche pour organiser votre recherche d'emploi
                </p>
                <TaskForm>
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Créer ma première tâche
                  </Button>
                </TaskForm>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Tasks;