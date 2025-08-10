import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Loader2, Users } from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Label } from "@/components/ui/label";

const contactSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Email invalide").optional().or(z.literal("")),
  phone: z.string().optional(),
  company: z.string().optional(),
  position: z.string().optional(),
  notes: z.string().optional(),
  linkedin_url: z.string().url("URL LinkedIn invalide").optional().or(z.literal("")),
  last_contact_date: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

interface ContactFormProps {
  children?: React.ReactNode;
  contact?: any;
  onSuccess?: () => void;
}

const ContactForm = ({ children, contact, onSuccess }: ContactFormProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { addContact, updateContact } = useAppContext();

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: contact?.name || "",
      email: contact?.email || "",
      phone: contact?.phone || "",
      company: contact?.company || "",
      position: contact?.position || "",
      notes: contact?.notes || "",
      linkedin_url: contact?.linkedin_url || "",
      last_contact_date: contact?.last_contact_date || "",
    },
  });

  const handleSubmit = async (data: ContactFormData) => {
    try {
      setLoading(true);
      
      const contactData = {
        name: data.name,
        email: data.email || null,
        phone: data.phone || null,
        company: data.company || null,
        position: data.position || null,
        notes: data.notes || null,
        linkedin_url: data.linkedin_url || null,
        last_contact_date: data.last_contact_date || null,
        avatar_url: null,
      };

      if (contact) {
        await updateContact(contact.id, contactData);
      } else {
        await addContact(contactData);
      }
      
      form.reset();
      setOpen(false);
      onSuccess?.();
      
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 gap-2">
            <Plus className="h-4 w-4" />
            Nouveau contact
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Users className="h-5 w-5 text-purple-600" />
            {contact ? "Modifier le contact" : "Ajouter un nouveau contact"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nom complet *</Label>
            <Input
              id="name"
              placeholder="Ex: Marie Dupont"
              {...form.register('name')}
            />
            {form.formState.errors.name && (
              <p className="text-sm text-red-600">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="marie.dupont@entreprise.com"
                {...form.register('email')}
              />
              {form.formState.errors.email && (
                <p className="text-sm text-red-600">{form.formState.errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+33 6 12 34 56 78"
                {...form.register('phone')}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company">Entreprise</Label>
              <Input
                id="company"
                placeholder="Ex: Google"
                {...form.register('company')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Poste</Label>
              <Input
                id="position"
                placeholder="Ex: Responsable RH"
                {...form.register('position')}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="linkedin_url">LinkedIn</Label>
            <Input
              id="linkedin_url"
              type="url"
              placeholder="https://linkedin.com/in/marie-dupont"
              {...form.register('linkedin_url')}
            />
            {form.formState.errors.linkedin_url && (
              <p className="text-sm text-red-600">{form.formState.errors.linkedin_url.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="last_contact_date">Dernier contact</Label>
            <Input
              id="last_contact_date"
              type="date"
              {...form.register('last_contact_date')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Notes sur ce contact..."
              rows={3}
              {...form.register('notes')}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {contact ? "Modification..." : "Création..."}
                </>
              ) : (
                <>
                  <Users className="h-4 w-4 mr-2" />
                  {contact ? "Modifier le contact" : "Ajouter le contact"}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ContactForm;