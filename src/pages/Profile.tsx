
import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, Mail, Phone, MapPin, Calendar, 
  Briefcase, GraduationCap, Star, Plus, 
  Edit, Download, Upload, Award, Languages
} from "lucide-react";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  
  const profileData = {
    name: "Alexandre Dubois",
    title: "Développeur Full Stack",
    email: "alexandre.dubois@email.com",
    phone: "+33 6 12 34 56 78",
    location: "Paris, France",
    bio: "Développeur passionné avec 5 ans d'expérience dans le développement web moderne. Spécialisé en React, Node.js et les architectures cloud.",
    avatar: "/api/placeholder/120/120"
  };

  const experiences = [
    {
      id: 1,
      title: "Développeur Senior Full Stack",
      company: "TechCorp",
      location: "Paris, France",
      startDate: "2022-03",
      endDate: "Présent",
      description: "Développement d'applications web complexes avec React et Node.js. Encadrement d'une équipe de 3 développeurs juniors."
    },
    {
      id: 2,
      title: "Développeur Frontend",
      company: "WebStudio",
      location: "Lyon, France",
      startDate: "2020-01",
      endDate: "2022-02",
      description: "Création d'interfaces utilisateur modernes et responsives. Collaboration étroite avec les équipes UX/UI."
    }
  ];

  const education = [
    {
      id: 1,
      degree: "Master en Informatique",
      school: "École Supérieure d'Informatique",
      location: "Paris, France",
      startDate: "2017",
      endDate: "2019",
      description: "Spécialisation en développement web et architectures distribuées"
    },
    {
      id: 2,
      degree: "License Informatique",
      school: "Université de Lyon",
      location: "Lyon, France",
      startDate: "2014",
      endDate: "2017",
      description: "Formation générale en informatique et programmation"
    }
  ];

  const skills = [
    { name: "React", level: 5 },
    { name: "Node.js", level: 4 },
    { name: "TypeScript", level: 4 },
    { name: "Python", level: 3 },
    { name: "AWS", level: 3 },
    { name: "Docker", level: 4 },
    { name: "MongoDB", level: 3 },
    { name: "PostgreSQL", level: 4 }
  ];

  const languages = [
    { name: "Français", level: "Natif" },
    { name: "Anglais", level: "Courant" },
    { name: "Espagnol", level: "Intermédiaire" }
  ];

  const certifications = [
    {
      name: "AWS Certified Developer",
      issuer: "Amazon Web Services",
      date: "2023",
      credential: "AWS-123456"
    },
    {
      name: "React Developer Certification",
      issuer: "Meta",
      date: "2022",
      credential: "META-789012"
    }
  ];

  const renderStars = (level: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${index < level ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Profil & CV</h1>
            <p className="text-gray-600 mt-1">Gérez vos informations professionnelles</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Télécharger CV
            </Button>
            <Button 
              onClick={() => setIsEditing(!isEditing)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Edit className="h-4 w-4 mr-2" />
              {isEditing ? "Sauvegarder" : "Modifier"}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profil</TabsTrigger>
            <TabsTrigger value="experience">Expérience</TabsTrigger>
            <TabsTrigger value="skills">Compétences</TabsTrigger>
            <TabsTrigger value="education">Formation</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600" />
                  Informations personnelles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-6">
                  <div className="relative">
                    <Avatar className="w-32 h-32">
                      <AvatarImage src={profileData.avatar} alt={profileData.name} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl font-bold">
                        {profileData.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <Button size="sm" className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0">
                        <Upload className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Nom complet</label>
                      {isEditing ? (
                        <Input defaultValue={profileData.name} />
                      ) : (
                        <p className="text-lg font-semibold">{profileData.name}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Titre professionnel</label>
                      {isEditing ? (
                        <Input defaultValue={profileData.title} />
                      ) : (
                        <p className="text-lg text-gray-700">{profileData.title}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
                      {isEditing ? (
                        <Input defaultValue={profileData.email} />
                      ) : (
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span>{profileData.email}</span>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Téléphone</label>
                      {isEditing ? (
                        <Input defaultValue={profileData.phone} />
                      ) : (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span>{profileData.phone}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Localisation</label>
                      {isEditing ? (
                        <Input defaultValue={profileData.location} />
                      ) : (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span>{profileData.location}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Présentation</label>
                      {isEditing ? (
                        <Textarea defaultValue={profileData.bio} rows={4} />
                      ) : (
                        <p className="text-gray-700">{profileData.bio}</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="experience" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-blue-600" />
                  Expérience professionnelle
                </CardTitle>
                <Button size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {experiences.map((exp) => (
                    <div key={exp.id} className="border-l-2 border-blue-200 pl-4 pb-6 last:pb-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">{exp.title}</h3>
                          <p className="text-blue-600 font-medium">{exp.company}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {exp.startDate} - {exp.endDate}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {exp.location}
                            </div>
                          </div>
                          <p className="text-gray-700 mt-2">{exp.description}</p>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="skills" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-blue-600" />
                    Compétences techniques
                  </CardTitle>
                  <Button size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {skills.map((skill, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="font-medium">{skill.name}</span>
                        <div className="flex items-center gap-2">
                          <div className="flex">{renderStars(skill.level)}</div>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Languages className="h-5 w-5 text-blue-600" />
                    Langues
                  </CardTitle>
                  <Button size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {languages.map((lang, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="font-medium">{lang.name}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{lang.level}</Badge>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-blue-600" />
                  Certifications
                </CardTitle>
                <Button size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {certifications.map((cert, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900">{cert.name}</h4>
                      <p className="text-blue-600">{cert.issuer}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-gray-500">{cert.date}</span>
                        <span className="text-xs text-gray-400">{cert.credential}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="education" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-blue-600" />
                  Formation
                </CardTitle>
                <Button size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {education.map((edu) => (
                    <div key={edu.id} className="border-l-2 border-green-200 pl-4 pb-6 last:pb-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">{edu.degree}</h3>
                          <p className="text-green-600 font-medium">{edu.school}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {edu.startDate} - {edu.endDate}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {edu.location}
                            </div>
                          </div>
                          <p className="text-gray-700 mt-2">{edu.description}</p>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Profile;
