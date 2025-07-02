
import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Users, Plus, Search, Mail, Phone, Building, 
  MapPin, Calendar, MessageCircle, Linkedin, 
  MoreHorizontal, Edit, Trash2 
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Contacts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const contacts = [
    {
      id: 1,
      name: "Marie Dubois",
      title: "Responsable RH",
      company: "TechCorp",
      email: "marie.dubois@techcorp.com",
      phone: "+33 1 23 45 67 89",
      location: "Paris, France",
      lastContact: "2024-01-15",
      category: "RH",
      notes: "Très professionnelle, entretien prévu la semaine prochaine",
      avatar: "/api/placeholder/40/40"
    },
    {
      id: 2,
      name: "Pierre Martin",
      title: "CTO",
      company: "StartupXYZ",
      email: "pierre.martin@startupxyz.com",
      phone: "+33 1 98 76 54 32",
      location: "Lyon, France",
      lastContact: "2024-01-12",
      category: "Direction",
      notes: "Passionné par les nouvelles technologies",
      avatar: "/api/placeholder/40/40"
    },
    {
      id: 3,
      name: "Sophie Laurent",
      title: "Product Manager",
      company: "InnovLab",
      email: "sophie.laurent@innovlab.com",
      phone: "+33 1 11 22 33 44",
      location: "Toulouse, France",
      lastContact: "2024-01-10",
      category: "Métier",
      notes: "Experte en gestion de produit, très accessible",
      avatar: "/api/placeholder/40/40"
    },
    {
      id: 4,
      name: "Thomas Leroy",
      title: "Développeur Senior",
      company: "WebAgency",
      email: "thomas.leroy@webagency.com",
      phone: "+33 1 55 66 77 88",
      location: "Bordeaux, France",
      lastContact: "2024-01-08",
      category: "Technique",
      notes: "Mentor potentiel, très disponible pour conseiller",
      avatar: "/api/placeholder/40/40"
    }
  ];

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryColor = (category: string) => {
    const colors = {
      "RH": "bg-blue-100 text-blue-800",
      "Direction": "bg-purple-100 text-purple-800",
      "Métier": "bg-green-100 text-green-800",
      "Technique": "bg-orange-100 text-orange-800"
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Contacts</h1>
            <p className="text-gray-600 mt-1">Gérez votre réseau professionnel</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Nouveau contact
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher un contact..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid gap-4">
          {filteredContacts.map((contact) => (
            <Card key={contact.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={contact.avatar} alt={contact.name} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-lg font-semibold">
                      {contact.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{contact.name}</h3>
                        <p className="text-lg text-gray-700">{contact.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Building className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">{contact.company}</span>
                          <Badge className={getCategoryColor(contact.category)}>
                            {contact.category}
                          </Badge>
                        </div>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Envoyer un message
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="h-4 w-4" />
                          <a href={`mailto:${contact.email}`} className="hover:text-blue-600">
                            {contact.email}
                          </a>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="h-4 w-4" />
                          <a href={`tel:${contact.phone}`} className="hover:text-blue-600">
                            {contact.phone}
                          </a>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="h-4 w-4" />
                          {contact.location}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          Dernier contact: {new Date(contact.lastContact).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-lg mb-4">
                      <p className="text-sm text-gray-700">{contact.notes}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        <Mail className="h-4 w-4 mr-2" />
                        Email
                      </Button>
                      <Button size="sm" variant="outline">
                        <Phone className="h-4 w-4 mr-2" />
                        Appeler
                      </Button>
                      <Button size="sm" variant="outline">
                        <Linkedin className="h-4 w-4 mr-2" />
                        LinkedIn
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Contacts;
