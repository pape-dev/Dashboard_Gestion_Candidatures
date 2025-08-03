import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Clock, CheckCircle } from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";

const WeeklyActivity = () => {
  const { applications, interviews, tasks } = useAppContext();
  
  // Calculer l'activité réelle de la semaine
  const getWeekActivity = () => {
    const today = new Date();
    const weekDays = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      
      const dayApplications = applications.filter(app => {
        const appDate = new Date(app.appliedDate);
        return appDate.toDateString() === date.toDateString();
      }).length;
      
      const dayInterviews = interviews.filter(interview => {
        const interviewDate = new Date(interview.date);
        return interviewDate.toDateString() === date.toDateString();
      }).length;
      
      const dayTasks = tasks.filter(task => {
        const taskDate = new Date(task.dueDate);
        return taskDate.toDateString() === date.toDateString() && task.status === 'completed';
      }).length;
      
      weekDays.push({
        day: date.toLocaleDateString('fr-FR', { weekday: 'short' }),
        date: date.getDate().toString(),
        applications: dayApplications,
        interviews: dayInterviews,
        responses: dayTasks,
        isToday: date.toDateString() === today.toDateString()
      });
    }
    
    return weekDays;
  };
  
  const weekDays = [
    ...getWeekActivity()
  ];

  // Calculer les totaux de la semaine
  const weekTotals = weekDays.reduce((acc, day) => ({
    applications: acc.applications + day.applications,
    interviews: acc.interviews + day.interviews,
    responses: acc.responses + day.responses
  }), { applications: 0, interviews: 0, responses: 0 });

  const getActivityLevel = (total: number) => {
    if (total === 0) return "bg-slate-100 dark:bg-slate-800";
    if (total <= 2) return "bg-blue-200 dark:bg-blue-900";
    if (total <= 4) return "bg-blue-400 dark:bg-blue-700";
    return "bg-blue-600 dark:bg-blue-500";
  };

  return (
    <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 hover:shadow-2xl transition-all duration-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-slate-900 dark:text-slate-100">
          <div className="p-3 rounded-2xl bg-gradient-to-r from-slate-500 to-slate-600 shadow-xl">
            <Calendar className="h-6 w-6 text-white" />
          </div>
          Activité de la semaine
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-3 mb-8">
          {weekDays.map((day, index) => {
            const totalActivity = day.applications + day.interviews + day.responses;
            return (
              <div key={index} className="text-center space-y-3">
                <div className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                  {day.day}
                </div>
                <div className={`text-base font-bold ${day.isToday ? 'text-blue-600' : 'text-slate-700 dark:text-slate-300'}`}>
                  {day.date}
                </div>
                <div 
                  className={`h-20 rounded-2xl ${getActivityLevel(totalActivity)} relative overflow-hidden group cursor-pointer transition-all duration-500 hover:scale-110 hover:shadow-lg`}
                  title={`${totalActivity} activités`}
                >
                  {day.isToday && (
                    <div className="absolute inset-0 border-3 border-blue-500 rounded-2xl animate-pulse shadow-lg"></div>
                  )}
                  
                  {totalActivity > 0 && (
                    <div className="absolute inset-0 p-2 flex flex-col justify-center items-center text-white text-sm font-bold">
                      <div className="text-lg">{totalActivity}</div>
                    </div>
                  )}
                  
                  {/* Tooltip on hover */}
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                    <div className="bg-black/90 backdrop-blur-sm text-white text-sm rounded-xl py-2 px-3 whitespace-nowrap shadow-xl">
                      <div>📧 {day.applications} candidatures</div>
                      <div>👥 {day.interviews} entretiens</div>
                      <div>✅ {day.responses} réponses</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 text-sm text-slate-600 dark:text-slate-400 font-medium">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-slate-100 dark:bg-slate-800 rounded-lg shadow-sm"></div>
            <span>Aucune</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-200 dark:bg-blue-900 rounded-lg shadow-sm"></div>
            <span>Faible</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-400 dark:bg-blue-700 rounded-lg shadow-sm"></div>
            <span>Modérée</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-600 dark:bg-blue-500 rounded-lg shadow-sm"></div>
            <span>Intense</span>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-6 mt-8 pt-6 border-t border-slate-200/50 dark:border-slate-700/50">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-1 text-blue-600">
              <Users className="h-5 w-5" />
            </div>
            <div className="text-2xl font-bold text-slate-700 dark:text-slate-300">{weekTotals.applications}</div>
            <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">Candidatures</div>
          </div>
          
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-1 text-emerald-600">
              <Clock className="h-5 w-5" />
            </div>
            <div className="text-2xl font-bold text-slate-700 dark:text-slate-300">{weekTotals.interviews}</div>
            <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">Entretiens</div>
          </div>
          
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-1 text-green-600">
              <CheckCircle className="h-5 w-5" />
            </div>
            <div className="text-2xl font-bold text-slate-700 dark:text-slate-300">{weekTotals.responses}</div>
            <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">Réponses</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyActivity;