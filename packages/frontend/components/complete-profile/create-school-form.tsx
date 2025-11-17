// components/complete-profile/school-step/create-school-form.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "@stackschool/shared";
import { CompleteProfileData } from "@/app/auth/complete-profile/page";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { UseCompleteProfileStore } from "@/store/complete-profiile-store";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";

// Schéma de validation pour la création d'école
const createSchoolSchema = z.object({
  name: z
    .string()
    .min(3, "Le nom de l'école doit contenir au moins 3 caractères")
    .max(100, "Le nom est trop long"),
  address: z
    .string()
    .min(5, "L'adresse doit être plus précise")
    .max(200, "L'adresse est trop longue"),
  code: z
    .string()

    .or(z.string().length(6, "Le code doit contenir 6 caractères")),
});

type CreateSchoolFormData = z.infer<typeof createSchoolSchema>;

export function CreateSchoolForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    watch,
  } = useForm<CreateSchoolFormData>({
    resolver: zodResolver(createSchoolSchema),
    mode: "onChange",
  });
  const { setSchoolData, currentStep, setCurrentStep } =
    UseCompleteProfileStore();
  const nameValue = watch("name");

  const generateSchoolCode = () => {
    // Générer un code basé sur le nom + timestamp
    const initials =
      nameValue
        ?.split(" ")
        .map((word: string) => word.charAt(0))
        .join("")
        .toUpperCase()
        .substring(0, 3) || "SCH";

    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `${initials}${random}`;
  };

  const onSubmit = async (data: CreateSchoolFormData) => {
    // Si pas de code fourni, on en génère un
    const finalData = {
      address: data.address,
      name: data.name,
      inposedRole: "ADMIN",
      code: data.code || generateSchoolCode(),
    };
    setSchoolData({
      type: "create",
      newSchool: finalData,
    });
    setCurrentStep(Math.min(currentStep + 1, 3));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-3">
        {/* Nom de l'école */}
        <Field>
          <FieldLabel htmlFor="name">Nom de l'école *</FieldLabel>
          <Input
            id="name"
            type="text"
            {...register("name")}
            placeholder="Ex: Groupe Scolaire Les Champions"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-err" : undefined}
          />

          <FieldError id="name-err">{errors.name?.message}</FieldError>
        </Field>

        {/* Adresse */}
        <Field>
          <FieldLabel htmlFor="address">Adresse complète *</FieldLabel>
          <Textarea
            id="address"
            rows={3}
            {...register("address")}
            placeholder="Ex: Quartier Hippodrome, Rue 234, Bamako, Mali"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            aria-invalid={!!errors.address}
            aria-describedby={errors.address ? "address-err" : undefined}
          />

          <FieldError id="address-err">{errors.address?.message}</FieldError>
        </Field>

        {/* Code de l'école */}
        <Field>
          <FieldLabel htmlFor="code">
            Code de l'école
            <span className="text-gray-500 text-sm font-normal ml-1">
              (optionnel - généré automatiquement si vide)
            </span>
          </FieldLabel>
          <Input
            id="code"
            type="text"
            {...register("code")}
            placeholder="Ex: CHAMP24"
            maxLength={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
            aria-invalid={!!errors.code}
            aria-describedby={errors.code ? "code-err" : undefined}
          />

          <FieldError id="code-err">{errors.code?.message}</FieldError>

          <p className="text-xs dark:text-slate-300 text-gray-700 mt-1">
            Code suggéré: {generateSchoolCode()}
          </p>
        </Field>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500">
            Annuler
          </Button>

          <Button
            type="submit"
            disabled={!isValid || isSubmitting}
            className="flex text-white font-semibold disabled:cursor-not-allowed">
            {isSubmitting ? (
              <>
                <Spinner /> Création...
              </>
            ) : (
              "Créer l'école"
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
