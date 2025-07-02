
import { useState } from "react";
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
  Edit, Trash2, Flag
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Tasks = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const tasks = [
    {
      id: 1,
      title: "Préparer entretien TechCorp",
      description: "Réviser les concepts React et préparer des exemples de projets",
      priority: "high",
      status: "pending",
      dueDate: "2024-07-03",
      category: "Entretien",
      completed: false,
      company: "TechCorp"
    },
    {
      id: 2,
      title: "Mettre à jour portfolio",
      description: "Ajouter les 3 nouveaux projets récents avec captures d'écran",
      priority: "medium",
      status: "in-progress",
      dueDate: "2024-07-05",
      category: "Portfolio",
      completed: false,
      company: null
    },
    {
      id: 3,
      title: "Relancer StartupXYZ",
      description: "Envoyer un email de suivi pour la candidature UX Designer",
      priority: "high",
      status: "pending",
      dueDate: "2024-07-02",
      category: "Suivi",
      completed: false,
      company: "StartupXYZ"
    },
    {
      id: 4,
      title: "Rechercher offres développeur",
      description: "Explorer les nouvelles opportunités sur LinkedIn et Indeed",
      priority: "low",
      status: "completed",
      dueDate: "2024-06-30",
      category: "Recherche",
      completed: true,
      company: null
    },
    {
      id: 5,
      title: "Préparer questions entretien",
      description: "Lister les questions à poser sur la culture d'entreprise et les projets",
      priority: "medium",
      status: "pending",
      dueDate: "2024-07-04",
      category: "Entretien",
      completed: false,
      company: "InnovLab"
    }
  ];

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

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date() && !tasks.find(t => t.dueDate === dueDate)?.completed;
  };

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (task.company && task.company.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const pendingTasks = filteredTasks.filter(task => !task.completed);
  const completedTasks = filteredTasks.filter(task => task.completed);
  const overdueTasks = filteredTasks.filter(task => isOverdue(task.dueDate));

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tâches</h1>
            <p className="text-gray-600 mt-1">Organisez votre recherche d'emploi</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle tâche
          </Button>
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

          <TabsContent value="all" className="space-y-4">
            <div className="space-y-3">
              {filteredTasks.map((task) => (
                <Card key={task.id} className={`hover:shadow-md transition-shadow ${task.completed ? 'opacity-75' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <Checkbox 
                        checked={task.completed}
                        className="mt-1"
                      />
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h3 className={`font-semibold ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                              {task.title}
                            </h3>
                            <p className={`text-sm ${task.completed ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                              {task.description}
                            </p>
                          </div>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Modifier
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        
                        <div className="flex items-center gap-3 text-sm">
                          <div className="flex items-center gap-1">
                            {getStatusIcon(task.status, task.completed)}
                            <span className="text-gray-500 capitalize">{task.status}</span>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className={`${isOverdue(task.dueDate) ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                              {new Date(task.dueDate).toLocaleDateString('fr-FR')}
                            </span>
                            {isOverdue(task.dueDate) && (
                              <AlertCircle className="h-4 w-4 text-red-500 ml-1" />
                            )}
                          </div>
                          
                          <div className="flex items-center gap-1">
                            {getPriorityIcon(task.priority)}
                            <Badge className={getPriorityColor(task.priority)} variant="outline">
                              {task.priority}
                            </Badge>
                          </div>
                          
                          <Badge variant="outline" className="text-xs">
                            {task.category}
                          </Badge>
                          
                          {task.company && (
                            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                              {task.company}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            <div className="space-y-3">
              {pendingTasks.map((task) => (
                <Card key={task.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <Checkbox checked={false} className="mt-1" />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{task.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Modifier
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <div className="flex items-center gap-1">
                            {getStatusIcon(task.status, task.completed)}
                            <span className="text-gray-500 capitalize">{task.status}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className={`${isOverdue(task.dueDate) ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                              {new Date(task.dueDate).toLocaleDateString('fr-FR')}
                            </span>
                            {isOverdue(task.dueDate) && (
                              <AlertCircle className="h-4 w-4 text-red-500 ml-1" />
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            {getPriorityIcon(task.priority)}
                            <Badge className={getPriorityColor(task.priority)} variant="outline">
                              {task.priority}
                            </Badge>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {task.category}
                          </Badge>
                          {task.company && (
                            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                              {task.company}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            <div className="space-y-3">
              {completedTasks.map((task) => (
                <Card key={task.id} className="hover:shadow-md transition-shadow opacity-75">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <Checkbox checked={true} className="mt-1" />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-500 line-through">{task.title}</h3>
                            <p className="text-sm text-gray-400 mt-1">{task.description}</p>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem className="text-red-600">
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
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-400">
                              {new Date(task.dueDate).toLocaleDateString('fr-FR')}
                            </span>
                          </div>
                          <Badge variant="outline" className="text-xs text-gray-400">
                            {task.category}
                          </Badge>
                          {task.company && (
                            <Badge variant="outline" className="text-xs text-gray-400">
                              {task.company}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="overdue" className="space-y-4">
            <div className="space-y-3">
              {overdueTasks.map((task) => (
                <Card key={task.id} className="hover:shadow-md transition-shadow border-red-200">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <Checkbox checked={false} className="mt-1" />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{task.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">{task.description}</p>
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
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-red-400" />
                            <span className="text-red-600 font-medium">
                              {new Date(task.dueDate).toLocaleDateString('fr-FR')}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            {getPriorityIcon(task.priority)}
                            <Badge className={getPriorityColor(task.priority)} variant="outline">
                              {task.priority}
                            </Badge>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {task.category}
                          </Badge>
                          {task.company && (
                            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                              {task.company}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Tasks;
