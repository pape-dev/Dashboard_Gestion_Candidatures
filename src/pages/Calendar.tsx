
import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar as CalendarIcon, Clock, MapPin, Users, Plus, ChevronLeft, ChevronRight,
  Video, Phone, Mail, Filter, Search, Download, Bell, Settings, Building,
  TrendingUp, AlertCircle, CheckCircle, BarChart3
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import InterviewActions from "@/components/InterviewActions";
import useApplicationsData from "@/hooks/useApplicationsData";
import { useToast } from "@/hooks/use-toast";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const { interviews, applications } = useApplicationsData();
  const { toast } = useToast();
  
  const filteredInterviews = interviews.filter(interview => {
    const matchesSearch = interview.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         interview.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         interview.interviewer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || interview.status === statusFilter;
    const matchesType = typeFilter === "all" || interview.type.toLowerCase().includes(typeFilter.toLowerCase());
    return matchesSearch && matchesStatus && matchesType;
  });

  const upcomingInterviews = filteredInterviews.filter(interview => 
    new Date(interview.date) >= new Date()
  ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const todayInterviews = filteredInterviews.filter(interview => {
    const today = new Date();
    const interviewDate = new Date(interview.date);
    return interviewDate.toDateString() === today.toDateString();
  });

  const thisWeekInterviews = filteredInterviews.filter(interview => {
    const today = new Date();
    const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const interviewDate = new Date(interview.date);
    return interviewDate >= today && interviewDate <= weekFromNow;
  });

  const stats = {
    total: interviews.length,
    confirmed: interviews.filter(i => i.status === "confirmé").length,
    pending: interviews.filter(i => i.status === "à confirmer").length,
    today: todayInterviews.length,
    thisWeek: thisWeekInterviews.length
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const getInterviewsForDay = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return interviews.filter(interview => interview.date === dateStr);
  };

  const hasInterview = (day: number) => {
    return getInterviewsForDay(day).length > 0;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };

  const handleInterviewEdit = (id: number) => {
    toast({
      title: "Modification d'entretien",
      description: `Ouverture du formulaire de modification pour l'entretien ${id}`,
    });
  };

  const handleInterviewDelete = (id: number) => {
    toast({
      title: "Suppression d'entretien",
      description: `Entretien ${id} supprimé avec succès`,
    });
  };

  const handleStatusChange = (id: number, status: string) => {
    toast({
      title: "Statut modifié",
      description: `Statut de l'entretien ${id} changé en "${status}"`,
    });
  };

  const handleExportCalendar = () => {
    toast({
      title: "Export du calendrier",
      description: "Génération du fichier ICS en cours...",
    });
  };

  const handleSyncCalendar = () => {
    toast({
      title: "Synchronisation",
      description: "Synchronisation avec votre calendrier externe...",
    });
  };

  const monthNames = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];

  const dayNames = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header amélioré */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
              Calendrier des Entretiens
            </h1>
            <p className="text-lg text-gray-600">
              Planifiez et gérez tous vos entretiens professionnels
            </p>
            <div className="flex items-center gap-4 mt-3">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                {stats.total} entretiens au total
              </Badge>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                {stats.confirmed} confirmés
              </Badge>
              <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                {stats.today} aujourd'hui
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              className="gap-2 hover:bg-blue-50 border-blue-300 text-blue-700"
              onClick={handleSyncCalendar}
            >
              <Settings className="h-4 w-4" />
              Synchroniser
            </Button>
            
            <Button 
              variant="outline" 
              className="gap-2 hover:bg-gray-50 border-gray-300"
              onClick={handleExportCalendar}
            >
              <Download className="h-4 w-4" />
              Exporter
            </Button>
            
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 gap-2 shadow-lg">
              <Plus className="h-4 w-4" />
              Nouvel entretien
            </Button>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <CalendarIcon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-blue-600 font-medium">Total</p>
                  <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-green-600 font-medium">Confirmés</p>
                  <p className="text-2xl font-bold text-green-900">{stats.confirmed}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-yellow-600 font-medium">En attente</p>
                  <p className="text-2xl font-bold text-yellow-900">{stats.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500 rounded-lg">
                  <Clock className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-purple-600 font-medium">Aujourd'hui</p>
                  <p className="text-2xl font-bold text-purple-900">{stats.today}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-orange-600 font-medium">Cette semaine</p>
                  <p className="text-2xl font-bold text-orange-900">{stats.thisWeek}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtres */}
        <Card className="shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Rechercher par entreprise, poste, ou intervieweur..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-80"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="confirmé">Confirmé</SelectItem>
                  <SelectItem value="à confirmer">À confirmer</SelectItem>
                  <SelectItem value="en attente">En attente</SelectItem>
                  <SelectItem value="annulé">Annulé</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="technique">Technique</SelectItem>
                  <SelectItem value="rh">RH</SelectItem>
                  <SelectItem value="final">Final</SelectItem>
                  <SelectItem value="équipe">Équipe</SelectItem>
                </SelectContent>
              </Select>

              <div className="text-sm text-gray-600">
                {filteredInterviews.length} entretien(s) trouvé(s)
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Onglets de vue */}
        <Tabs defaultValue="calendar" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3 bg-gray-100">
            <TabsTrigger value="calendar" className="gap-2">
              <CalendarIcon className="h-4 w-4" />
              Calendrier
            </TabsTrigger>
            <TabsTrigger value="list" className="gap-2">
              <Clock className="h-4 w-4" />
              Liste
            </TabsTrigger>
            <TabsTrigger value="stats" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Statistiques
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calendar" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Calendrier */}
              <Card className="lg:col-span-2 shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <CalendarIcon className="h-5 w-5 text-blue-600" />
                      {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </CardTitle>
                    <div className="flex items-center gap-1">
                      <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-7 gap-1 mb-4">
                    {dayNames.map(day => (
                      <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                        {day}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {getDaysInMonth(currentDate).map((day, index) => {
                      const dayInterviews = day ? getInterviewsForDay(day) : [];
                      return (
                        <div
                          key={index}
                          className={`
                            p-2 text-center text-sm border rounded-lg cursor-pointer transition-colors min-h-[60px] flex flex-col items-center justify-start
                            ${day === null ? 'invisible' : ''}
                            ${day === new Date().getDate() && 
                              currentDate.getMonth() === new Date().getMonth() && 
                              currentDate.getFullYear() === new Date().getFullYear()
                              ? 'bg-blue-500 text-white font-bold' 
                              : 'hover:bg-gray-100'
                            }
                            ${day && hasInterview(day) ? 'bg-green-100 border-green-300' : ''}
                          `}
                        >
                          {day && (
                            <>
                              <span className={`${dayInterviews.length > 0 ? 'font-bold' : ''}`}>
                                {day}
                              </span>
                              {dayInterviews.length > 0 && (
                                <div className="flex flex-col gap-1 mt-1">
                                  {dayInterviews.slice(0, 2).map((interview, idx) => (
                                    <div key={idx} className="w-full">
                                      <div className="text-xs bg-blue-500 text-white px-1 py-0.5 rounded truncate">
                                        {interview.time} {interview.company}
                                      </div>
                                    </div>
                                  ))}
                                  {dayInterviews.length > 2 && (
                                    <div className="text-xs text-gray-600">
                                      +{dayInterviews.length - 2}
                                    </div>
                                  )}
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Entretiens à venir */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-green-600" />
                    Entretiens à venir
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {upcomingInterviews.slice(0, 5).map((interview) => (
                      <div key={interview.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-gray-900">{interview.company}</h4>
                            <p className="text-sm text-gray-600">{interview.position}</p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {interview.type}
                          </Badge>
                        </div>
                        
                        <div className="space-y-1 text-xs text-gray-500 mb-3">
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="h-3 w-3" />
                            {new Date(interview.date).toLocaleDateString('fr-FR')}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {interview.time} ({interview.duration})
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {interview.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {interview.interviewer}
                          </div>
                        </div>

                        <InterviewActions
                          interview={interview}
                          onEdit={handleInterviewEdit}
                          onDelete={handleInterviewDelete}
                          onStatusChange={handleStatusChange}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="list" className="mt-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Liste des entretiens</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredInterviews.map((interview) => {
                    const application = applications.find(app => app.id === interview.applicationId);
                    return (
                      <div key={interview.id} className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
                              {application?.logo ? (
                                <img 
                                  src={application.logo} 
                                  alt={interview.company}
                                  className="w-full h-full object-cover rounded-xl"
                                />
                              ) : (
                                <Building className="h-6 w-6 text-gray-500" />
                              )}
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-gray-900">{interview.company}</h3>
                              <p className="text-md text-gray-700">{interview.position}</p>
                              <p className="text-sm text-gray-500">{interview.type}</p>
                            </div>
                          </div>

                          <InterviewActions
                            interview={interview}
                            onEdit={handleInterviewEdit}
                            onDelete={handleInterviewDelete}
                            onStatusChange={handleStatusChange}
                          />
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4 text-gray-400" />
                            <span>{new Date(interview.date).toLocaleDateString('fr-FR')}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span>{interview.time} ({interview.duration})</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span>{interview.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-gray-400" />
                            <span>{interview.interviewer}</span>
                          </div>
                        </div>

                        {interview.notes && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-700">
                              <strong>Notes:</strong> {interview.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Répartition par statut</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { status: "confirmé", count: stats.confirmed, color: "bg-green-500" },
                      { status: "à confirmer", count: stats.pending, color: "bg-yellow-500" },
                      { status: "en attente", count: interviews.filter(i => i.status === "en attente").length, color: "bg-blue-500" },
                      { status: "annulé", count: interviews.filter(i => i.status === "annulé").length, color: "bg-red-500" }
                    ].map((item) => (
                      <div key={item.status} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full ${item.color}`}></div>
                          <span className="capitalize">{item.status}</span>
                        </div>
                        <span className="font-semibold">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Répartition par type</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { type: "Entretien technique", count: interviews.filter(i => i.type.includes("technique")).length, color: "bg-purple-500" },
                      { type: "Entretien RH", count: interviews.filter(i => i.type.includes("RH")).length, color: "bg-blue-500" },
                      { type: "Entretien final", count: interviews.filter(i => i.type.includes("final")).length, color: "bg-green-500" },
                      { type: "Entretien équipe", count: interviews.filter(i => i.type.includes("équipe")).length, color: "bg-orange-500" }
                    ].map((item) => (
                      <div key={item.type} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full ${item.color}`}></div>
                          <span>{item.type}</span>
                        </div>
                        <span className="font-semibold">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Calendar;
