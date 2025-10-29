import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const invitationSchema = z.object({
  invitationCode: z.string().min(1, "Le code d'invitation est requis"),
});

type InvitationFormData = z.infer<typeof invitationSchema>;

export default function InvitationForm({
  onSuccess,
}: {
  onSuccess: (data: { invitationCode: string }) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<InvitationFormData>({
    resolver: zodResolver(invitationSchema),
  });

  const onSubmit = async (data: InvitationFormData) => {
    // On passe le code d'invitation au parent
    onSuccess({ invitationCode: data.invitationCode });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label
          htmlFor="invitationCode"
          className="block text-sm font-medium text-gray-700">
          Code d'invitation *
        </label>
        <input
          id="invitationCode"
          type="text"
          {...register("invitationCode")}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          placeholder="Entrez le code d'invitation"
        />
        {errors.invitationCode && (
          <p className="text-red-500 text-sm">
            {errors.invitationCode.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
        {isSubmitting ? "Vérification..." : "Rejoindre avec l'invitation"}
      </button>
    </form>
  );
}
