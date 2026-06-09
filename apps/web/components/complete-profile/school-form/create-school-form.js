"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateSchoolForm = CreateSchoolForm;
const ui_1 = require("@stackschool/ui");
const shared_1 = require("@stackschool/shared");
const input_1 = require("@/components/ui/input");
const field_1 = require("@/components/ui/field");
const button_1 = require("@/components/ui/button");
const textarea_1 = require("@/components/ui/textarea");
const submit_button_1 = require("@/components/submit-button");
const lucide_react_1 = require("lucide-react");
function CreateSchoolForm() {
    const { setSchoolData, school, currentStep, setCurrentStep } = (0, ui_1.useCompleteProfileStore)();
    let safeSchool = {};
    if (school && school?.type === 'create') {
        safeSchool = school;
    }
    const { register, handleSubmit, formState: { errors, isSubmitting }, watch, } = (0, ui_1.useForm)({
        resolver: (0, ui_1.zodResolver)(shared_1.createSchoolSchema),
        mode: 'onBlur',
        defaultValues: {
            name: safeSchool?.newSchool?.name || '',
            address: safeSchool?.newSchool?.address || '',
            code: safeSchool?.newSchool?.code || '',
        },
    });
    const nameValue = watch('name');
    const generateSchoolCode = () => {
        const initials = nameValue
            ?.split(' ')
            .map((word) => word.charAt(0))
            .join('')
            .toUpperCase()
            .substring(0, 3) || 'SCH';
        const random = Math.random().toString(36).substring(2, 5).toUpperCase();
        return `${initials}${random}`;
    };
    const onSubmit = async (data) => {
        const finalData = {
            address: data.address,
            name: data.name,
            imposedRole: 'ADMIN',
            code: data.code || generateSchoolCode(),
        };
        setSchoolData({
            type: 'create',
            newSchool: finalData,
        });
        setCurrentStep(2);
    };
    return (<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-3">
        
        <field_1.Field>
          <field_1.FieldLabel htmlFor="name">Nom de l'école</field_1.FieldLabel>
          <input_1.Input id="name" type="text" icon={lucide_react_1.Building2} {...register('name')} placeholder="Ex: Groupe Scolaire Les Champions" aria-invalid={!!errors.name} aria-describedby={errors.name ? 'name-err' : undefined}/>

          <field_1.FieldError id="name-err">{errors.name?.message}</field_1.FieldError>
        </field_1.Field>

        
        <field_1.Field>
          <field_1.FieldLabel htmlFor="address">Adresse complète</field_1.FieldLabel>
          <textarea_1.Textarea id="address" rows={3} {...register('address')} placeholder="Ex: Quartier Hippodrome, Rue 234, Bamako, Mali" className="w-full resize-none" aria-invalid={!!errors.address} aria-describedby={errors.address ? 'address-err' : undefined}/>
          
        </field_1.Field>

        
        <field_1.Field>
          <field_1.FieldLabel htmlFor="code">
            Code de l'école
            <span className="text-gray-500 text-sm font-normal ml-1">
              (optionnel - généré automatiquement si vide)
            </span>
          </field_1.FieldLabel>
          <input_1.Input id="code" type="text" icon={lucide_react_1.Hash} {...register('code')} placeholder="Ex: CHAMP24" maxLength={6} className="uppercase" aria-invalid={!!errors.code} aria-describedby={errors.code ? 'code-err' : undefined}/>

          <field_1.FieldError id="code-err">{errors.code?.message}</field_1.FieldError>

          <p className="text-xs dark:text-slate-300 text-gray-700 mt-1">
            Code suggéré: {generateSchoolCode()}
          </p>
        </field_1.Field>

        
        <div className="flex gap-3 pt-4">
          <button_1.Button variant="outline" type="button">
            Annuler
          </button_1.Button>

          <submit_button_1.SubmitButton isSubmitting={isSubmitting} className="w-3/4">
            {isSubmitting ? "Crée l'école" : 'Création'}
          </submit_button_1.SubmitButton>
        </div>
      </div>
    </form>);
}
//# sourceMappingURL=create-school-form.js.map