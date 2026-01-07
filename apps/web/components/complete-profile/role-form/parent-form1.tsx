import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check, Mail, Phone, Search, User, UserPlus, X } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { api } from '@stackschool/shared';
import { toast } from 'sonner';
import { useCompleteProfileStore } from '@stackschool/ui';
import { SubmitButton } from '@/components/submit-button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

// Type pour un étudiant (résultat de recherche)
interface StudentResult {
  id: string;
  matricule: string;
  firstName: string;
  lastName: string;
  photo?: string;
  className?: string;
}

// Type pour un enfant sélectionné avec métadonnées
interface SelectedChild extends StudentResult {
  relation: 'FATHER' | 'MOTHER' | 'GUARDIAN' | 'OTHER';
  contactPreference: 'PHONE' | 'EMAIL' | 'WHATSAPP';
}

// Schéma pour le formulaire final
const parentChildSchema = z.object({
  studentId: z.string(),
  relation: z.enum(['FATHER', 'MOTHER', 'GUARDIAN', 'OTHER']),
  contactPreference: z.enum(['PHONE', 'EMAIL', 'WHATSAPP']),
});

const parentSchema = z.object({
  children: z
    .array(parentChildSchema)
    .min(1, 'Veuillez sélectionner au moins un enfant.'),
});

type ParentFormData = z.infer<typeof parentSchema>;

