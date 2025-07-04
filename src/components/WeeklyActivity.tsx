import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Clock, CheckCircle } from "lucide-react";

const WeeklyActivity = () => {
  const weekDays = [
    {
      day: "Lun",
      date: "7",
      applications: 3,
      interviews: 1,
      responses: 0,
      isToday: false
    },
    {
      day: "Mar",
      date: "8",
      applications: 2,
      interviews: 0,
      responses: 1,
      isToday: false
    },
    {
      day: "Mer",
      date: "9",
      applications: 4,
      interviews: 2,
      responses: 0,
      isToday: false
    },
    {
      day: "Jeu",
      date: "10",
      applications: 1,
      interviews: 1,
      responses: 2,
      isToday: true
    },
    {
      day: "Ven",
      date: "11",
      applications: 0,
      interviews: 1,
      responses: 0,
      isToday: false
    },
    {
      day: "Sam",
      date: "12",
      applications: 0,
      interviews: 0,
      responses: 0,
      isToday: false
    },
    {
      day: "Dim",
      date: "13",
      applications: 0,
      interviews: 0,
      responses: 0,
      isToday: false
    }
  ];

  const getActivityLevel = (total: number) => {
    if (total === 0) return "bg-slate-100 dark:bg-slate-800";
    if (total <= 2) return "bg-blue-200 dark:bg-blue-900";
    if (total <= 4) return "bg-blue-400 dark:bg-blue-700";
    return "bg-blue-600 dark:bg-blue-500";
  };

  return (
    <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 border-0 hover:shadow-xl transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
          <Calendar className="h-5 w-5 text-slate-600" />
          Activité de la semaine
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2 mb-6">
          {weekDays.map((day, index) => {
            const totalActivity = day.applications + day.interviews + day.responses;
            return (
              <div key={index} className="text-center space-y-2">
                <div className="text-xs font-medium text-slate-600 dark:text-slate-400">
                  {day.day}
                </div>
                <div className={`text-sm font-bold ${day.isToday ? 'text-blue-600' : 'text-slate-700 dark:text-slate-300'}`}>
                  {day.date}
                </div>
                <div 
                  className={`h-16 rounded-lg ${getActivityLevel(totalActivity)} relative overflow-hidden group cursor-pointer transition-all duration-300 hover:scale-110`}
                  title={`${totalActivity} activités`}
                >
                  {day.isToday && (
                    <div className="absolute inset-0 border-2 border-blue-500 rounded-lg animate-pulse"></div>
                  )}
                  
                  {totalActivity > 0 && (
                    <div className="absolute inset-0 p-1 flex flex-col justify-center items-center text-white text-xs font-semibold">
                      <div>{totalActivity}</div>
                    </div>
                  )}
                  
                  {/* Tooltip on hover */}
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                    <div className="bg-black text-white text-xs rounded py-1 px-2 whitespace-nowrap">
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
        <div className="flex items-center justify-center gap-4 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-slate-100 dark:bg-slate-800 rounded"></div>
            <span>Aucune</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-200 dark:bg-blue-900 rounded"></div>
            <span>Faible</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-400 dark:bg-blue-700 rounded"></div>
            <span>Modérée</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-600 dark:bg-blue-500 rounded"></div>
            <span>Intense</span>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-3 mt-6">
          <div className="text-center space-y-1">
            <div className="flex items-center justify-center gap-1 text-blue-600">
              <Users className="h-4 w-4" />
            </div>
            <div className="text-lg font-bold text-slate-700 dark:text-slate-300">10</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Candidatures</div>
          </div>
          
          <div className="text-center space-y-1">
            <div className="flex items-center justify-center gap-1 text-emerald-600">
              <Clock className="h-4 w-4" />
            </div>
            <div className="text-lg font-bold text-slate-700 dark:text-slate-300">5</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Entretiens</div>
          </div>
          
          <div className="text-center space-y-1">
            <div className="flex items-center justify-center gap-1 text-green-600">
              <CheckCircle className="h-4 w-4" />
            </div>
            <div className="text-lg font-bold text-slate-700 dark:text-slate-300">3</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Réponses</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyActivity;