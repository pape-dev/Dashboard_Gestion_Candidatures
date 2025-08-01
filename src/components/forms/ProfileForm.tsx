import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { User, Upload, Loader2 } from "lucide-react";
import { useProfile, UserProfile } from "@/hooks/useProfile";

const profileSchema = z.object({
  first_name: z.string().min(1, "Le prénom est requis"),
  last_name: z.string().min(1, "Le nom est requis"),
  title: z.string().optional(),
  bio: z.string().optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  website: z.string().url("URL invalide").optional().or(z.literal("")),
  linkedin_url: z.string().url("URL LinkedIn invalide").optional().or(z.literal("")),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  profile: UserProfile | null;
}

const ProfileForm = ({ profile }: ProfileFormProps) => {
  const { updateProfile, uploadAvatar, uploading } = useProfile();
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: profile?.first_name || "",
      last_name: profile?.last_name || "",
      title: profile?.title || "",
      bio: profile?.bio || "",
      phone: profile?.phone || "",
      location: profile?.location || "",
      website: profile?.website || "",
      linkedin_url: profile?.linkedin_url || "",
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    await updateProfile(data);
    setIsEditing(false);
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadAvatar(file);
    }
  };

  const displayName = profile?.first_name && profile?.last_name 
    ? `${profile.first_name} ${profile.last_name}`
    : "Utilisateur";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          Informations personnelles
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-start gap-6">
          <div className="relative">
            <Avatar className="w-32 h-32">
              <AvatarImage src={profile?.avatar_url || ""} alt={displayName} />
              <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-white text-2xl font-bold">
                {displayName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            {isEditing && (
              <label className="absolute -bottom-2 -right-2 cursor-pointer">
                <Button 
                  size="sm" 
                  className="rounded-full w-8 h-8 p-0"
                  disabled={uploading}
                  asChild
                >
                  <span>
                    {uploading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                  </span>
                </Button>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="sr-only"
                />
              </label>
            )}
          </div>
          
          <div className="flex-1">
            {isEditing ? (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="first_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Prénom</FormLabel>
                          <FormControl>
                            <Input placeholder="Votre prénom" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="last_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nom</FormLabel>
                          <FormControl>
                            <Input placeholder="Votre nom" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Titre professionnel</FormLabel>
                          <FormControl>
                            <Input placeholder="ex: Développeur Full Stack" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Téléphone</FormLabel>
                          <FormControl>
                            <Input placeholder="+33 6 12 34 56 78" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Localisation</FormLabel>
                          <FormControl>
                            <Input placeholder="Paris, France" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Site web</FormLabel>
                          <FormControl>
                            <Input placeholder="https://monsite.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="linkedin_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>LinkedIn</FormLabel>
                        <FormControl>
                          <Input placeholder="https://linkedin.com/in/monprofil" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Présentation</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Parlez-nous de vous..."
                            rows={4}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex gap-2">
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                      {form.formState.isSubmitting ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : null}
                      Sauvegarder
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsEditing(false)}
                    >
                      Annuler
                    </Button>
                  </div>
                </form>
              </Form>
            ) : (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">{displayName}</h3>
                  {profile?.title && (
                    <p className="text-muted-foreground">{profile.title}</p>
                  )}
                </div>
                
                {profile?.bio && (
                  <p className="text-sm text-muted-foreground">{profile.bio}</p>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  {profile?.phone && (
                    <div>
                      <span className="font-medium">Téléphone: </span>
                      {profile.phone}
                    </div>
                  )}
                  {profile?.location && (
                    <div>
                      <span className="font-medium">Localisation: </span>
                      {profile.location}
                    </div>
                  )}
                  {profile?.website && (
                    <div>
                      <span className="font-medium">Site web: </span>
                      <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        {profile.website}
                      </a>
                    </div>
                  )}
                  {profile?.linkedin_url && (
                    <div>
                      <span className="font-medium">LinkedIn: </span>
                      <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        Profil LinkedIn
                      </a>
                    </div>
                  )}
                </div>
                
                <Button onClick={() => setIsEditing(true)}>
                  Modifier le profil
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileForm;