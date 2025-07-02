
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search, Calendar, FileText, Users, Target } from "lucide-react";

const QuickActions = () => {
  const actions = [
    {
      title: "Nouvelle candidature",
      description: "Ajouter une candidature",
      icon: Plus,
      color: "bg-blue-600 hover:bg-blue-700",
      action: () => console.log("Nouvelle candidature")
    },
    {
      title: "Chercher emplois",
      description: "Explorer les offres",
      icon: Search,
      color: "bg-green-600 hover:bg-green-700",
      action: () => console.log("Chercher emplois")
    },
    {
      title: "Planifier entretien",
      description: "Ajouter au calendrier",
      icon: Calendar,
      color: "bg-purple-600 hover:bg-purple-700",
      action: () => console.log("Planifier entretien")
    },
    {
      title: "Mettre à jour CV",
      description: "Modifier le profil",
      icon: FileText,
      color: "bg-orange-600 hover:bg-orange-700",
      action: () => console.log("Mettre à jour CV")
    },
    {
      title: "Ajouter contact",
      description: "Nouveau contact réseau",
      icon: Users,
      color: "bg-pink-600 hover:bg-pink-700",
      action: () => console.log("Ajouter contact")
    },
    {
      title: "Créer tâche",
      description: "Nouvelle tâche de suivi",
      icon: Target,
      color: "bg-indigo-600 hover:bg-indigo-700",
      action: () => console.log("Créer tâche")
    }
  ];

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Actions rapides</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2 hover:shadow-md transition-all"
              onClick={action.action}
            >
              <div className={`p-2 rounded-lg ${action.color} text-white`}>
                <action.icon className="h-5 w-5" />
              </div>
              <div className="text-center">
                <div className="font-medium text-sm">{action.title}</div>
                <div className="text-xs text-gray-500">{action.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
