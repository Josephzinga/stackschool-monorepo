'use client';
import { useEffect, useState } from 'react';
import { Plus, Search, Trash2 } from 'lucide-react';
import { api, parseAxiosError } from '@stackschool/shared';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  contactMethods,
  relationTypes,
  useCompleteProfileStore,
} from '@stackschool/ui';
import { SubmitButton } from '@/components/submit-button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface Student {
  id: string;
  matricule: string;
  fullName: string;
}

interface ParentContext {
  school: {
    id: string;
    name: string;
    code: string;
  };
  students: Student[];
  relationTypes: Array<{ value: string; label: string }>;
  contactMethods: Array<{ value: string; label: string; icon: string }>;
}

interface ChildData {
  studentId: string;
  relationType: string;
  requiresVerification?: boolean;
}

interface ParentFormData {
  contactPriority: string;
  children: ChildData[];
}

interface ParentFormProps {
  onSubmit: (data: ParentFormData) => void;
  onBack: () => void;
  isSubmitting: boolean;
}

export function ParentForm({ onBack }: { onBack: () => void }) {
  const [context, setContext] = useState<ParentContext | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<ParentFormData>({
    contactPriority: 'whatsapp',
    children: [{ studentId: '', relationType: 'PERE' }],
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const { isSubmitting } = useCompleteProfileStore();

  const loadParentContext = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/complete-profile/parent/context');
      const data = res.data;

      if (data.ok) {
        setContext(data.context);
        setFilteredStudents(data.context.students);
      }
    } catch (error) {
      const { message } = parseAxiosError(error);
      toast.error(message || 'Erreur de chargement du contexte parent');
      console.error(
        message || 'Erreur de chargement du contexte parent',
        error,
      );
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async () => {
    console.log('onSubmit');
  };

  // Filtrer les étudiants selon la recherche

  useEffect(() => {
    if (!context) return;
    const filtered = context.students.filter(
      (student) =>
        student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.matricule.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredStudents(filtered);
  }, [context, searchTerm]);

  const handleChildChange = (
    index: number,
    field: keyof ChildData,
    value: string | boolean,
  ) => {
    const newChildren = [...formData.children];
    newChildren[index] = { ...newChildren[index], [field]: value };
    setFormData({ ...formData, children: newChildren });
  };

  const addChild = () => {
    setFormData({
      ...formData,
      children: [...formData.children, { studentId: '', relationType: 'PERE' }],
    });
  };

  const removeChild = (index: number) => {
    if (formData.children.length <= 1) return;
    const newChildren = formData.children.filter((_, i) => i !== index);
    setFormData({ ...formData, children: newChildren });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const invalidChild = formData.children.find(
      (child) => !child.studentId || !child.relationType,
    );
    if (invalidChild) {
      toast.error(
        'Veuillez sélectionner un étudiant et un type de relation pour chaque enfant',
      );
      return;
    }

    // Vérifier les doublons
    const studentIds = formData.children.map((child) => child.studentId);
    const hasDuplicates = new Set(studentIds).size !== studentIds.length;
    if (hasDuplicates) {
      toast.error("Un même étudiant ne peut être associé qu'une seule fois");
      return;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!context) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">
          Erreur lors du chargement du contexte
        </p>
        <Button onClick={loadParentContext} className="mt-4 ">
          Réessayer
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec contexte */}
      <div className="bg-foreground border border-border rounded-lg p-4">
        <h2 className="font-semibold text-primary">
          Inscription en tant que parent
        </h2>
        <p className="text-sm text-accent-foreground">
          École: <strong>{context.school.name}</strong>
        </p>
        <p className="text-xs text-blue-500 mt-1">
          {context.students.length} étudiant(s) disponible(s) dans cette école
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Méthode de contact préférée */}
        <Field>
          <FieldLabel className="block text-sm font-medium text-gray-700 mb-2">
            Méthode de contact préférée
          </FieldLabel>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {contactMethods.map((method) => (
              <label>
                <Input
                  type="radio"
                  name="contactPriority"
                  value={method.value}
                  checked={formData.contactPriority === method.value}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contactPriority: e.target.value,
                    })
                  }
                  className="sr-only"
                />
                <span className="text-xl mb-1">{method.icon}</span>
                <span className="text-sm text-center">{method.label}</span>
              </label>
            ))}
          </div>
        </Field>

        {/* Liste des enfants */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <FieldLabel>Enfants à associer</FieldLabel>
            <Button variant="ghost" type="button" onClick={addChild}>
              <Plus className="w-4 h-4 mr-1" />
              Ajouter un enfant
            </Button>
          </div>

          {formData.children.map((child, index) => (
            <div
              key={index}
              className="border border-border rounded-lg p-4 space-y-4"
            >
              <div className="flex justify-between items-center">
                <h4 className="font-medium ">Enfant #{index + 1}</h4>
                {formData.children.length > 1 && (
                  <Button
                    variant="destructive"
                    type="button"
                    onClick={() => removeChild(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>

              {/* Recherche étudiant */}
              <Field>
                <FieldLabel className="block text-sm font-medium text-gray-700 mb-1">
                  Rechercher l'étudiant
                </FieldLabel>
                {
                  <Input
                    icon={Search}
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Matricule ou nom de l'étudiant..."
                  />
                }

                {/* Liste des étudiants filtrés */}
                {searchTerm && filteredStudents.length > 0 && (
                  <div className="mt-2 max-h-40 overflow-y-auto  border border-border rounded-md">
                    {filteredStudents.map((student) => (
                      <div
                        key={student.id}
                        onClick={() =>
                          handleChildChange(index, 'studentId', student.id)
                        }
                        className={`p-2 hover:bg-accent space-y-1 hover:text-accent-foreground dark:hover:bg-accent/50 cursor-pointer first:border-none border-t border-border ${
                          child.studentId === student.id
                            ? 'bg-accent/70 text-accent-foreground'
                            : ''
                        }`}
                      >
                        <div className="font-medium">{student.fullName}</div>
                        <div className="text-xs text-gray-500">
                          {student.matricule}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Étudiant sélectionné */}
                {child.studentId && (
                  <div className="mt-2 p-2 bg-primary/90 rounded-md">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">
                          {
                            context.students.find(
                              (s) => s.id === child.studentId,
                            )?.fullName
                          }
                        </div>
                        <div className="text-xs text-gray-600">
                          {
                            context.students.find(
                              (s) => s.id === child.studentId,
                            )?.matricule
                          }
                        </div>
                      </div>
                      <Button
                        variant={'secondary'}
                        type="button"
                        onClick={() =>
                          handleChildChange(index, 'studentId', '')
                        }
                      >
                        Changer
                      </Button>
                    </div>
                  </div>
                )}
              </Field>

              {/* Type de relation */}
              <Field>
                <FieldLabel className="block text-sm font-medium text-gray-700 mb-1">
                  Type de relation
                </FieldLabel>
                <Select
                  value={child.relationType}
                  onValueChange={(value) =>
                    handleChildChange(index, 'relationType', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                  <SelectContent className="w-full">
                    {relationTypes.map((relation) => (
                      <SelectItem key={relation.value} value={relation.value}>
                        {relation.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              {/* Vérification requise */}
              <div className="flex items-center">
                <Checkbox
                  id={`verification-${index}`}
                  checked={child.requiresVerification || false}
                  onClick={(e) =>
                    handleChildChange(
                      index,
                      'requiresVerification',
                      !child.requiresVerification,
                    )
                  }
                />
                <Label
                  htmlFor={`verification-${index}`}
                  className="ml-2 text-sm text-gray-700"
                >
                  Nécessite vérification par l'étudiant
                </Label>
              </div>
            </div>
          ))}
        </div>

        {/* Information */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-yellow-800 mb-1">
            ⚠️ Information importante
          </h4>
          <p className="text-sm text-yellow-700">
            • L'association avec un étudiant nécessite parfois la validation de
            celui-ci
            <br />
            • Vous recevrez les notifications selon votre méthode de contact
            préférée
            <br />• Vous pouvez associer plusieurs enfants à votre compte
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-6 ">
          <Button
            variant="outline"
            type="button"
            className="w-1/4"
            onClick={onBack}
          >
            ← Retour
          </Button>

          <SubmitButton isSubmitting={isSubmitting} className="w-3/4">
            {isSubmitting ? 'Finalisation...' : "Finaliser l'inscription"}
          </SubmitButton>
        </div>
      </form>
    </div>
  );
}
/*  <button
            type="submit"
            disabled={
              isSubmitting ||
              formData.children.some((child) => !child.studentId)
            }
            className="flex-1 px-4 py-2 text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Finalisation...
              </span>
            ) : (
              "Finaliser l'inscription"
            )}
          </button>*/
