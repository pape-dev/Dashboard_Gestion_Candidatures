
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Building, MapPin, Calendar, TrendingUp, AlertCircle,
  Users, Star, Clock, Eye, Edit, Mail, ArrowRight
} from "lucide-react";
import ApplicationActions from "@/components/ApplicationActions";

import { Application } from "@/contexts/AppContext";

interface ApplicationsTimelineProps {
  applications: Application[];
  selectedApps: string[];
  onSelect: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onView?: (id: string) => void;
  onStatusChange?: (id: string, status: string) => void;
}

const ApplicationsTimeline = ({
  applications,
  selectedApps,
  onSelect,
  onEdit,
  onDelete,
  onView,
  onStatusChange
}: ApplicationsTimelineProps) => {
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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "en cours":
        return "border-blue-500 bg-blue-50";
      case "entretien":
        return "border-green-500 bg-green-50";
      case "accepté":
        return "border-emerald-500 bg-emerald-50";
      case "refusé":
        return "border-red-500 bg-red-50";
      case "en attente":
        return "border-yellow-500 bg-yellow-50";
      default:
        return "border-gray-500 bg-gray-50";
    }
  };

  // Trier par date de candidature
  const sortedApplications = [...applications].sort((a, b) => 
    new Date(b.applied_date || b.created_at).getTime() - new Date(a.applied_date || a.created_at).getTime()
  );

  // Grouper par mois
  const groupedByMonth = sortedApplications.reduce((acc, app) => {
    const date = new Date(app.applied_date || app.created_at);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const monthName = date.toLocaleDateString('fr-FR', { 
      year: 'numeric', 
      month: 'long' 
    });
    
    if (!acc[monthKey]) {
      acc[monthKey] = {
        name: monthName,
        applications: []
      };
    }
    acc[monthKey].applications.push(app);
    return acc;
  }, {} as Record<string, { name: string; applications: Application[] }>);

  return (
    <div className="space-y-8">
      {Object.entries(groupedByMonth).map(([monthKey, group]) => (
        <div key={monthKey} className="relative">
          <div className="sticky top-0 z-10 bg-white py-2 mb-6">
            <h3 className="text-xl font-bold text-gray-800 capitalize flex items-center gap-3">
              <Calendar className="h-5 w-5 text-blue-600" />
              {group.name}
              <Badge variant="outline" className="ml-2">
                {group.applications.length} candidature{group.applications.length > 1 ? 's' : ''}
              </Badge>
            </h3>
          </div>

          <div className="relative">
            {/* Ligne de timeline */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 to-transparent"></div>

            <div className="space-y-6">
              {group.applications.map((app, index) => (
                <div key={app.id} className="relative flex gap-6">
                  {/* Point sur la timeline */}
                  <div className={`absolute left-6 w-4 h-4 rounded-full border-4 ${getStatusColor(app.status)} z-10`}></div>
                  
                  {/* Checkbox */}
                  <div className="flex items-start pt-2">
                    <Checkbox
                      checked={selectedApps.includes(app.id)}
                      onCheckedChange={() => onSelect(app.id)}
                      className="mt-1 border-2"
                    />
                  </div>

                  {/* Contenu de la carte */}
                  <Card className={`flex-1 ml-6 hover:shadow-xl transition-all duration-300 border-l-4 ${getStatusColor(app.status).replace('bg-', 'border-l-').replace('-50', '-500')}`}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          {/* Logo */}
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden shadow-md">
                            {app.company_logo_url ? (
                              <img 
                                src={app.company_logo_url} 
                                alt={app.company}
                                className="w-full h-full object-cover rounded-xl"
                                onError={(e) => {
                                  e.currentTarget.src = '';
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            ) : (
                              <Building className="h-6 w-6 text-gray-500" />
                            )}
                          </div>

                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h4 className="text-lg font-bold text-gray-900">{app.company}</h4>
                              {getPriorityIcon(app.priority || 'medium')}
                              <Badge className={`${getStatusColor(app.status)} font-medium px-3 py-1`}>
                                {app.status || 'Non défini'}
                              </Badge>
                            </div>
                            <h5 className="text-md font-semibold text-gray-700">{app.position}</h5>
                          </div>
                        </div>

                        {/* Actions rapides */}
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            onClick={() => onView?.(app.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 px-2 text-green-600 hover:text-green-700 hover:bg-green-50"
                            onClick={() => onEdit?.(app.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 px-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                            onClick={() => window.open(`mailto:${app.contactEmail}`)}
                          >
                            <Mail className="h-4 w-4" />
                          </Button>
                          <ApplicationActions 
                            application={app} 
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onView={onView}
                            onStatusChange={onStatusChange}
                          />
                        </div>
                      </div>

                      {/* Description */}
                      {app.description && (
                        <p className="text-gray-600 mb-4 line-clamp-2">{app.description}</p>
                      )}

                      {/* Informations détaillées */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span>{app.location || 'Non spécifié'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span>{app.applied_date ? new Date(app.applied_date).toLocaleDateString('fr-FR') : 'Non spécifié'}</span>
                        </div>
                        <div className="flex items-center gap-2 font-semibold text-green-600">
                          <TrendingUp className="h-4 w-4" />
                          <span>
                            {app.salary_min && app.salary_max 
                              ? `${app.salary_min}-${app.salary_max}${app.salary_currency}` 
                              : 'Non spécifié'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-gray-400" />
                          <span>{app.contact_person || 'Non spécifié'}</span>
                        </div>
                      </div>

                      {/* Prochaine étape */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-blue-600">
                          <AlertCircle className="h-4 w-4" />
                          <span className="font-medium text-sm">{app.next_step || 'Aucune action définie'}</span>
                        </div>
                        <ArrowRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const getStatusColor = (status: string | null) => {
  switch (status) {
    case "En cours": return "bg-blue-100 text-blue-800 border-blue-200";
    case "Entretien": return "bg-green-100 text-green-800 border-green-200";
    case "En attente": return "bg-amber-100 text-amber-800 border-amber-200";
    case "Accepté": return "bg-emerald-100 text-emerald-800 border-emerald-200";
    case "Refusé": return "bg-red-100 text-red-800 border-red-200";
    default: return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export default ApplicationsTimeline;
