
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Building, Calendar, MapPin, TrendingUp, AlertCircle, 
  Users, Star, Clock, Sparkles, ArrowRight, ExternalLink 
} from "lucide-react";
import ApplicationActions from "@/components/ApplicationActions";

interface Application {
  id: number;
  company: string;
  position: string;
  location: string;
  status: string;
  appliedDate: string;
  salary: string;
  statusColor: string;
  description: string;
  priority: string;
  contactPerson: string;
  contactEmail: string;
  nextStep: string;
  tags: string[];
  logo?: string;
}

interface ApplicationCardProps {
  application: Application;
  isSelected: boolean;
  onSelect: (id: number) => void;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onView?: (id: number) => void;
  onStatusChange?: (id: number, status: string) => void;
}

const ApplicationCard = ({ 
  application, 
  isSelected, 
  onSelect, 
  onEdit, 
  onDelete, 
  onView, 
  onStatusChange 
}: ApplicationCardProps) => {
  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case "high":
        return {
          icon: <Star className="h-4 w-4 text-amber-500 fill-amber-500" />,
          border: "border-l-amber-500",
          bg: "bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900"
        };
      case "medium":
        return {
          icon: <Clock className="h-4 w-4 text-blue-500" />,
          border: "border-l-blue-500",
          bg: "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900"
        };
      default:
        return {
          icon: null,
          border: "border-l-slate-500",
          bg: "bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900"
        };
    }
  };

  const getStatusGradient = (status: string) => {
    switch (status) {
      case "En cours":
        return "from-blue-500 to-blue-600";
      case "Entretien":
        return "from-emerald-500 to-emerald-600";
      case "Accepté":
        return "from-green-500 to-green-600";
      case "Refusé":
        return "from-red-500 to-red-600";
      default:
        return "from-amber-500 to-amber-600";
    }
  };

  const priorityConfig = getPriorityConfig(application.priority);
  const daysSinceApplied = Math.floor((new Date().getTime() - new Date(application.appliedDate).getTime()) / (1000 * 60 * 60 * 24));

  return (
    <Card className={`group relative overflow-hidden ${priorityConfig.bg} border-0 hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] ${isSelected ? 'ring-2 ring-blue-500 shadow-xl' : ''}`}>
      {/* Priority Border */}
      <div className={`absolute left-0 top-0 w-1 h-full ${priorityConfig.border.replace('border-l-', 'bg-')}`} />
      
      {/* Selection Overlay */}
      {isSelected && (
        <div className="absolute inset-0 bg-blue-500/10 pointer-events-none" />
      )}

      <CardContent className="p-0">
        <div className="flex items-start p-6 gap-6">
          {/* Selection Checkbox */}
          <div className="flex flex-col items-center gap-3">
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => onSelect(application.id)}
              className="border-2 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
            />
            {application.priority === "high" && (
              <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-900">
                <Sparkles className="h-4 w-4 text-amber-600" />
              </div>
            )}
          </div>
          
          {/* Company Logo */}
          <div className="relative">
            <Avatar className="h-16 w-16 ring-4 ring-white dark:ring-slate-700 shadow-xl group-hover:scale-110 transition-transform duration-300">
              <AvatarImage src={application.logo} alt={application.company} />
              <AvatarFallback className={`bg-gradient-to-r ${getStatusGradient(application.status)} text-white font-bold text-lg`}>
                {application.company[0]}
              </AvatarFallback>
            </Avatar>
            
            {/* Status Badge on Logo */}
            <div className="absolute -bottom-2 -right-2">
              <Badge className={`${application.statusColor} text-xs font-semibold px-2 py-1 shadow-lg`}>
                {application.status}
              </Badge>
            </div>
          </div>

          <div className="flex-1 min-w-0 space-y-4">
            {/* Header Section */}
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                    {application.company}
                  </h3>
                  {priorityConfig.icon}
                  {daysSinceApplied <= 7 && (
                    <Badge className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-300">
                      🔥 Récent
                    </Badge>
                  )}
                </div>
                <h4 className="text-lg font-semibold text-slate-700 dark:text-slate-300">
                  {application.position}
                </h4>
              </div>
              
              <ApplicationActions 
                application={application} 
                onEdit={onEdit}
                onDelete={onDelete}
                onView={onView}
                onStatusChange={onStatusChange}
              />
            </div>

            {/* Description */}
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
              {application.description}
            </p>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {application.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs px-3 py-1 bg-white/80 dark:bg-slate-800/80 hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center gap-2 p-3 bg-white/60 dark:bg-slate-800/60 rounded-xl">
                <MapPin className="h-4 w-4 text-slate-500" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{application.location}</span>
              </div>
              
              <div className="flex items-center gap-2 p-3 bg-white/60 dark:bg-slate-800/60 rounded-xl">
                <Calendar className="h-4 w-4 text-slate-500" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {new Date(application.appliedDate).toLocaleDateString('fr-FR', { 
                    day: 'numeric', 
                    month: 'short' 
                  })}
                </span>
              </div>
              
              <div className="flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-950 rounded-xl">
                <TrendingUp className="h-4 w-4 text-emerald-600" />
                <span className="text-sm font-bold text-emerald-700 dark:text-emerald-300">{application.salary}</span>
              </div>
              
              <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-950 rounded-xl">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300 truncate">{application.nextStep}</span>
              </div>
            </div>

            {/* Footer Section */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-4">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    {application.contactPerson.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {application.contactPerson}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Contact principal
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0 text-slate-500 hover:text-blue-600"
                  onClick={() => window.open(`mailto:${application.contactEmail}`)}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Il y a {daysSinceApplied} jour{daysSinceApplied > 1 ? 's' : ''}
                </div>
                <Button 
                  size="sm" 
                  className={`bg-gradient-to-r ${getStatusGradient(application.status)} text-white hover:shadow-lg transition-all duration-300`}
                  onClick={() => onView?.(application.id)}
                >
                  Voir détails
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApplicationCard;
