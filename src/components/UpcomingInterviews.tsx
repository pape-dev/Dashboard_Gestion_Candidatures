
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, MapPin, Video, Phone, Star, ArrowRight, Zap } from "lucide-react";

const UpcomingInterviews = () => {
  const interviews = [
    {
      id: 1,
      company: "TechCorp",
      position: "Développeur Frontend",
      date: "2024-01-20",
      time: "14:00",
      type: "Présentiel",
      location: "Paris, France",
      interviewer: "Marie Dupont",
      interviewerAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=center",
      icon: MapPin,
      priority: "high",
      companyLogo: "https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=64&h=64&fit=crop&crop=center",
      status: "confirmé",
      duration: "1h"
    },
    {
      id: 2,
      company: "StartupXYZ",
      position: "UX Designer",
      date: "2024-01-22",
      time: "10:30",
      type: "Visioconférence",
      location: "Zoom",
      interviewer: "Pierre Martin",
      interviewerAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=center",
      icon: Video,
      priority: "medium",
      companyLogo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=64&h=64&fit=crop&crop=center",
      status: "en attente",
      duration: "45min"
    },
    {
      id: 3,
      company: "InnovLab",
      position: "Product Manager",
      date: "2024-01-25",
      time: "16:00",
      type: "Téléphone",
      location: "Appel téléphonique",
      interviewer: "Sophie Bernard",
      interviewerAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=center",
      icon: Phone,
      priority: "high",
      companyLogo: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=64&h=64&fit=crop&crop=center",
      status: "confirmé",
      duration: "30min"
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Présentiel":
        return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-300";
      case "Visioconférence":
        return "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900 dark:text-emerald-300";
      case "Téléphone":
        return "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900 dark:text-purple-300";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-900 dark:text-slate-300";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-l-red-500 bg-red-50 dark:bg-red-950";
      case "medium":
        return "border-l-amber-500 bg-amber-50 dark:bg-amber-950";
      default:
        return "border-l-slate-500 bg-slate-50 dark:bg-slate-950";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmé":
        return "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900 dark:text-emerald-300";
      case "en attente":
        return "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900 dark:text-amber-300";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-900 dark:text-slate-300";
    }
  };

  return (
    <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 shadow-2xl hover:shadow-3xl transition-all duration-500">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-slate-900 dark:text-slate-100">
            <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-blue-600 shadow-xl">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            Entretiens à venir
            <Badge className="bg-emerald-100/80 text-emerald-800 border-emerald-200 dark:bg-emerald-900/80 dark:text-emerald-200 shadow-sm">
              {interviews.length} entretiens
            </Badge>
          </CardTitle>
          <Button variant="outline" size="sm" className="border-emerald-200/50 text-emerald-700 hover:bg-emerald-50/80 dark:border-emerald-700/50 dark:text-emerald-300 shadow-sm">
            <Calendar className="h-4 w-4 mr-2" />
            Calendrier
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {interviews.map((interview) => (
          <div key={interview.id} className={`p-6 border-l-4 ${getPriorityColor(interview.priority)} rounded-2xl backdrop-blur-sm bg-white/80 dark:bg-slate-800/80 hover:bg-white/90 dark:hover:bg-slate-800/90 transition-all duration-500 group hover:shadow-xl hover:scale-[1.02]`}>
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-start gap-4">
                {/* Company Logo */}
                <Avatar className="h-14 w-14 ring-2 ring-white dark:ring-slate-700 shadow-xl group-hover:scale-110 transition-transform duration-500">
                  <AvatarImage src={interview.companyLogo} alt={interview.company} />
                  <AvatarFallback className="bg-gradient-to-r from-emerald-500 to-blue-600 text-white font-bold">
                    {interview.company[0]}
                  </AvatarFallback>
                </Avatar>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <h4 className="font-bold text-xl text-slate-800 dark:text-slate-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors duration-300">
                      {interview.company}
                    </h4>
                    <Badge className={`${getStatusColor(interview.status)} shadow-sm`}>
                      {interview.status}
                    </Badge>
                    {interview.priority === "high" && (
                      <Star className="h-4 w-4 text-amber-500 fill-amber-500 animate-pulse" />
                    )}
                  </div>
                  <p className="text-base font-semibold text-slate-600 dark:text-slate-400">
                    {interview.position}
                  </p>
                  <Badge className={`text-sm ${getTypeColor(interview.type)} shadow-sm`}>
                    <interview.icon className="h-3 w-3 mr-1" />
                    {interview.type}
                  </Badge>
                </div>
              </div>
              
              <div className="text-right space-y-1">
                <div className="text-xl font-bold text-slate-800 dark:text-slate-200">
                  {new Date(interview.date).toLocaleDateString("fr-FR", { 
                    weekday: "short", 
                    day: "numeric", 
                    month: "short" 
                  })}
                </div>
                <div className="text-base text-slate-600 dark:text-slate-400 font-semibold">
                  {interview.time}
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                  {interview.duration}
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-slate-200/50 dark:border-slate-600/50">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 shadow-md">
                  <AvatarImage src={interview.interviewerAvatar} alt={interview.interviewer} />
                  <AvatarFallback className="text-sm bg-slate-200 dark:bg-slate-700 font-semibold">
                    {interview.interviewer.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-base font-semibold text-slate-700 dark:text-slate-300">
                    {interview.interviewer}
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
                    <interview.icon className="h-3 w-3" />
                    {interview.location}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="text-sm border-emerald-200/50 text-emerald-700 hover:bg-emerald-50/80 dark:border-emerald-700/50 dark:text-emerald-300 shadow-sm">
                  <Zap className="h-3 w-3 mr-1" />
                  Préparer
                </Button>
                <Button size="sm" className="text-sm bg-gradient-to-r from-emerald-500 to-blue-600 text-white hover:from-emerald-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300">
                  Rejoindre
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        ))}
        
        {/* Quick stats footer */}
        <div className="mt-8 pt-6 border-t border-slate-200/50 dark:border-slate-700/50">
          <div className="grid grid-cols-3 gap-6 text-center">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">3</div>
              <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">Cette semaine</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-blue-600">2</div>
              <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">Confirmés</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-amber-600">90%</div>
              <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">Taux de présence</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingInterviews;
