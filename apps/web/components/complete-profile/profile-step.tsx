'use client';
import { useState } from 'react';
import {
  Controller,
  useCompleteProfileStore,
  useForm,
  useUserStore,
  zodResolver,
} from '@stackschool/ui';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { toast } from 'sonner';
import PhoneInput from 'react-phone-number-input';
import {
  api,
  authService,
  parseAxiosError,
  profileSchema,
  ProfileType,
} from '@stackschool/shared';
import { Field, FieldError, FieldLabel } from '../ui/field';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import 'react-phone-number-input/style.css';
import { checkField } from '@/lib/check-profile-field';
import { UploadProfilePicture } from '../profile-upload';
import { SubmitButton } from '@/components/submit-button';

export function ProfileStep() {
  const { user } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);

  const [phoneValue, setPhoneValue] = useState<string>('');

  const { setCurrentStep, setProfileData, loadFromRedis, profile } =
    useCompleteProfileStore();

  const [picture, setPicture] = useState<string | null>(
    user?.profile?.photo || profile?.photo || null,
  );

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
      firstname: user?.profile?.firstname || profile?.firstname || '',
      lastname: user?.profile?.lastname || profile?.lastname || '',
      phoneNumber: user?.phoneNumber || profile?.phoneNumber || '',
      email: user?.email || profile?.email || '',
      gender: profile?.gender || undefined,
    },
    mode: 'onBlur',
  });

  const validateField = async (fieldName: keyof ProfileType, value: string) => {
    if (!value) return;
    const { valid, message, status } = await checkField(
      fieldName as string,
      value,
    );

    if (status === 401) {
      return toast.error(message);
    }

    if (!valid && message) {
      setError(fieldName, {
        type: 'manual',
        message: message,
      });
    } else {
      clearErrors(fieldName);
    }
  };
  const handleProfile = async (data: ProfileType) => {
    try {
      if (data.email) {
        const emailCheck = await checkField('email', data.email);
        if (!emailCheck?.valid) {
          setError('email', { type: 'manual', message: emailCheck?.message });
          return;
        }
      }

      if (data.phoneNumber) {
        const phoneCheck = await checkField('phoneNumber', data.phoneNumber);
        if (!phoneCheck?.valid) {
          setError('phoneNumber', {
            type: 'manual',
            message: phoneCheck?.message,
          });
          return;
        }
      }

      const res = await authService.updateProfile(data);
      if (res.ok) {
        setProfileData(data);
        setCurrentStep(3);
      }
    } catch (error) {
      const { message } = parseAxiosError(error);
      console.error('Erreur sauvegarde profil:', message);
      toast.error(message || 'Erreur lors de la sauvegarde du profil');
    }
  };

  // Gestionnaire pour le téléphone
  const handlePhoneChange = (value: string = '') => {
    setPhoneValue(value);
    setValue('phoneNumber', value, { shouldValidate: true });
  };

  // Gestionnaire de blur pour le téléphone
  const handlePhoneBlur = () => {
    validateField('phoneNumber', phoneValue);
  };

  const handleEmailBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    validateField('email', e.target.value);
  };

  const handlePhotoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.warning('Veuillez sélectionner une image');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.warning("L'image doit faire moins de 5MB");
      return;
    }

    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('profilePicture', file);

      const res = await api.post('/upload/profile-picture', formData);

      const data = res.data;

      if (data.ok) {
        setPicture(data.path);
        toast.success(
          `${res.data.message}` || 'Photo de profil téléchargée avec succès !',
        );
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      setIsLoading(false);
      const { message, status, data } = parseAxiosError(error);
      console.error('Erreur upload photo:', error);
      toast.error(data?.errors || 'Erreur lors du téléchargement de la photo');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold ">Votre Profil</h2>
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

      <div className="w-full flex justify-center items-center">
        <UploadProfilePicture
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
              {...register('firstname')}
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
              {...register('lastname')}
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
              {...register('email')}
              onBlur={handleEmailBlur}
              aria-invalid={!!errors.email}
              placeholder="Votre email"
              required
            />
            <FieldError>{errors.email?.message}</FieldError>
          </Field>

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
                  onChange={handlePhoneChange}
                  onBlur={handlePhoneBlur}
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
          <FieldLabel>Genre</FieldLabel>
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
            variant="outline"
            type="button"
            onClick={() => setCurrentStep(1)}
            className="w-1/4"
          >
            ← Retour
          </Button>
          <SubmitButton isSubmitting={isSubmitting} className="w-3/4">
            {isSubmitting ? 'sauvegarde...' : 'Continuer →'}
          </SubmitButton>
        </div>
      </form>
    </div>
  );
}
