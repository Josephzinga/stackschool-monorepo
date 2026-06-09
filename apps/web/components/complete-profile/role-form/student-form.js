"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = StudentForm;
const input_1 = require("@/components/ui/input");
const select_1 = require("@/components/ui/select");
const button_1 = require("@/components/ui/button");
const calendar_1 = require("@/components/ui/calendar");
const ui_1 = require("@stackschool/ui");
const lucide_react_1 = require("lucide-react");
const react_1 = require("react");
const shared_1 = require("@stackschool/shared");
const field_1 = require("@/components/ui/field");
const submit_button_1 = require("@/components/submit-button");
const popover_1 = require("@/components/animate-ui/components/radix/popover");
const sonner_1 = require("sonner");
function StudentForm({ onBack }) {
    const { setRoleData, school, role, setCurrentStep, profile } = (0, ui_1.useCompleteProfileStore)();
    const studentData = role?.role === 'STUDENT' ? role.student : null;
    const { register, handleSubmit, control, formState: { errors, isSubmitting }, } = (0, ui_1.useForm)({
        resolver: (0, ui_1.zodResolver)(shared_1.studentFormSchema),
        mode: 'onBlur',
        defaultValues: {
            birthDate: studentData?.birthDate,
            birthPlace: studentData?.birthPlace || '',
            fatherName: studentData?.fatherName || '',
            motherName: studentData?.motherName || '',
            nationality: studentData?.nationality || 'Malienne',
            matricule: studentData?.matricule ||
                (0, shared_1.generateStudentMatricule)(profile?.firstname, profile?.lastname),
            classId: studentData?.classId || '',
            enrollmentYear: studentData?.enrollmentYear || '',
        },
    });
    const [open, setOpen] = (0, react_1.useState)(false);
    const currentYear = new Date().getFullYear();
    const academicYears = Array.from({ length: currentYear - 2010 + 1 }, (_, i) => `${currentYear - i - 1}-${currentYear - i}`);
    const schoolId = school?.type === 'join' ? school.schoolSelected.id : null;
    const { data, error, isError } = (0, ui_1.useGetClassesOptionsQuery)({
        input: {
            limit: 100,
        },
    }, {
        enabled: !!schoolId,
    });
    if (isError) {
        const { message } = (0, shared_1.parseAxiosError)(error);
        sonner_1.toast.error(message || 'Echec de chargement de classes');
    }
    const onSubmit = async (data) => {
        setRoleData({ role: 'STUDENT', student: data });
        setCurrentStep(4);
    };
    return (<form onSubmit={handleSubmit(onSubmit)} className="space-y-4 font-poppins">
      <div className="grid grid-cols-2 gap-4">
        <field_1.Field>
          <field_1.FieldLabel htmlFor="matricule">Matricule</field_1.FieldLabel>
          <input_1.Input id="matricule" icon={lucide_react_1.IdCard} {...register('matricule')} placeholder="2024-001" aria-invalid={!!errors.matricule}/>
          <field_1.FieldError>{errors.matricule?.message}</field_1.FieldError>
        </field_1.Field>

        <field_1.Field>
          <field_1.FieldLabel htmlFor="enrollmentYear">Année d'inscription</field_1.FieldLabel>
          <ui_1.Controller control={control} name="enrollmentYear" render={({ field }) => (<select_1.Select onValueChange={(year) => field.onChange(year)} value={field.value}>
                <select_1.SelectTrigger>
                  <select_1.SelectValue placeholder="Sélectionner la date"/>
                </select_1.SelectTrigger>
                <select_1.SelectContent>
                  {academicYears.map((year) => (<select_1.SelectItem key={year} value={year}>
                      {year}
                    </select_1.SelectItem>))}
                </select_1.SelectContent>
              </select_1.Select>)}/>
        </field_1.Field>
      </div>

      <field_1.Field>
        <field_1.FieldLabel htmlFor="birthDate">Date de naissance</field_1.FieldLabel>
        <ui_1.Controller name="birthDate" control={control} render={({ field: { onChange, value } }) => (<popover_1.Popover open={open} onOpenChange={setOpen}>
              <popover_1.PopoverTrigger asChild>
                <button_1.Button variant="outline" id="date" className="w-full justify-between font-normal">
                  {value
                ? new Date(value).toLocaleDateString()
                : 'Sélectionné votre date'}
                  <lucide_react_1.Calendar className="ml-2 h-4 w-4 opacity-50"/>
                </button_1.Button>
              </popover_1.PopoverTrigger>
              <popover_1.PopoverContent className="w-auto overflow-hidden p-0" align="start">
                <calendar_1.Calendar mode="single" selected={value} captionLayout="dropdown" onSelect={(date) => {
                onChange(date);
                setOpen(false);
            }}/>
              </popover_1.PopoverContent>
            </popover_1.Popover>)}/>
        <field_1.FieldError errors={[{ message: errors.birthDate?.message }]}/>
      </field_1.Field>

      
      <div className="grid grid-cols-2 gap-4">
        <field_1.Field>
          <field_1.FieldLabel htmlFor="birthPlace">Lieu de naissance</field_1.FieldLabel>
          <input_1.Input id="birthPlace" icon={lucide_react_1.MapPin} {...register('birthPlace')} aria-invalid={!!errors.birthPlace} placeholder="Bamako, Kayes, etc."/>
          <field_1.FieldError>{errors.birthPlace?.message}</field_1.FieldError>
        </field_1.Field>

        <field_1.Field>
          <field_1.FieldLabel htmlFor="nationality">Nationalité</field_1.FieldLabel>
          <input_1.Input id="nationality" icon={lucide_react_1.Flag} {...register('nationality')} aria-invalid={!!errors.nationality}/>
          <field_1.FieldError>{errors.nationality?.message}</field_1.FieldError>
        </field_1.Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <field_1.Field>
          <field_1.FieldLabel htmlFor="fatherName">Nom du père</field_1.FieldLabel>
          <input_1.Input id="fatherName" icon={lucide_react_1.User} {...register('fatherName')} aria-invalid={!!errors.fatherName}/>
          <field_1.FieldError>{errors.fatherName?.message}</field_1.FieldError>
        </field_1.Field>

        <field_1.Field>
          <field_1.FieldLabel htmlFor="motherName">Nom de la mère</field_1.FieldLabel>
          <input_1.Input id="motherName" icon={lucide_react_1.User} required {...register('motherName')} aria-invalid={!!errors.motherName}/>
          <field_1.FieldError>{errors.motherName?.message}</field_1.FieldError>
        </field_1.Field>
      </div>

      <field_1.Field>
        <field_1.FieldLabel htmlFor="classId">Classe</field_1.FieldLabel>
        <ui_1.Controller control={control} name="classId" render={({ field: { onChange, value } }) => (<select_1.Select value={value} onValueChange={onChange}>
              <select_1.SelectTrigger aria-invalid={!!errors.classId}>
                <select_1.SelectValue placeholder="Sélectionnez votre classe"/>
              </select_1.SelectTrigger>
              <select_1.SelectContent className="bg-background">
                {data?.getClassAndSubjects?.map((classe) => (<select_1.SelectItem key={classe?.id} value={classe?.id}>
                    <p className="font-semibold ">{classe?.name}</p>
                    <p>{classe?.section}</p>
                  </select_1.SelectItem>))}
              </select_1.SelectContent>
            </select_1.Select>)}/>
        <field_1.FieldError errors={[{ message: errors.classId?.message }]}/>
      </field_1.Field>

      <div className="w-full flex gap-4">
        <button_1.Button type="button" onClick={onBack} variant="outline">
          ← Retour
        </button_1.Button>
        <submit_button_1.SubmitButton isSubmitting={isSubmitting} className="w-3/4">
          {isSubmitting
            ? 'Finalisation en cours...'
            : "  Finaliser l'inscription"}
        </submit_button_1.SubmitButton>
      </div>
    </form>);
}
//# sourceMappingURL=student-form.js.map