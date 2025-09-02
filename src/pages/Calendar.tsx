import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar as CalendarIcon, Clock, MapPin, Users, Plus, ChevronLeft, ChevronRight,
  Video, Phone, Mail, Filter, Search, Download, Bell, Settings, Building,
  TrendingUp, AlertCircle, CheckCircle, BarChart3, Loader2
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import InterviewActions from "@/components/InterviewActions";
import InterviewForm from "@/components/InterviewForm";
import { useAppContext } from "@/contexts/AppContext";
import { useToast } from "@/hooks/use-toast";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const { 
    applications, 
    interviews, 
    tasks, 
    loading, 
    error,
    addInterview, 
    updateInterview, 
    deleteInterview
  } = useAppContext();
  const { toast } = useToast();
  
  const filteredInterviews = interviews.filter(interview => {
    const matchesSearch = interview.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         interview.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (interview.interviewer && interview.interviewer.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === "all" || interview.status === statusFilter;
    const matchesType = typeFilter === "all" || (interview.type && interview.type.toLowerCase().includes(typeFilter.toLowerCase()));
    return matchesSearch && matchesStatus && matchesType;
  });

  const upcomingInterviews = filteredInterviews.filter(interview => 
    new Date(interview.interview_date) >= new Date()
  ).sort((a, b) => new Date(a.interview_date).getTime() - new Date(b.interview_date).getTime());

  const todayInterviews = filteredInterviews.filter(interview => {
    const today = new Date();
    const interviewDate = new Date(interview.interview_date);
    return interviewDate.toDateString() === today.toDateString();
  });

  const thisWeekInterviews = filteredInterviews.filter(interview => {
    const today = new Date();
    const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const interviewDate = new Date(interview.interview_date);
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
    return interviews.filter(interview => interview.interview_date === dateStr);
  };

  const hasInterview = (day: number) => {
    return getInterviewsForDay(day).length > 0;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };

  const handleInterviewEdit = (id: string) => {
    console.log('Édition de l\'entretien:', id);
  };

  const handleInterviewDelete = async (id: string) => {
    try {
      await deleteInterview(id);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await updateInterview(id, { status });
    } catch (error) {
      console.error('Erreur lors du changement de statut:', error);
    }
  };

  const handleExportCalendar = () => {
    const icsContent = generateICSFile(interviews);
    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `entretiens-${new Date().toISOString().split('T')[0]}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export réussi",
      description: "Fichier ICS téléchargé avec succès",
    });
  };

  const generateICSFile = (interviews: any[]) => {
    const icsEvents = interviews.map(interview => {
      const startDate = new Date(`${interview.interview_date}T${interview.interview_time}`);
      const endDate = new Date(startDate.getTime() + (interview.duration === '1h' ? 60 : 120) * 60000);
      
      return `BEGIN:VEVENT
UID:${interview.id}@entretiens-app.com
DTSTART:${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTEND:${endDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z
SUMMARY:${interview.type} - ${interview.company}
DESCRIPTION:Poste: ${interview.position}\\nIntervieweur: ${interview.interviewer || 'Non spécifié'}\\nNotes: ${interview.notes || 'Aucune note'}
LOCATION:${interview.location || 'Non spécifié'}
STATUS:${interview.status === 'confirmé' ? 'CONFIRMED' : 'TENTATIVE'}
END:VEVENT`;
    }).join('\n');

    return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Entretiens App//Calendar//FR
${icsEvents}
END:VCALENDAR`;
  };

  const monthNames = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];

  const dayNames = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-lg font-medium text-slate-700 dark:text-slate-300">Chargement...</p>
          </div>
        </div>
      </Layout>
    );
  }

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
              className="gap-2 hover:bg-gray-50 border-gray-300"
              onClick={handleExportCalendar}
            >
              <Download className="h-4 w-4" />
              Exporter
            </Button>
            
            <InterviewForm>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 gap-2">
                <Plus className="h-4 w-4" />
                Nouvel entretien
              </Button>
            </InterviewForm>
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
                                        {interview.interview_time} {interview.company}
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
                     {upcomingInterviews.slice(0, 5).map((interview) => {
                       const application = applications.find(app => app.id === interview.application_id);
                       
                       const getStatusStyle = (status: string) => {
                         switch (status) {
                           case "confirmé": return "bg-green-100 text-green-800 border-green-200";
                           case "à confirmer": return "bg-yellow-100 text-yellow-800 border-yellow-200";
                           case "en attente": return "bg-blue-100 text-blue-800 border-blue-200";
                           case "annulé": return "bg-red-100 text-red-800 border-red-200";
                           default: return "bg-gray-100 text-gray-800 border-gray-200";
                         }
                       };

                       return (
                         <div key={interview.id} className="group relative bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 border border-gray-200 dark:border-slate-600 rounded-xl p-5 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-300 transform hover:-translate-y-1">
                           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-t-xl"></div>
                           
                           <div className="flex items-start justify-between mb-4">
                             <div className="flex items-center gap-3">
                               <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden shadow-lg">
                                 {application?.company_logo_url ? (
                                   <img 
                                     src={application.company_logo_url} 
                                     alt={interview.company}
                                     className="w-full h-full object-cover rounded-xl"
                                   />
                                 ) : (
                                   <Building className="h-6 w-6 text-white" />
                                 )}
                               </div>
                               <div>
                                 <h4 className="font-bold text-gray-900 dark:text-slate-100 text-lg">{interview.company}</h4>
                                 <p className="text-sm text-gray-600 dark:text-slate-300 font-medium">{interview.position}</p>
                                 <Badge className={`mt-1 ${getStatusStyle(interview.status || '')} text-xs font-semibold`}>
                                   {interview.status}
                                 </Badge>
                               </div>
                             </div>
                             
                             <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 font-medium">
                               {interview.type}
                             </Badge>
                           </div>
                           
                           <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                             <div className="flex items-center gap-2 p-2 bg-white dark:bg-slate-700 rounded-lg border border-gray-100 dark:border-slate-600">
                               <CalendarIcon className="h-4 w-4 text-blue-500" />
                               <span className="font-medium text-gray-700 dark:text-slate-200">{new Date(interview.interview_date).toLocaleDateString('fr-FR')}</span>
                             </div>
                             <div className="flex items-center gap-2 p-2 bg-white dark:bg-slate-700 rounded-lg border border-gray-100 dark:border-slate-600">
                               <Clock className="h-4 w-4 text-green-500" />
                               <span className="font-medium text-gray-700 dark:text-slate-200">{interview.interview_time}</span>
                             </div>
                             <div className="flex items-center gap-2 p-2 bg-white dark:bg-slate-700 rounded-lg border border-gray-100 dark:border-slate-600">
                               <MapPin className="h-4 w-4 text-purple-500" />
                               <span className="font-medium text-gray-700 dark:text-slate-200 truncate">{interview.location || 'Non spécifié'}</span>
                             </div>
                             <div className="flex items-center gap-2 p-2 bg-white dark:bg-slate-700 rounded-lg border border-gray-100 dark:border-slate-600">
                               <Users className="h-4 w-4 text-orange-500" />
                               <span className="font-medium text-gray-700 dark:text-slate-200 truncate">{interview.interviewer || 'Non spécifié'}</span>
                             </div>
                           </div>

                           <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-slate-600">
                             <div className="text-xs text-gray-500 dark:text-slate-400">
                               Durée: <span className="font-semibold">{interview.duration}</span>
                             </div>
                             <InterviewActions
                               interview={interview}
                               onEdit={handleInterviewEdit}
                               onDelete={handleInterviewDelete}
                               onStatusChange={handleStatusChange}
                             />
                           </div>
                         </div>
                       );
                     })}

                     {upcomingInterviews.length === 0 && (
                       <div className="text-center py-8 text-gray-500">
                         <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                         <p>Aucun entretien à venir</p>
                         <InterviewForm>
                           <Button variant="outline" className="mt-4">
                             <Plus className="h-4 w-4 mr-2" />
                             Planifier un entretien
                           </Button>
                         </InterviewForm>
                       </div>
                     )}
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
                     const application = applications.find(app => app.id === interview.application_id);
                     const getStatusStyle = (status: string) => {
                       switch (status) {
                         case "confirmé": return "bg-green-100 text-green-800 border-green-200";
                         case "à confirmer": return "bg-yellow-100 text-yellow-800 border-yellow-200";
                         case "en attente": return "bg-blue-100 text-blue-800 border-blue-200";
                         case "annulé": return "bg-red-100 text-red-800 border-red-200";
                         default: return "bg-gray-100 text-gray-800 border-gray-200";
                       }
                     };

                     const isUpcoming = new Date(interview.interview_date) >= new Date();
                     const isToday = new Date(interview.interview_date).toDateString() === new Date().toDateString();

                     return (
                       <div key={interview.id} className={`group relative bg-gradient-to-br from-white via-gray-50 to-gray-100 border rounded-xl p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${isToday ? 'ring-2 ring-blue-500 border-blue-300' : 'border-gray-200 hover:border-blue-300'}`}>
                         <div className={`absolute top-0 left-0 w-full h-2 rounded-t-xl ${isToday ? 'bg-gradient-to-r from-blue-500 to-green-500' : isUpcoming ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-gradient-to-r from-gray-400 to-gray-500'}`}></div>
                         
                         {isToday && (
                           <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg animate-pulse">
                             AUJOURD'HUI
                           </div>
                         )}

                         <div className="flex items-start justify-between mb-6">
                           <div className="flex items-center gap-4">
                             <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden shadow-lg ring-4 ring-white">
                               {application?.company_logo_url ? (
                                 <img 
                                   src={application.company_logo_url} 
                                   alt={interview.company}
                                   className="w-full h-full object-cover rounded-xl"
                                 />
                               ) : (
                                 <Building className="h-8 w-8 text-white" />
                               )}
                             </div>
                             <div>
                               <h3 className="text-xl font-bold text-gray-900 mb-1">{interview.company}</h3>
                               <p className="text-lg text-gray-700 font-medium mb-2">{interview.position}</p>
                               <div className="flex items-center gap-2">
                                 <Badge className={`${getStatusStyle(interview.status || '')} text-xs font-semibold px-3 py-1`}>
                                   {interview.status}
                                 </Badge>
                                 <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 font-medium text-xs px-3 py-1">
                                   {interview.type}
                                 </Badge>
                               </div>
                             </div>
                           </div>

                           <InterviewActions
                             interview={interview}
                             onEdit={handleInterviewEdit}
                             onDelete={handleInterviewDelete}
                             onStatusChange={handleStatusChange}
                           />
                         </div>

                         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                           <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
                             <div className="p-2 bg-blue-100 rounded-lg">
                               <CalendarIcon className="h-4 w-4 text-blue-600" />
                             </div>
                             <div>
                               <p className="text-xs text-gray-500 font-medium">Date</p>
                               <p className="text-sm font-bold text-gray-900">{new Date(interview.interview_date).toLocaleDateString('fr-FR')}</p>
                             </div>
                           </div>
                           
                           <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
                             <div className="p-2 bg-green-100 rounded-lg">
                               <Clock className="h-4 w-4 text-green-600" />
                             </div>
                             <div>
                               <p className="text-xs text-gray-500 font-medium">Heure</p>
                               <p className="text-sm font-bold text-gray-900">{interview.interview_time}</p>
                             </div>
                           </div>
                           
                           <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
                             <div className="p-2 bg-purple-100 rounded-lg">
                               <MapPin className="h-4 w-4 text-purple-600" />
                             </div>
                             <div>
                               <p className="text-xs text-gray-500 font-medium">Lieu</p>
                               <p className="text-sm font-bold text-gray-900 truncate">{interview.location || 'Non spécifié'}</p>
                             </div>
                           </div>
                           
                           <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
                             <div className="p-2 bg-orange-100 rounded-lg">
                               <Users className="h-4 w-4 text-orange-600" />
                             </div>
                             <div>
                               <p className="text-xs text-gray-500 font-medium">Intervieweur</p>
                               <p className="text-sm font-bold text-gray-900 truncate">{interview.interviewer || 'Non spécifié'}</p>
                             </div>
                           </div>
                         </div>

                         <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                           <div className="flex items-center gap-4 text-sm text-gray-600">
                             <span>Durée: <strong>{interview.duration}</strong></span>
                             {interview.meeting_link && (
                               <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                                 <Video className="h-3 w-3 mr-1" />
                                 Lien dispo
                               </Badge>
                             )}
                           </div>
                         </div>

                         {interview.notes && (
                           <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
                             <p className="text-sm text-gray-700">
                               <strong className="text-blue-800">Notes:</strong> {interview.notes}
                             </p>
                           </div>
                         )}
                       </div>
                     );
                   })}

                   {filteredInterviews.length === 0 && (
                     <div className="text-center py-8 text-gray-500">
                       <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                       <p>Aucun entretien planifié</p>
                       <InterviewForm>
                         <Button variant="outline" className="mt-4">
                           <Plus className="h-4 w-4 mr-2" />
                           Planifier un entretien
                         </Button>
                       </InterviewForm>
                     </div>
                   )}
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
                      { type: "Entretien technique", count: interviews.filter(i => i.type?.includes("technique")).length, color: "bg-purple-500" },
                      { type: "Entretien RH", count: interviews.filter(i => i.type?.includes("RH")).length, color: "bg-blue-500" },
                      { type: "Entretien final", count: interviews.filter(i => i.type?.includes("final")).length, color: "bg-green-500" },
                      { type: "Entretien équipe", count: interviews.filter(i => i.type?.includes("équipe")).length, color: "bg-orange-500" }
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