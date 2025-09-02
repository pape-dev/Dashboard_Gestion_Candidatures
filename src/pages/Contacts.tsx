import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Users, Plus, Search, Mail, Phone, Building, 
  MapPin, Calendar, MessageCircle, Linkedin, 
  MoreHorizontal, Edit, Trash2, Loader2
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ContactForm from "@/components/ContactForm";
import { useAppContext } from "@/contexts/AppContext";

const Contacts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { 
    contacts, 
    loading, 
    error,
    addContact, 
    updateContact, 
    deleteContact
  } = useAppContext();

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (contact.company && contact.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (contact.position && contact.position.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleContactEdit = (contact: any) => {
    console.log('Édition du contact:', contact.id);
  };

  const handleContactDelete = async (contactId: string) => {
    try {
      await deleteContact(contactId);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const handleSendMessage = (contact: any) => {
    if (contact.email) {
      const subject = encodeURIComponent(`Contact professionnel`);
      const body = encodeURIComponent(`Bonjour ${contact.name},\n\n`);
      window.open(`mailto:${contact.email}?subject=${subject}&body=${body}`);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-lg font-medium text-slate-700 dark:text-slate-300">Chargement...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Contacts</h1>
            <p className="text-gray-600 mt-1">Gérez votre réseau professionnel</p>
          </div>
          <ContactForm>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              Nouveau contact
            </Button>
          </ContactForm>
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
                    <AvatarImage src={contact.avatar_url || undefined} alt={contact.name} />
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-600 text-white text-lg font-semibold">
                      {contact.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{contact.name}</h3>
                        {contact.position && (
                          <p className="text-lg text-gray-700">{contact.position}</p>
                        )}
                        {contact.company && (
                          <div className="flex items-center gap-2 mt-1">
                            <Building className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">{contact.company}</span>
                          </div>
                        )}
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleContactEdit(contact)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleSendMessage(contact)}>
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Envoyer un message
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => handleContactDelete(contact.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        {contact.email && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail className="h-4 w-4" />
                            <a href={`mailto:${contact.email}`} className="hover:text-blue-600">
                              {contact.email}
                            </a>
                          </div>
                        )}
                        {contact.phone && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="h-4 w-4" />
                            <a href={`tel:${contact.phone}`} className="hover:text-blue-600">
                              {contact.phone}
                            </a>
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        {contact.last_contact_date && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4" />
                            Dernier contact: {new Date(contact.last_contact_date).toLocaleDateString('fr-FR')}
                          </div>
                        )}
                      </div>
                    </div>

                    {contact.notes && (
                      <div className="bg-gray-50 p-3 rounded-lg mb-4">
                        <p className="text-sm text-gray-700">{contact.notes}</p>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      {contact.email && (
                        <Button size="sm" variant="outline" onClick={() => handleSendMessage(contact)}>
                          <Mail className="h-4 w-4 mr-2" />
                          Email
                        </Button>
                      )}
                      {contact.phone && (
                        <Button size="sm" variant="outline" onClick={() => window.open(`tel:${contact.phone}`)}>
                          <Phone className="h-4 w-4 mr-2" />
                          Appeler
                        </Button>
                      )}
                      {contact.linkedin_url && (
                        <Button size="sm" variant="outline" onClick={() => window.open(contact.linkedin_url, '_blank')}>
                          <Linkedin className="h-4 w-4 mr-2" />
                          LinkedIn
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredContacts.length === 0 && !loading && (
          <Card className="text-center py-16">
            <CardContent>
              <div className="max-w-md mx-auto">
                <div className="p-4 rounded-full bg-purple-100 dark:bg-purple-900 w-fit mx-auto mb-6">
                  <Users className="h-12 w-12 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">
                  {searchTerm ? "Aucun contact trouvé" : "Aucun contact"}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  {searchTerm 
                    ? "Aucun contact ne correspond à votre recherche"
                    : "Commencez à construire votre réseau professionnel"
                  }
                </p>
                <ContactForm>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <Plus className="h-4 w-4 mr-2" />
                    {searchTerm ? "Nouveau contact" : "Ajouter mon premier contact"}
                  </Button>
                </ContactForm>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Contacts;