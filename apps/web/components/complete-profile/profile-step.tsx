'use client';
import {useState} from 'react';
import {Controller, useCompleteProfileStore, useForm, useUserStore, zodResolver,} from '@stackschool/ui';
import {Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue,} from '../ui/select';
import {toast} from 'sonner';
import PhoneInput from 'react-phone-number-input';
import {api, parseAxiosError, ProfileFormType, profileSchema,} from '@stackschool/contracts';
import {Field, FieldError, FieldLabel} from '../ui/field';
import {Input} from '../ui/input';
import {Button} from '../ui/button';
import 'react-phone-number-input/style.css';
import {checkField} from '@/lib/check-profile-field';
import {UploadProfilePicture} from '../profile-upload';
import {SubmitButton} from '@/components/submit-button';
import {HomeIcon, Mail, User2Icon, UserIcon} from 'lucide-react';

export function ProfileStep() {
  const { user } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);

  const [phoneValue, setPhoneValue] = useState<string>('');

  const { setCurrentStep, setProfileData, profile } = useCompleteProfileStore();

  const {
    handleSubmit,
    register,
    setValue,
    setError,
    clearErrors,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormType>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.profile?.firstName || profile?.firstName || '',
      lastName: user?.profile?.lastName || profile?.lastName || '',
      phoneNumber: user?.phoneNumber ||  '',
      email: user?.email || profile?.email || '',
      gender: profile?.gender || undefined,
      address: profile?.address || undefined,
      avatarUrl: user?.profile?.avatarUrl || profile?.avatarUrl || undefined,
    },
    mode: 'onBlur',
  });

  const validateField = async (fieldName: keyof ProfileFormType, value: string) => {
    if (!value) return;
    if (
      (fieldName &&
        fieldName == 'phoneNumber' &&
        value.toLocaleLowerCase() == user?.phoneNumber) ||
      (fieldName &&
        fieldName == 'email' &&
        value.toLocaleLowerCase() == user?.email)
    )
      return;

    const safeData = await checkField(fieldName as string, value);

    if (safeData?.status === 401) {
      return toast.error(safeData?.message);
    }

    if (!safeData?.valid && safeData?.message) {
      setError(fieldName, {
        type: 'manual',
        message: safeData?.message,
      });
    } else {
      clearErrors(fieldName);
    }
  };
  const handleProfile = async (data: ProfileFormType) => {
    try {
      setProfileData(data);
      setCurrentStep(3);
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

  const handleUpload = async (
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
      formData.append('file', file);

      const res = await api.post('/api/upload/temp', formData);

      const data = res.data;

      if (data.success) {
        setValue('avatarUrl', data.avatarUrl);
        toast.success(
          `${res.data.message}` || 'Photo de profil téléchargée avec succès !',
        );
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      setIsLoading(false);
      const { message, status, data } = parseAxiosError(error);
      toast.error(message || 'Erreur lors du téléchargement de la photo');
    } finally {
      setIsLoading(false);
    }
  };
console.log("AvatarUrl: ", watch('avatarUrl'))
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold ">Votre Profil</h2>
        <p className="text-gray-600">Complétez vos informations personnelles</p>
      </div>

      <div className="w-full flex justify-center items-center">
        <UploadProfilePicture
          onPhotoUpload={handleUpload}
          isLoading={isLoading}
          photo={watch('avatarUrl')}
        />
      </div>

      <form onSubmit={handleSubmit(handleProfile)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Prénom */}
          <Field>
            <FieldLabel htmlFor="firstName">Prénom</FieldLabel>
            <Input
              icon={UserIcon}
              id="firstName"
              type="text"
              {...register('firstName')}
              aria-invalid={!!errors.firstName}
              placeholder="Votre prénom"
              required
            />
            <FieldError>{errors.firstName?.message}</FieldError>
          </Field>
          {/* Nom */}
          <Field>
            <FieldLabel htmlFor="lastname">Nom</FieldLabel>
            <Input
              id="lastname"
              icon={User2Icon}
              type="text"
              {...register('lastName')}
              aria-invalid={!!errors.lastName}
              placeholder="Votre nom de famille"
              required
            />
            <FieldError>{errors.lastName?.message}</FieldError>
          </Field>

          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              icon={Mail}
              type="email"
              {...register('email')}
              onBlur={handleEmailBlur}
              aria-invalid={!!errors.email}
              placeholder="Votre email"
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
                  id="phoneNumber"
                  international
                  defaultCountry="ML"
                  value={phoneValue}
                  onChange={handlePhoneChange}
                  onBlur={handlePhoneBlur}
                  placeholder="Entrez votre numéro"
                  className="phone-input-custom h-8"
                />
              )}
            />
            <FieldError>{errors.phoneNumber?.message}</FieldError>
          </Field>

          {/* Genre */}
          <Field>
            <FieldLabel htmlFor="gender">Genre</FieldLabel>
            <Controller
              control={control}
              name="gender"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger
                    aria-invalid={!!errors.gender}
                    className="w-full"
                    id="gender"
                    size="sm"
                  >
                    <SelectValue placeholder="Sélectionnez votre genre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Genre</SelectLabel>
                      <SelectItem value="MALE">Homme</SelectItem>
                      <SelectItem value="FEMALE">Femme</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError>{errors.gender?.message}</FieldError>
          </Field>
          <Field>
            <FieldLabel htmlFor="address">Adresse</FieldLabel>
            <Input
              {...register('address')}
              id="address"
              placeholder="Votre adresse"
              required
              icon={HomeIcon}
              aria-invalid={!!errors.address}
            />
            <FieldError errors={[{ message: errors.address?.message }]} />
          </Field>
        </div>
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
