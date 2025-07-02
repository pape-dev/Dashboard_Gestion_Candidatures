
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building, Calendar, ExternalLink } from "lucide-react";

const RecentApplications = () => {
  const applications = [
    {
      id: 1,
      company: "TechCorp",
      position: "Développeur Frontend",
      status: "En cours",
      appliedDate: "2024-01-15",
      statusColor: "bg-blue-100 text-blue-800"
    },
    {
      id: 2,
      company: "StartupXYZ",
      position: "UX Designer",
      status: "Entretien",
      appliedDate: "2024-01-12",
      statusColor: "bg-green-100 text-green-800"
    },
    {
      id: 3,
      company: "DataCorp",
      position: "Data Analyst",
      status: "Refusé",
      appliedDate: "2024-01-10",
      statusColor: "bg-red-100 text-red-800"
    },
    {
      id: 4,
      company: "InnovLab",
      position: "Product Manager",
      status: "En attente",
      appliedDate: "2024-01-08",
      statusColor: "bg-yellow-100 text-yellow-800"
    },
    {
      id: 5,
      company: "WebAgency",
      position: "Développeur Full Stack",
      status: "En cours",
      appliedDate: "2024-01-05",
      statusColor: "bg-blue-100 text-blue-800"
    }
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5 text-blue-600" />
          Candidatures récentes
        </CardTitle>
        <Button variant="outline" size="sm">
          Voir tout
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h4 className="font-medium text-gray-900">{app.company}</h4>
                  <Badge className={app.statusColor}>
                    {app.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-1">{app.position}</p>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Calendar className="h-3 w-3" />
                  {new Date(app.appliedDate).toLocaleDateString('fr-FR')}
                </div>
              </div>
              <Button variant="ghost" size="sm" className="ml-2">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentApplications;
