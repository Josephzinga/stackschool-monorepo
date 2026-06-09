'use client';
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileStep = ProfileStep;
const react_1 = require("react");
const ui_1 = require("@stackschool/ui");
const select_1 = require("../ui/select");
const sonner_1 = require("sonner");
const react_phone_number_input_1 = __importDefault(require("react-phone-number-input"));
const shared_1 = require("@stackschool/shared");
const field_1 = require("../ui/field");
const input_1 = require("../ui/input");
const button_1 = require("../ui/button");
require("react-phone-number-input/style.css");
const check_profile_field_1 = require("@/lib/check-profile-field");
const profile_upload_1 = require("../profile-upload");
const submit_button_1 = require("@/components/submit-button");
const lucide_react_1 = require("lucide-react");
function ProfileStep() {
    const { user } = (0, ui_1.useUserStore)();
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const [phoneValue, setPhoneValue] = (0, react_1.useState)('');
    const { setCurrentStep, setProfileData, profile } = (0, ui_1.useCompleteProfileStore)();
    const { handleSubmit, register, setValue, setError, clearErrors, watch, control, formState: { errors, isSubmitting }, } = (0, ui_1.useForm)({
        resolver: (0, ui_1.zodResolver)(shared_1.profileSchema),
        defaultValues: {
            firstname: user?.profile?.firstname || profile?.firstname || '',
            lastname: user?.profile?.lastname || profile?.lastname || '',
            phoneNumber: user?.phoneNumber || profile?.phoneNumber || '',
            email: user?.email || profile?.email || '',
            gender: profile?.gender || undefined,
            address: profile?.address || undefined,
            photo: user?.profile?.photo || profile?.photo || undefined,
        },
        mode: 'onBlur',
    });
    const validateField = async (fieldName, value) => {
        if (!value)
            return;
        const safeData = await (0, check_profile_field_1.checkField)(fieldName, value);
        if (safeData?.status === 401) {
            return sonner_1.toast.error(safeData?.message);
        }
        if (!safeData?.valid && safeData?.message) {
            setError(fieldName, {
                type: 'manual',
                message: safeData?.message,
            });
        }
        else {
            clearErrors(fieldName);
        }
    };
    const handleProfile = async (data) => {
        try {
            if (data.email) {
                const emailCheck = await (0, check_profile_field_1.checkField)('email', data.email);
                if (!emailCheck?.valid) {
                    setError('email', { type: 'manual', message: emailCheck?.message });
                    return;
                }
            }
            if (data.phoneNumber) {
                const phoneCheck = await (0, check_profile_field_1.checkField)('phoneNumber', data.phoneNumber);
                if (!phoneCheck?.valid) {
                    setError('phoneNumber', {
                        type: 'manual',
                        message: phoneCheck?.message,
                    });
                    return;
                }
            }
            setProfileData(data);
            setCurrentStep(3);
        }
        catch (error) {
            const { message } = (0, shared_1.parseAxiosError)(error);
            console.error('Erreur sauvegarde profil:', message);
            sonner_1.toast.error(message || 'Erreur lors de la sauvegarde du profil');
        }
    };
    const handlePhoneChange = (value = '') => {
        setPhoneValue(value);
        setValue('phoneNumber', value, { shouldValidate: true });
    };
    const handlePhoneBlur = () => {
        validateField('phoneNumber', phoneValue);
    };
    const handleEmailBlur = (e) => {
        validateField('email', e.target.value);
    };
    const handlePhotoUpload = async (event) => {
        const file = event.target.files?.[0];
        if (!file)
            return;
        if (!file.type.startsWith('image/')) {
            sonner_1.toast.warning('Veuillez sélectionner une image');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            sonner_1.toast.warning("L'image doit faire moins de 5MB");
            return;
        }
        try {
            setIsLoading(true);
            const formData = new FormData();
            formData.append('profilePicture', file);
            const res = await shared_1.api.post('/api/upload/profile-picture', formData);
            const data = res.data;
            if (data.ok) {
                setValue('photo', data.path);
                sonner_1.toast.success(`${res.data.message}` || 'Photo de profil téléchargée avec succès !');
            }
            else {
                throw new Error(data.message);
            }
        }
        catch (error) {
            setIsLoading(false);
            const { message, status, data } = (0, shared_1.parseAxiosError)(error);
            sonner_1.toast.error(message || 'Erreur lors du téléchargement de la photo');
        }
        finally {
            setIsLoading(false);
        }
    };
    return (<div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold ">Votre Profil</h2>
        <p className="text-gray-600">Complétez vos informations personnelles</p>
      </div>

      <div className="w-full flex justify-center items-center">
        <profile_upload_1.UploadProfilePicture onPhotoUpload={handlePhotoUpload} isLoading={isLoading} photo={watch('photo')}/>
      </div>

      <form onSubmit={handleSubmit(handleProfile)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <field_1.Field>
            <field_1.FieldLabel htmlFor="firstname">Prénom</field_1.FieldLabel>
            <input_1.Input icon={lucide_react_1.UserIcon} id="firstname" type="text" {...register('firstname')} aria-invalid={!!errors.firstname} placeholder="Votre prénom" required/>
            <field_1.FieldError>{errors.firstname?.message}</field_1.FieldError>
          </field_1.Field>
          
          <field_1.Field>
            <field_1.FieldLabel htmlFor="lastname">Nom</field_1.FieldLabel>
            <input_1.Input id="lastname" icon={lucide_react_1.User2Icon} type="text" {...register('lastname')} aria-invalid={!!errors.lastname} placeholder="Votre nom de famille" required/>
            <field_1.FieldError>{errors.lastname?.message}</field_1.FieldError>
          </field_1.Field>

          <field_1.Field>
            <field_1.FieldLabel htmlFor="email">Email</field_1.FieldLabel>
            <input_1.Input id="email" icon={lucide_react_1.Mail} type="email" {...register('email')} onBlur={handleEmailBlur} aria-invalid={!!errors.email} placeholder="Votre email"/>
            <field_1.FieldError>{errors.email?.message}</field_1.FieldError>
          </field_1.Field>

          <field_1.Field>
            <field_1.FieldLabel htmlFor="phoneNumber">Numéro de téléphone</field_1.FieldLabel>
            <ui_1.Controller control={control} name="phoneNumber" render={({ field }) => (<react_phone_number_input_1.default id="phoneNumber" international defaultCountry="ML" value={phoneValue} onChange={handlePhoneChange} onBlur={handlePhoneBlur} placeholder="Entrez votre numéro" className="phone-input-custom"/>)}/>
            <field_1.FieldError>{errors.phoneNumber?.message}</field_1.FieldError>
          </field_1.Field>

          
          <field_1.Field>
            <field_1.FieldLabel htmlFor="gender">Genre</field_1.FieldLabel>
            <ui_1.Controller control={control} name="gender" render={({ field }) => (<select_1.Select onValueChange={field.onChange} value={field.value}>
                  <select_1.SelectTrigger aria-invalid={!!errors.gender} className="w-full" id="gender">
                    <select_1.SelectValue placeholder="Sélectionnez votre genre"/>
                  </select_1.SelectTrigger>
                  <select_1.SelectContent>
                    <select_1.SelectGroup>
                      <select_1.SelectLabel>Genre</select_1.SelectLabel>
                      <select_1.SelectItem value="MALE">Homme</select_1.SelectItem>
                      <select_1.SelectItem value="FEMALE">Femme</select_1.SelectItem>
                    </select_1.SelectGroup>
                  </select_1.SelectContent>
                </select_1.Select>)}/>
            <field_1.FieldError>{errors.gender?.message}</field_1.FieldError>
          </field_1.Field>
          <field_1.Field>
            <field_1.FieldLabel htmlFor="address">Adresse</field_1.FieldLabel>
            <input_1.Input {...register('address')} id="address" placeholder="Votre adresse" required icon={lucide_react_1.HomeIcon} aria-invalid={!!errors.address}/>
            <field_1.FieldError errors={[{ message: errors.address?.message }]}/>
          </field_1.Field>
        </div>
        <div className="flex gap-3 pt-4">
          <button_1.Button variant="outline" type="button" onClick={() => setCurrentStep(1)} className="w-1/4">
            ← Retour
          </button_1.Button>
          <submit_button_1.SubmitButton isSubmitting={isSubmitting} className="w-3/4">
            {isSubmitting ? 'sauvegarde...' : 'Continuer →'}
          </submit_button_1.SubmitButton>
        </div>
      </form>
    </div>);
}
//# sourceMappingURL=profile-step.js.map