
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Building, MapPin, Calendar, TrendingUp, AlertCircle,
  Users, Star, Clock, Eye, Edit, Mail, MoreHorizontal
} from "lucide-react";
import ApplicationActions from "@/components/ApplicationActions";

import { Application } from "@/contexts/AppContext";

interface ApplicationsTableProps {
  applications: Application[];
  selectedApps: string[];
  onSelect: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onView?: (id: string) => void;
  onStatusChange?: (id: string, status: string) => void;
}

const ApplicationsTable = ({
  applications,
  selectedApps,
  onSelect,
  onEdit,
  onDelete,
  onView,
  onStatusChange
}: ApplicationsTableProps) => {
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
    <Card className="shadow-lg">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-12">
                <Checkbox />
              </TableHead>
              <TableHead className="w-16"></TableHead>
              <TableHead className="font-semibold">Entreprise</TableHead>
              <TableHead className="font-semibold">Poste</TableHead>
              <TableHead className="font-semibold">Localisation</TableHead>
              <TableHead className="font-semibold">Statut</TableHead>
              <TableHead className="font-semibold">Date</TableHead>
              <TableHead className="font-semibold">Salaire</TableHead>
              <TableHead className="font-semibold">Priorité</TableHead>
              <TableHead className="font-semibold">Contact</TableHead>
              <TableHead className="font-semibold">Prochaine étape</TableHead>
              <TableHead className="w-32 text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((app) => (
              <TableRow 
                key={app.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <TableCell>
                  <Checkbox
                    checked={selectedApps.includes(app.id)}
                    onCheckedChange={() => onSelect(app.id)}
                  />
                </TableCell>
                <TableCell>
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
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
                      <Building className="h-5 w-5 text-gray-500" />
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-semibold text-gray-900">
                  {app.company}
                </TableCell>
                <TableCell className="font-medium text-gray-800">
                  {app.position}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{app.location || 'Non spécifié'}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={`${getStatusColor(app.status)} font-medium`}>
                    {app.status || 'Non défini'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">
                      {app.applied_date ? new Date(app.applied_date).toLocaleDateString('fr-FR') : 'Non spécifié'}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 font-semibold text-green-600">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-sm">
                      {app.salary_min && app.salary_max 
                        ? `${app.salary_min}-${app.salary_max}${app.salary_currency}` 
                        : 'Non spécifié'}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {getPriorityIcon(app.priority || 'medium')}
                    <span className="text-sm text-gray-600 capitalize">
                      {app.priority === "high" ? "Haute" : 
                       app.priority === "medium" ? "Moyenne" : 
                       app.priority === "low" ? "Faible" : "Moyenne"}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-gray-600">
                    <Users className="h-4 w-4" />
                    <span className="text-sm">{app.contact_person || 'Non spécifié'}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-blue-600">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">{app.next_step || 'Aucune action'}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <ApplicationActions 
                    application={app} 
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onView={onView}
                    onStatusChange={onStatusChange}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
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

export default ApplicationsTable;
