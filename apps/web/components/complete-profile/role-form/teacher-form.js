'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeacherForm = TeacherForm;
const field_1 = require("@/components/ui/field");
const input_1 = require("@/components/ui/input");
const react_1 = require("react");
const useDebounce_1 = require("@/hooks/useDebounce");
const shared_1 = require("@stackschool/shared");
const ui_1 = require("@stackschool/ui");
const button_1 = require("@/components/ui/button");
const lucide_react_1 = require("lucide-react");
const dialog_1 = require("@/components/ui/dialog");
const label_1 = require("@/components/ui/label");
const checkbox_1 = require("@/components/ui/checkbox");
const card_1 = require("@/components/ui/card");
const badge_1 = require("@/components/ui/badge");
const submit_button_1 = require("@/components/submit-button");
const sonner_1 = require("sonner");
const search_input_1 = require("@/components/search-input");
const search_results_list_1 = require("@/components/search-results-list");
function TeacherForm({ onBack }) {
    const [searchQuery, setSearchQuery] = (0, react_1.useState)('');
    const debouncedSearch = (0, useDebounce_1.useDebounce)(400, searchQuery);
    const { school, setRoleData, setCurrentStep, role } = (0, ui_1.useCompleteProfileStore)();
    const schoolId = school?.type === 'join' ? school.schoolSelected.id : null;
    const [selectedClass, setSelectedClass] = (0, react_1.useState)(null);
    const [tempIsMain, setTempIsMain] = (0, react_1.useState)(false);
    const [tempSubjects, setTempSubjects] = (0, react_1.useState)([]);
    const teacherData = role?.role === 'TEACHER' ? role.teacher : null;
    const { register, handleSubmit, control, formState: { errors, isSubmitting }, } = (0, ui_1.useForm)({
        resolver: (0, ui_1.zodResolver)(shared_1.teacherSchema),
        defaultValues: {
            assignments: teacherData?.assignments || [],
            department: teacherData?.department || '',
            diploma: teacherData?.diploma || '',
        },
    });
    const { data: classes, isLoading } = (0, ui_1.useGetClassesOptionsQuery)({
        input: {
            searchTerm: debouncedSearch,
        },
    }, {
        enabled: !!schoolId && debouncedSearch?.length >= 2,
    });
    const classesData = classes?.getSchoolClasses.data;
    const { fields, append, remove } = (0, ui_1.useFieldArray)({
        control,
        name: 'assignments',
    });
    const openConfiguration = (cls) => {
        setSelectedClass(cls);
        setTempIsMain(false);
        setTempSubjects([]);
    };
    const confirmAddAssignment = () => {
        if (!selectedClass)
            return;
        if (tempSubjects.length === 0) {
            sonner_1.toast.error('Veuillez sélectionner au moins une matière.');
            return;
        }
        const subjectNames = selectedClass.subjects
            .filter((s) => tempSubjects.includes(s.id))
            .map((s) => s.name);
        append({
            classId: selectedClass.id,
            className: selectedClass.name,
            isMainTeacher: tempIsMain,
            subjectIds: tempSubjects,
            subjectNames,
        });
        setSelectedClass(null);
        setSearchQuery('');
    };
    const toggleSubject = (subjectId) => {
        setTempSubjects((prev) => prev.includes(subjectId)
            ? prev.filter((id) => id !== subjectId)
            : [...prev, subjectId]);
    };
    const filteredResults = (0, react_1.useMemo)(() => {
        if (!classesData)
            return [];
        return classesData.filter((cls) => !fields?.some((assignment) => assignment.classId === cls?.id));
    }, [classesData, fields]);
    const onSubmit = async (data) => {
        try {
            setRoleData({ role: 'TEACHER', teacher: data });
            setCurrentStep(4);
            sonner_1.toast.success('Informations enregistrées !');
        }
        catch (e) {
            sonner_1.toast.error("Erreur lors de l'enregistrement");
        }
    };
    return (<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <field_1.Field>
          <field_1.FieldLabel>Diplôme / Qualification</field_1.FieldLabel>
          <input_1.Input {...register('diploma')} placeholder="Ex: CAP, Master, Doctorat..." icon={lucide_react_1.GraduationCap} aria-invalid={!!errors.diploma}/>
          <field_1.FieldError>{errors.diploma?.message}</field_1.FieldError>
        </field_1.Field>
        <field_1.Field>
          <field_1.FieldLabel>Département (Optionnel)</field_1.FieldLabel>
          <input_1.Input {...register('department')} placeholder="Ex: Sciences, Lettres..." icon={lucide_react_1.BookOpen} aria-invalid={!!errors.department}/>
          <field_1.FieldError>{errors.department?.message}</field_1.FieldError>
        </field_1.Field>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Vos Classes</h3>
          <p className="text-sm text-muted-foreground">
            Recherchez et ajoutez les classes dans lesquelles vous enseignez.
          </p>
        </div>

        
        <div className="space-y-4 relative">
          <search_input_1.SearchInput onClear={() => setSearchQuery('')} isLoading={isLoading} placeholder="Rechercher une classe (ex: 6ème A)..." onChange={(e) => setSearchQuery(e.target.value)} value={searchQuery}/>

          
          {searchQuery.length >= 2 && (<search_results_list_1.SearchResultsList items={filteredResults} onSelect={openConfiguration} renderItem={(item) => (<div className="p-3 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm ">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.level} {item.section ? `- ${item.section}` : ''}
                    </p>
                  </div>
                  <button_1.Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <lucide_react_1.UserPlus className="h-4 w-4 text-primary"/>
                  </button_1.Button>
                </div>)}/>)}
        </div>

        
        <div className="grid gap-3">
          {fields?.map((assignment, index) => (<card_1.Card key={assignment.classId} className="py-2 px-4 flex flex-col gap-2 relative bg-slate-100 dark:bg-slate-800">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-lg flex items-center gap-2">
                    {assignment.className}
                    {assignment.isMainTeacher && (<badge_1.Badge variant="secondary" className="text-xs font-inter">
                        Titulaire
                      </badge_1.Badge>)}
                  </h4>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {assignment.subjectNames.map((name) => (<badge_1.Badge key={name} variant="outline" className="text-xs font-normal">
                        {name}
                      </badge_1.Badge>))}
                  </div>
                </div>
                <button_1.Button size="sm" variant="ghost" className="text-muted-foreground hover:text-destructive h-full" onClick={() => remove(index)}>
                  <lucide_react_1.X className="h-4 w-4"/>
                </button_1.Button>
              </div>
            </card_1.Card>))}

          {fields.length === 0 && (<div className="text-center p-8 border-2 border-dashed rounded-lg text-muted-foreground text-sm">
              Aucune classe assignée. Utilisez la recherche pour commencer.
            </div>)}

          <field_1.FieldError>{errors.assignments?.message}</field_1.FieldError>
        </div>
      </div>

      <div className="w-full flex gap-4">
        <button_1.Button onClick={onBack} variant="outline">
          ← Retour
        </button_1.Button>
        <submit_button_1.SubmitButton isSubmitting={isSubmitting} className="w-3/4">
          Enregistrer mes informations
        </submit_button_1.SubmitButton>
      </div>

      
      <dialog_1.Dialog open={!!selectedClass} onOpenChange={(open) => !open && setSelectedClass(null)}>
        <dialog_1.DialogContent className="sm:max-w-106.25">
          <dialog_1.DialogHeader className="font-poppins">
            <dialog_1.DialogTitle>Configurer {selectedClass?.name}</dialog_1.DialogTitle>
            <dialog_1.DialogDescription>
              Quelles matières enseignez-vous dans cette classe ?
            </dialog_1.DialogDescription>
          </dialog_1.DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="flex items-center space-x-2 border p-3 rounded-md">
              <checkbox_1.Checkbox id="mainTeacher" checked={tempIsMain} onCheckedChange={(c) => setTempIsMain(!!c)}/>
              <label_1.Label htmlFor="mainTeacher" className="cursor-pointer">
                Je suis le professeur titulaire (principal)
              </label_1.Label>
            </div>

            <field_1.Field>
              <field_1.FieldLabel>Matières enseignées</field_1.FieldLabel>
              <div className="border rounded-md p-2 max-h-48 overflow-y-auto space-y-2">
                {selectedClass?.subjects?.map((subject, index) => (<div key={subject.id} className="flex items-center space-x-2">
                    <checkbox_1.Checkbox checked={tempSubjects.includes(subject.id)} onCheckedChange={() => toggleSubject(subject.id)}/>

                    <field_1.FieldLabel htmlFor={`subj-${subject.id}`} className="cursor-pointer text-sm font-normal w-full ">
                      {subject.name}
                    </field_1.FieldLabel>
                  </div>))}
                {(!selectedClass?.subjects ||
            selectedClass.subjects.length === 0) && (<p className="text-xs text-muted-foreground text-center py-2">
                    Aucune matière configurée pour cette classe.
                  </p>)}
              </div>
            </field_1.Field>
          </div>

          <dialog_1.DialogFooter>
            <button_1.Button variant="outline" onClick={() => setSelectedClass(null)}>
              Annuler
            </button_1.Button>
            <button_1.Button onClick={confirmAddAssignment} disabled={tempSubjects.length === 0} className="font-poppins font-medium">
              Ajouter la classe
            </button_1.Button>
          </dialog_1.DialogFooter>
        </dialog_1.DialogContent>
      </dialog_1.Dialog>
    </form>);
}
//# sourceMappingURL=teacher-form.js.map