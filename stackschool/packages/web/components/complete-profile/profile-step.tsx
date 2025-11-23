// components/complete-profile/profile-step.tsx
"use client";
import { useState } from "react";
import { UseCompleteProfileStore } from "../../store/complete-profiile-store";
import api from "@/services/api";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectValue,
} from "../ui/select";
import { toast } from "sonner";
import { Controller, useForm } from "react-hook-form";
import PhoneInput from "react-phone-number-input";
import { profileSchema, ProfileType } from "@stackschool/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { useUserStore } from "@/store/user-store";
import "react-phone-number-input/style.css";
import { checkField } from "@/lib/check-profile-filed";
import ProfileUpload from "../profile-upload";
export function ProfileStep() {
  const { user } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);
  const [picture, setPicture] = useState<string | null>(
    user?.profile?.photo || null
  );
  const [phoneValue, setPhoneValue] = useState<string>("");

  const { setCurrentStep, setProfileData } = UseCompleteProfileStore();

  const {
    handleSubmit,
    register,
    setValue,
    setError,
    clearErrors,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ProfileType>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstname: user?.profile?.firstname || "",
      lastname: user?.profile?.lastname || "",
      phoneNumber: user?.phoneNumber || "",
      email: user?.email || "",
      gender: undefined,
    },
    mode: "onBlur",
  });

  console.log(user);

  // Fonction de validation améliorée
  const validateField = async (fieldName: keyof ProfileType, value: string) => {
    if (!value) return;

    try {
      const { valid, message, field } = await checkField(
        fieldName as string,
        value
      );

      if (!valid && message) {
        setError(fieldName, {
          type: "manual",
          message: message,
        });
      } else {
        clearErrors(fieldName);
      }
    } catch (error) {
      console.error(`Validation error for ${fieldName}:`, error);
    }
  };

  const handleProfile = async (data: ProfileType) => {
    try {
      // Validation finale avant soumission
      if (data.email) {
        const emailCheck = await checkField("email", data.email);
        if (!emailCheck.valid) {
          setError("email", { type: "manual", message: emailCheck.message });
          return;
        }
      }

      if (data.phoneNumber) {
        const phoneCheck = await checkField("phoneNumber", data.phoneNumber);
        if (!phoneCheck.valid) {
          setError("phoneNumber", {
            type: "manual",
            message: phoneCheck.message,
          });
          return;
        }
      }

      const res = await api.put("/profile", data);

      if (res.data?.ok) {
        setProfileData(data);
        setCurrentStep(3);
      } else {
        throw new Error(res.data?.message || "Erreur inconnue");
      }
    } catch (error) {
      console.error("Erreur sauvegarde profil:", error);
      toast.error("Erreur lors de la sauvegarde du profil");
    }
  };

  // Gestionnaire pour le téléphone
  const handlePhoneChange = (value: string = "") => {
    setPhoneValue(value);
    setValue("phoneNumber", value, { shouldValidate: true });
  };

  // Gestionnaire de blur pour le téléphone
  const handlePhoneBlur = () => {
    validateField("phoneNumber", phoneValue);
  };

  const handleEmailBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    validateField("email", e.target.value);
  };
  const handlePhotoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    console.log(file);

    if (!file.type.startsWith("image/")) {
      toast.warning("Veuillez sélectionner une image");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.warning("L'image doit faire moins de 5MB");
      return;
    }

    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("profilePicture", file);

      const res = await api.post("/upload/profile-picture", formData);

      const data = res.data;

      if (data.ok) {
        //  setFormData(prev => ({ ...prev, photo: data.url }));
        setPicture(data.path);
        toast.success(
          `${res.data.message}` || "Photo de profil téléchargée avec succès !"
        );
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      setIsLoading(false);
      console.error("Erreur upload photo:", error);
      toast.error(
        error.response.data.message ||
          error.response.data.error ||
          "Erreur lors du téléchargement de la photo"
      );
    } finally {
      setIsLoading(false);
    }
  };
  console.log(picture);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Votre Profil</h2>
        <p className="text-gray-600">Complétez vos informations personnelles</p>
      </div>

      {/* Indicateurs OAuth */}
      {1 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-800 mb-2">
            Comptes connectés
          </h3>
          <div className="flex gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"></span>
          </div>
          <p className="text-xs text-blue-600 mt-2">
            Vos informations ont été pré-remplies depuis vos comptes connectés
          </p>
        </div>
      )}
      <div className="flex flex-col items-center space-y-4">
        <ProfileUpload
          onPhotoUpload={handlePhotoUpload}
          isLoading={isLoading}
          photo={picture}
        />
      </div>

      <form onSubmit={handleSubmit(handleProfile)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Prénom */}
          <Field>
            <FieldLabel htmlFor="firstname">Prénom</FieldLabel>
            <Input
              id="firstname"
              type="text"
              {...register("firstname")}
              aria-invalid={!!errors.firstname}
              placeholder="Votre prénom"
              required
            />
            <FieldError>{errors.firstname?.message}</FieldError>
          </Field>
          {/* Nom */}
          <Field>
            <FieldLabel htmlFor="lastname">Nom</FieldLabel>
            <Input
              id="lastname"
              type="text"
              {...register("lastname")}
              aria-invalid={!!errors.lastname}
              placeholder="Votre nom de famille"
              required
            />
            <FieldError>{errors.lastname?.message}</FieldError>
          </Field>

          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              {...register("email")}
              onBlur={handleEmailBlur}
              aria-invalid={!!errors.email}
              placeholder="Votre email"
              required
            />
            <FieldError>{errors.email?.message}</FieldError>
          </Field>
          {/* Numéro de téléphone - CORRIGÉ */}
          <Field>
            <FieldLabel htmlFor="phoneNumber">Numéro de téléphone</FieldLabel>
            <Controller
              control={control}
              name="phoneNumber"
              render={({ field }) => (
                <PhoneInput
                  international
                  defaultCountry="ML"
                  value={phoneValue}
                  onChange={handlePhoneChange} // Utiliser la fonction corrigée
                  onBlur={handlePhoneBlur} // Utiliser la fonction corrigée
                  placeholder="Entrez votre numéro"
                  className="phone-input-custom"
                />
              )}
            />
            <FieldError>{errors.phoneNumber?.message}</FieldError>
          </Field>
        </div>

        {/* Genre */}
        <Field>
          <FieldLabel>Genre *</FieldLabel>
          <Controller
            control={control}
            name="gender"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionnez votre genre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Genre</SelectLabel>
                    <SelectItem value="MALE">Homme</SelectItem>
                    <SelectItem value="FEMALE">Femme</SelectItem>
                    <SelectItem value="OTHER">Autre</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
          <FieldError>{errors.gender?.message}</FieldError>
        </Field>

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            onClick={() => setCurrentStep(1)}
            className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500">
            ← Retour
          </Button>{" "}
          <Button
            type="submit"
            disabled={isSubmitting}
            className=" disabled:opacity-50 disabled:cursor-not-allowed text-white">
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <Spinner className="mr-2" />
                Sauvegarde...
              </span>
            ) : (
              "Continuer →"
            )}
          </Button>
        </div>
      </form>

      <div className="text-center">
        <p className="text-xs text-gray-500">
          Vos informations sont sauvegardées automatiquement à chaque
          modification
        </p>
      </div>
    </div>
  );
}
