import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";

export default function StudentForm({ classes, onSubmit }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StudentData>();

  const currentYear = new Date().getFullYear();
  const academicYears = [
    `${currentYear}-${currentYear + 1}`,
    `${currentYear - 1}-${currentYear}`,
    `${currentYear - 2}-${currentYear - 1}`,
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="matricule">Matricule *</Label>
          <Input
            id="matricule"
            {...register("matricule", { required: "Le matricule est requis" })}
            placeholder="2024-001"
          />
          {errors.matricule && (
            <span className="text-red-500 text-sm">
              {errors.matricule.message}
            </span>
          )}
        </div>

        <div>
          <Label htmlFor="enrollmentYear">Année d'inscription *</Label>
          <Select {...register("enrollmentYear")}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez l'année" />
            </SelectTrigger>
            <SelectContent>
              {academicYears.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="birthDate">Date de naissance *</Label>
        <Input
          id="birthDate"
          type="date"
          {...register("birthDate", {
            required: "La date de naissance est requise",
          })}
        />
      </div>

      {/* Spécificités maliennes */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="birthPlace">Lieu de naissance *</Label>
          <Input
            id="birthPlace"
            {...register("birthPlace", {
              required: "Le lieu de naissance est requis",
            })}
            placeholder="Bamako, Kayes, etc."
          />
        </div>

        <div>
          <Label htmlFor="nationality">Nationalité *</Label>
          <Input
            id="nationality"
            {...register("nationality", {
              required: "La nationalité est requise",
            })}
            defaultValue="Malienne"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="fatherName">Nom du père *</Label>
          <Input
            id="fatherName"
            {...register("fatherName", {
              required: "Le nom du père est requis",
            })}
          />
        </div>

        <div>
          <Label htmlFor="motherName">Nom de la mère *</Label>
          <Input
            id="motherName"
            {...register("motherName", {
              required: "Le nom de la mère est requise",
            })}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="classId">Classe (optionnel)</Label>
        <Select {...register("classId")}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez votre classe" />
          </SelectTrigger>
          <SelectContent>
            {classes.map((classe) => (
              <SelectItem key={classe.id} value={classe.id}>
                {classe.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-full">
        Finaliser l'inscription
      </Button>
    </form>
  );
}