export function ParentForm({ onBack }: { onBack: () => void }) {
  const { setRoleData, school } = useCompleteProfileStore();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(500, searchQuery);

  const [searchResults, setSearchResults] = useState<StudentResult[]>([]);
  const [selectedChildren, setSelectedChildren] = useState<SelectedChild[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // État pour la modale de configuration de l'enfant
  const [childToConfigure, setChildToConfigure] =
    useState<StudentResult | null>(null);
  const [tempRelation, setTempRelation] = useState<string>('FATHER');
  const [tempContact, setTempContact] = useState<string>('PHONE');

  const {
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<ParentFormData>({
    resolver: zodResolver(parentSchema),
    defaultValues: {
      children: [],
    },
  });

  // Effectuer la recherche quand la query change
  useEffect(() => {
    const searchStudents = async () => {
      if (!debouncedQuery || debouncedQuery.length < 2) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        // On passe schoolId pour sécuriser la recherche
        const schoolId = school?.type === 'join' ? school.schoolId : null;
        if (!schoolId) return;

        const res = await api.get(
          `/students/search?q=${debouncedQuery}&schoolId=${schoolId}`,
        );
        if (res.data.ok) {
          // Filtrer pour ne pas montrer ceux déjà sélectionnés
          const results = res.data.students.filter(
            (s: StudentResult) =>
              !selectedChildren.some((child) => child.id === s.id),
          );
          setSearchResults(results);
        }
      } catch (error) {
        console.error('Erreur recherche', error);
      } finally {
        setIsSearching(false);
      }
    };

    searchStudents();
  }, [debouncedQuery, selectedChildren, school]);

  const openConfiguration = (student: StudentResult) => {
    setChildToConfigure(student);
    setTempRelation('FATHER');
    setTempContact('PHONE');
  };

  const confirmAddChild = () => {
    if (!childToConfigure) return;

    const newChild: SelectedChild = {
      ...childToConfigure,
      relation: tempRelation as any,
      contactPreference: tempContact as any,
    };

    // Mise à jour optimiste de l'UI (pas d'appel serveur ici, juste état local)
    const newChildren = [...selectedChildren, newChild];
    setSelectedChildren(newChildren);

    // Mise à jour du formulaire pour validation
    setValue(
      'children',
      newChildren.map((c) => ({
        studentId: c.id,
        relation: c.relation,
        contactPreference: c.contactPreference,
      })),
    );

    setSearchResults((prev) =>
      prev.filter((s) => s.id !== childToConfigure.id),
    );
    setChildToConfigure(null);
    setSearchQuery('');
    toast.success(`${newChild.firstName} ajouté !`);
  };

  const handleRemoveChild = (studentId: string) => {
    const newChildren = selectedChildren.filter((c) => c.id !== studentId);
    setSelectedChildren(newChildren);
    setValue(
      'children',
      newChildren.map((c) => ({
        studentId: c.id,
        relation: c.relation,
        contactPreference: c.contactPreference,
      })),
    );
  };

  const onSubmit = async (data: ParentFormData) => {
    try {
      setRoleData({ role: 'PARENT', parent: data });
      toast.success('Enfants enregistrés avec succès !');
      // Ici on pourrait passer à l'étape suivante
    } catch (e) {
      toast.error("Erreur lors de l'enregistrement");
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Ajouter vos enfants</h3>
        <p className="text-sm text-muted-foreground">
          Recherchez vos enfants par leur nom ou matricule pour les lier à votre
          compte.
        </p>
      </div>

      {/* Zone de recherche */}
      <div className="relative">
        <Input
          placeholder="Rechercher par nom ou matricule..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          icon={Search}
          className="pl-10"
        />
        {isSearching && (
          <div className="absolute right-3 top-2.5 text-xs text-muted-foreground">
            Recherche...
          </div>
        )}
      </div>

      {/* Résultats de recherche */}
      {searchResults.length > 0 && (
        <div className="border rounded-md divide-y bg-white dark:bg-slate-900 shadow-sm max-h-60 overflow-y-auto">
          {searchResults.map((student) => (
            <div
              key={student.id}
              className="p-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
              onClick={() => openConfiguration(student)}
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={student.photo} />
                  <AvatarFallback>
                    {student.firstName[0]}
                    {student.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">
                    {student.firstName} {student.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Matricule: {student.matricule}
                  </p>
                </div>
              </div>
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                <UserPlus className="h-4 w-4 text-primary" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Liste des enfants sélectionnés */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium flex items-center gap-2">
          <User className="h-4 w-4" />
          Enfants sélectionnés ({selectedChildren.length})
        </h4>

        {selectedChildren.length === 0 ? (
          <div className="text-center p-6 border-2 border-dashed rounded-lg text-muted-foreground text-sm">
            Aucun enfant sélectionné. Utilisez la recherche ci-dessus.
          </div>
        ) : (
          <div className="grid gap-2">
            {selectedChildren.map((child) => (
              <Card
                key={child.id}
                className="p-3 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                    {child.firstName[0]}
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      {child.firstName} {child.lastName}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border">
                        {child.relation === 'FATHER'
                          ? 'Père'
                          : child.relation === 'MOTHER'
                            ? 'Mère'
                            : 'Tuteur'}
                      </span>
                      <span className="flex items-center gap-1">
                        {child.contactPreference === 'PHONE' ? (
                          <Phone className="h-3 w-3" />
                        ) : (
                          <Mail className="h-3 w-3" />
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                  onClick={() => handleRemoveChild(child.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </Card>
            ))}
          </div>
        )}
        {errors.children && (
          <p className="text-sm text-destructive">{errors.children.message}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-4 pt-4">
        <Button variant="outline" onClick={onBack} type="button">
          ← Retour
        </Button>
        <SubmitButton
          isSubmitting={isSubmitting}
          onClick={handleSubmit(onSubmit)}
          className="flex-1"
          disabled={selectedChildren.length === 0}
        >
          <Check className="mr-2 h-4 w-4" />
          Confirmer la sélection
        </SubmitButton>
      </div>

      {/* Modale de configuration */}
      <Dialog
        open={!!childToConfigure}
        onOpenChange={(open) => !open && setChildToConfigure(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configurer le lien</DialogTitle>
            <DialogDescription>
              Précisez votre relation avec {childToConfigure?.firstName}.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Votre relation</Label>
              <Select value={tempRelation} onValueChange={setTempRelation}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FATHER">Père</SelectItem>
                  <SelectItem value="MOTHER">Mère</SelectItem>
                  <SelectItem value="GUARDIAN">Tuteur légal</SelectItem>
                  <SelectItem value="OTHER">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Préférence de contact</Label>
              <Select value={tempContact} onValueChange={setTempContact}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PHONE">Appel Téléphonique</SelectItem>
                  <SelectItem value="WHATSAPP">WhatsApp</SelectItem>
                  <SelectItem value="EMAIL">Email</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setChildToConfigure(null)}>
              Annuler
            </Button>
            <Button onClick={confirmAddChild}>Ajouter</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
