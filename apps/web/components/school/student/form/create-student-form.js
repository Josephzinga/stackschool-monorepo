'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateStudentForm = CreateStudentForm;
const react_hook_form_1 = require("react-hook-form");
const sonner_1 = require("sonner");
const submit_button_1 = require("@/components/submit-button");
const ui_1 = require("@stackschool/ui");
const shared_1 = require("@stackschool/shared");
const react_1 = require("react");
const react_query_1 = require("@tanstack/react-query");
const utils_1 = require("@/lib/utils");
const zod_1 = require("@hookform/resolvers/zod");
const identite_section_1 = require("@/components/school/student/form/identite-section");
const school_section_1 = require("@/components/school/student/form/school-section");
const family_section_1 = require("@/components/school/student/form/family-section");
const sante_section_1 = require("@/components/school/student/form/sante-section");
function CreateStudentForm({ onSuccess, initialValues, mode = 'QUICK_ADD', }) {
    const { currentSchool } = (0, ui_1.useUserStore)();
    const [open, setOpen] = (0, react_1.useState)(false);
    const currentYear = new Date().getFullYear();
    const queryClient = (0, react_query_1.useQueryClient)();
    const methods = (0, react_hook_form_1.useForm)({
        resolver: (0, zod_1.zodResolver)(shared_1.createStudentSchema),
        mode: 'onBlur',
        defaultValues: {
            enrollmentYear: initialValues?.enrollmentYear || `${currentYear - 1}-${currentYear}`,
            enrollmentDate: initialValues?.enrollmentDate || undefined,
            firstname: initialValues?.user?.profile?.firstname || '',
            lastname: initialValues?.user?.profile?.lastname || '',
            email: initialValues?.user?.isActive
                ? initialValues?.user?.email || ''
                : '',
            phoneNumber: initialValues?.user?.phoneNumber || '',
            nationality: initialValues?.nationality || 'Malienne',
            classId: initialValues?.schoolClass?.id || '',
            birthDate: initialValues?.birthDate
                ? new Date(initialValues?.birthDate)
                : undefined,
            birthPlace: initialValues?.birthPlace || '',
            gender: initialValues?.user?.profile?.gender || 'MALE',
            address: initialValues?.user?.profile?.address || '',
            matricule: initialValues?.matricule || '',
            birthCertificateNumber: initialValues?.birthCertificateNumber || '',
            studentNumber: initialValues?.studentNumber ?? undefined,
            bloodGroup: initialValues?.bloodGroup || '',
            previousSchool: initialValues?.previousSchool ?? '',
            previousClass: initialValues?.previousClass || '',
            allergies: initialValues?.allergies || '',
            parentData: {
                mode: 'CONNECT',
                parentId: initialValues?.parentStudent?.map((p) => p?.parent?.id)[0],
            },
        },
    });
    const { handleSubmit, setValue, watch, reset, formState: { errors, isSubmitting, isDirty }, } = methods;
    const firstname = watch('firstname');
    const lastname = watch('lastname');
    (0, react_1.useEffect)(() => {
        reset({
            enrollmentYear: initialValues?.enrollmentYear || `${currentYear - 1}-${currentYear}`,
            enrollmentDate: initialValues?.enrollmentDate || undefined,
            firstname: initialValues?.user?.profile?.firstname || '',
            lastname: initialValues?.user?.profile?.lastname || '',
            email: initialValues?.user?.isActive
                ? initialValues?.user?.email || ''
                : '',
            phoneNumber: initialValues?.user?.phoneNumber || '',
            nationality: initialValues?.nationality || 'Malienne',
            classId: initialValues?.schoolClass?.id || '',
            birthDate: initialValues?.birthDate
                ? new Date(initialValues?.birthDate)
                : undefined,
            birthPlace: initialValues?.birthPlace || '',
            gender: initialValues?.user?.profile?.gender || 'MALE',
            matricule: initialValues?.matricule || '',
            birthCertificateNumber: initialValues?.birthCertificateNumber || '',
            studentNumber: initialValues?.studentNumber ?? undefined,
            bloodGroup: initialValues?.bloodGroup || '',
            previousSchool: initialValues?.previousSchool ?? '',
            previousClass: initialValues?.previousClass || '',
            allergies: initialValues?.allergies || '',
            parentData: {
                mode: 'CONNECT',
                parentId: initialValues?.parentStudent?.map((p) => p?.parent?.id)[0],
            },
        });
    }, [initialValues]);
    const { mutateAsync: createMutateAsync } = (0, ui_1.useCreateListStudentMutation)({
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['GetSchoolStudents'] });
            if (onSuccess) {
                onSuccess();
            }
        },
    });
    const { mutateAsync: updateMutateAsync } = (0, ui_1.useUpdateStudentMutation)({
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['GetSchoolStudents'] });
            await queryClient.invalidateQueries({ queryKey: ['GetStudentDetails'] });
        },
    });
    (0, react_1.useEffect)(() => {
        if (!initialValues && firstname && lastname) {
            const matricule = (0, shared_1.generateStudentMatricule)(firstname, lastname);
            setValue('matricule', matricule);
        }
    }, [firstname, lastname, setValue, initialValues]);
    const onSubmit = async (formData) => {
        const promise = initialValues
            ? updateMutateAsync({
                data: {
                    ...formData,
                    gender: formData.gender,
                    status: formData?.status,
                    transportMode: formData?.transportMode,
                    parentData: {
                        ...formData?.parentData,
                        mode: formData?.parentData?.mode,
                    },
                },
                schoolId: currentSchool?.id,
                studentId: initialValues?.id,
            })
            : createMutateAsync({
                schoolId: currentSchool?.id,
                data: {
                    ...formData,
                    gender: formData.gender,
                },
            });
        console.log('StudentData', formData);
        sonner_1.toast.promise(promise, {
            loading: initialValues
                ? 'Mise à jour en cours...'
                : 'Création en cours...',
            error: (error) => {
                return error?.message || "Erreur lors de l'opération";
            },
            success: (data) => {
                const response = initialValues
                    ? data.updateStudent
                    : data.createListStudent;
                if (response?.ok) {
                    return response.message || 'Opération réussie';
                }
                return 'Opération terminée';
            },
            toasterId: 'dashboard',
        });
        if (onSuccess) {
            onSuccess();
        }
    };
    return (<react_hook_form_1.FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit, (err) => {
            console.log('Error', err);
        })} className="space-y-6">
        <identite_section_1.IdentiteSection mode={mode}/>
        <school_section_1.SchoolSection mode={mode}/>

        {mode === 'FULL_EDIT' && (<family_section_1.FamilySection parentsData={initialValues?.parentStudent?.map((ps) => ps?.parent) || []}/>)}
        {mode === 'FULL_EDIT' && <sante_section_1.SanteSection />}
        <div className="flex justify-end pt-4">
          <submit_button_1.SubmitButton className={(0, utils_1.cn)('w-50 font-semibold', !isDirty && 'cursor-not-allowed')} disabled={isSubmitting || !isDirty} isSubmitting={isSubmitting}>
            {initialValues ? 'Modifier' : "Créer l'élève"}
          </submit_button_1.SubmitButton>
        </div>
      </form>
    </react_hook_form_1.FormProvider>);
}
//# sourceMappingURL=create-student-form.js.map