
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Building, Calendar, MapPin, TrendingUp, AlertCircle, 
  Users, Star, Clock 
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
}

const ApplicationCard = ({ application, isSelected, onSelect }: ApplicationCardProps) => {
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <Star className="h-4 w-4 text-yellow-500 fill-current" />;
      case "medium":
        return <Clock className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <Card className="hover:shadow-2xl transition-all duration-300 border-l-4 border-l-transparent hover:border-l-blue-500 bg-white shadow-lg">
      <CardContent className="p-0">
        <div className="flex items-start p-6 gap-6">
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onSelect(application.id)}
            className="mt-1 border-2"
          />
          
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center flex-shrink-0 overflow-hidden shadow-md">
            {application.logo ? (
              <img 
                src={application.logo} 
                alt={application.company}
                className="w-full h-full object-cover rounded-2xl"
                onError={(e) => {
                  e.currentTarget.src = '';
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <Building className="h-8 w-8 text-gray-500" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-bold text-gray-900">{application.company}</h3>
                {getPriorityIcon(application.priority)}
                <Badge className={`${application.statusColor} font-medium px-3 py-1`}>
                  {application.status}
                </Badge>
              </div>
              
              <ApplicationActions application={application} />
            </div>

            <h4 className="text-lg font-semibold text-gray-800 mb-2">{application.position}</h4>
            <p className="text-gray-600 mb-4 line-clamp-2">{application.description}</p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {application.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs px-3 py-1 bg-gray-50">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span>{application.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span>{new Date(application.appliedDate).toLocaleDateString('fr-FR')}</span>
              </div>
              <div className="flex items-center gap-2 font-semibold text-green-600">
                <TrendingUp className="h-4 w-4" />
                <span>{application.salary}</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-blue-500" />
                <span className="font-medium">{application.nextStep}</span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="h-4 w-4" />
                  <span>{application.contactPerson}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApplicationCard;
