// components/complete-profile/school-step/create-school-form.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CompleteProfileData } from "@/app/auth/complete-profile/page";

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
    .optional()
    .or(z.string().length(6, "Le code doit contenir 6 caractères")),
});

type CreateSchoolFormData = z.infer<typeof createSchoolSchema>;

interface CreateSchoolFormProps {
  onSuccess: (value: CompleteProfileData) => void;
  onCancel?: () => void;
}

export function CreateSchoolForm({
  onSuccess,
  onCancel,
}: CreateSchoolFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    watch,
  } = useForm<CreateSchoolFormData>({
    resolver: zodResolver(createSchoolSchema),
    mode: "onChange",
  });

  const nameValue = watch("name");

  const generateSchoolCode = () => {
    // Générer un code basé sur le nom + timestamp
    const initials =
      nameValue
        ?.split(" ")
        .map((word) => word.charAt(0))
        .join("")
        .toUpperCase()
        .substring(0, 3) || "SCH";

    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `${initials}${random}`;
  };

  const onSubmit = async (data: CreateSchoolFormData) => {
    // Si pas de code fourni, on en génère un
    const finalData = {
      ...data,
      code: data.code || generateSchoolCode(),
    };

    onSuccess({ newSchool: finalData });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        {/* Nom de l'école */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1">
            Nom de l'école *
          </label>
          <input
            id="name"
            type="text"
            {...register("name")}
            placeholder="Ex: Groupe Scolaire Les Champions"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Adresse */}
        <div>
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700 mb-1">
            Adresse complète *
          </label>
          <textarea
            id="address"
            rows={3}
            {...register("address")}
            placeholder="Ex: Quartier Hippodrome, Rue 234, Bamako, Mali"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
          {errors.address && (
            <p className="text-red-500 text-sm mt-1">
              {errors.address.message}
            </p>
          )}
        </div>

        {/* Code de l'école */}
        <div>
          <label
            htmlFor="code"
            className="block text-sm font-medium text-gray-700 mb-1">
            Code de l'école
            <span className="text-gray-500 text-sm font-normal ml-1">
              (optionnel - généré automatiquement si vide)
            </span>
          </label>
          <input
            id="code"
            type="text"
            {...register("code")}
            placeholder="Ex: CHAMP24"
            maxLength={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
          />
          {errors.code && (
            <p className="text-red-500 text-sm mt-1">{errors.code.message}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Code suggéré: {generateSchoolCode()}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500">
            Annuler
          </button>
        )}
        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          className="flex-1 px-4 py-2 text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
          {isSubmitting ? "Création..." : "Créer l'école"}
        </button>
      </div>

      {/* Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <h4 className="text-sm font-medium text-blue-800 mb-1">
          💡 Information importante
        </h4>
        <p className="text-sm text-blue-700">
          En créant une école, vous en devenez automatiquement l'administrateur.
          Vous pourrez inviter d'autres personnes (professeurs, élèves, parents)
          par la suite.
        </p>
      </div>
    </form>
  );
}
