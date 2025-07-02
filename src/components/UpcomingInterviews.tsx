
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Video } from "lucide-react";

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
      icon: MapPin
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
      icon: Video
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
      icon: Clock
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Présentiel":
        return "bg-blue-100 text-blue-800";
      case "Visioconférence":
        return "bg-green-100 text-green-800";
      case "Téléphone":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-green-600" />
          Entretiens à venir
        </CardTitle>
        <Button variant="outline" size="sm">
          Calendrier
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {interviews.map((interview) => (
            <div key={interview.id} className="p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">
                    {interview.company}
                  </h4>
                  <p className="text-sm text-gray-600 mb-2">
                    {interview.position}
                  </p>
                  <Badge className={getTypeColor(interview.type)}>
                    {interview.type}
                  </Badge>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {new Date(interview.date).toLocaleDateString('fr-FR')}
                  </div>
                  <div className="text-sm text-gray-500">
                    {interview.time}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <interview.icon className="h-4 w-4" />
                  {interview.location}
                </div>
                <div>
                  avec {interview.interviewer}
                </div>
              </div>
              
              <div className="flex gap-2 mt-3">
                <Button size="sm" variant="outline">
                  Préparer
                </Button>
                <Button size="sm" variant="outline">
                  Rejoindre
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingInterviews;
