
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

interface ApplicationsTableProps {
  applications: Application[];
  selectedApps: number[];
  onSelect: (id: number) => void;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onView?: (id: number) => void;
  onStatusChange?: (id: number, status: string) => void;
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
                    {app.logo ? (
                      <img 
                        src={app.logo} 
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
                    <span className="text-sm">{app.location}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={`${app.statusColor} font-medium`}>
                    {app.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">
                      {new Date(app.appliedDate).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 font-semibold text-green-600">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-sm">{app.salary}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {getPriorityIcon(app.priority)}
                    <span className="text-sm text-gray-600 capitalize">
                      {app.priority === "high" ? "Haute" : 
                       app.priority === "medium" ? "Moyenne" : "Faible"}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-gray-600">
                    <Users className="h-4 w-4" />
                    <span className="text-sm">{app.contactPerson}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-blue-600">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">{app.nextStep}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 justify-center">
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ApplicationsTable;
