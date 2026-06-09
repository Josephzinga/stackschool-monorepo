"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParentForm = ParentForm;
const react_1 = __importStar(require("react"));
const react_hook_form_1 = require("react-hook-form");
const ui_1 = require("@stackschool/ui");
const input_1 = require("@/components/ui/input");
const button_1 = require("@/components/ui/button");
const lucide_react_1 = require("lucide-react");
const useDebounce_1 = require("@/hooks/useDebounce");
const shared_1 = require("@stackschool/shared");
const sonner_1 = require("sonner");
const submit_button_1 = require("@/components/submit-button");
const avatar_1 = require("@/components/ui/avatar");
const select_1 = require("@/components/ui/select");
const dialog_1 = require("@/components/ui/dialog");
const field_1 = require("@/components/ui/field");
const badge_1 = require("@/components/ui/badge");
const search_results_list_1 = require("@/components/search-results-list");
const search_input_1 = require("@/components/search-input");
function ParentForm({ onBack }) {
    const { setRoleData, school, setCurrentStep, role } = (0, ui_1.useCompleteProfileStore)();
    const [searchQuery, setSearchQuery] = (0, react_1.useState)('');
    const debouncedQuery = (0, useDebounce_1.useDebounce)(searchQuery, 400);
    const parentData = role?.role === 'PARENT' ? role.parent : null;
    const [childToConfigure, setChildToConfigure] = (0, react_1.useState)(null);
    const [tempRelation, setTempRelation] = (0, react_1.useState)('FATHER');
    const { handleSubmit, register, control, formState: { isSubmitting, errors }, } = (0, react_hook_form_1.useForm)({
        resolver: (0, ui_1.zodResolver)(shared_1.parentFormSchema),
        defaultValues: {
            children: parentData?.children || [],
            contactPreference: parentData?.contactPreference || 'PHONE',
            profession: parentData?.profession || '',
        },
        mode: 'onBlur',
    });
    const { fields, append, remove } = (0, ui_1.useFieldArray)({
        control,
        name: 'children',
    });
    const schoolId = school?.type === 'join' ? school.schoolSelected.id : null;
    if (!schoolId)
        return;
    const { data, isLoading, error } = (0, ui_1.useSearchStudentQuery)({
        input: {
            schoolId,
            searchTerm: debouncedQuery?.trim(),
        },
    }, {
        enabled: !!debouncedQuery && debouncedQuery.length >= 2,
    });
    const filteredResults = (0, react_1.useMemo)(() => {
        const { message } = (0, shared_1.parseAxiosError)(error);
        if (!data?.searchStudent) {
            return [];
        }
        if (!isLoading && error) {
            sonner_1.toast.error(message || 'Erreur reseaux');
            return [];
        }
        return data.searchStudent.filter((s) => !fields?.some((child) => child.id === s?.id));
    }, [data, fields, error]);
    const openConfiguration = (student) => {
        setChildToConfigure(student);
    };
    const confirmAddChild = () => {
        if (!childToConfigure)
            return;
        append({
            id: childToConfigure.id,
            relation: childToConfigure.matricule,
            firstname: childToConfigure.user?.profile?.firstname,
            lastname: childToConfigure?.user?.profile?.lastname,
            photo: childToConfigure.user?.profile?.photo ?? undefined,
            relation: tempRelation,
        });
        setChildToConfigure(null);
        setSearchQuery('');
        sonner_1.toast.success(`${childToConfigure?.user?.profile?.firstname} ajouté !`);
    };
    const relationSelected = (childRelation) => {
        const relation = ui_1.relationItems.filter((r) => r.value === childRelation);
        return relation.length > 0 ? relation[0].label : '';
    };
    const onSubmit = async (data) => {
        try {
            setRoleData({ role: 'PARENT', parent: data });
            setCurrentStep(4);
            sonner_1.toast.success('Enfants enregistrés avec succès !');
        }
        catch (e) {
            sonner_1.toast.error("Erreur lors de l'enregistrement");
        }
    };
    return (<div className="space-y-4 h-full">
      <div className="space-y-2 font-poppins">
        <h3 className="text-lg font-medium font-inter">Ajouter vos enfants</h3>
        <p className="text-sm text-muted-foreground font-inter">
          Recherchez vos enfants par leur nom ou matricule pour les lier à votre
          compte.
        </p>
      </div>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
        <field_1.Field>
          <field_1.FieldLabel htmlFor="profession">Profession</field_1.FieldLabel>
          <input_1.Input id="profession" {...register('profession')} aria-invalid={!!errors.profession}/>
          <field_1.FieldError errors={[{ message: errors.profession?.message }]}/>
        </field_1.Field>
        
        <field_1.Field className=" font-inter">
          <field_1.FieldLabel className="font-inter" htmlFor="contactPreference">
            Préférence de contact
          </field_1.FieldLabel>
          <ui_1.Controller name="contactPreference" control={control} render={({ field: { value, onChange } }) => (<select_1.Select value={value} name="contactPreference" onValueChange={onChange}>
                <select_1.SelectTrigger name="contactPreference" className="w-full h-15">
                  <select_1.SelectValue placeholder="WhatsApp"/>
                </select_1.SelectTrigger>
                <select_1.SelectContent>
                  <select_1.SelectItem value="PHONE">Appel Téléphonique</select_1.SelectItem>
                  <select_1.SelectItem value="WHATSAPP">WhatsApp</select_1.SelectItem>
                  <select_1.SelectItem value="EMAIL">Email</select_1.SelectItem>
                </select_1.SelectContent>
              </select_1.Select>)}/>
        </field_1.Field>
      </div>

      
      <div className="relative space-y-3">
        <search_input_1.SearchInput isLoading={isLoading} onClear={() => setSearchQuery('')} placeholder="Rechercher par nom ou matricule..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>

        
        {searchQuery.length >= 2 && (<search_results_list_1.SearchResultsList items={filteredResults} onSelect={openConfiguration} renderItem={(student) => (<div className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <avatar_1.Avatar className="h-10 w-10">
                    <avatar_1.AvatarImage src={`/images/${student.user?.profile?.photo ?? undefined}`}/>
                    <avatar_1.AvatarFallback>
                      {student.user?.profile?.firstname[0]}
                      {student?.user?.profile?.lastname[0]}
                    </avatar_1.AvatarFallback>
                  </avatar_1.Avatar>
                  <div>
                    <p className="font-medium text-sm">
                      {student.user?.profile?.firstname}{' '}
                      {student?.user?.profile?.lastname}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Matricule: {student.matricule}
                    </p>
                  </div>
                </div>
                <button_1.Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                  <lucide_react_1.UserPlus className="h-4 w-4 text-primary"/>
                </button_1.Button>
              </div>)}/>)}
      </div>
      
      <div className="space-y-3">
        <h4 className="text-sm font-medium flex items-center gap-2">
          <lucide_react_1.User className="h-4 w-4"/>
          Enfants sélectionnés ({fields?.length})
        </h4>
        {fields?.length === 0 ? (<div className="text-center p-6 border-2 border-dashed rounded-lg text-muted-foreground text-sm">
            Aucun enfant sélectionné. Utilisez la recherche ci-dessus.
          </div>) : (<>
            {fields?.map((field, index) => {
                return (<div key={field.id} className=" flex justify-center min-h-15 border-border border rounded-md py-2 bg-slate-50 dark:bg-slate-800/50">
                  <div className="w-full flex px-3 justify-between">
                    <div className="flex items-center gap-4">
                      <avatar_1.Avatar className="h-8 w-8">
                        <avatar_1.AvatarImage src={`/images/${field.photo}`}/>
                        <avatar_1.AvatarFallback className=" bg-primary/10 text-primary font-bold text-sm font-jost ">
                          {field.firstname[0]}
                          {field.lastname[0]}
                        </avatar_1.AvatarFallback>
                      </avatar_1.Avatar>
                      <p className="font-medium text-sm font-inter">
                        {field.firstname} {field.lastname}
                      </p>
                    </div>

                    <div className="flex items-center  gap-5 text-xs text-muted-foreground">
                      <badge_1.Badge variant="outline">
                        {relationSelected(field.relation)}
                      </badge_1.Badge>
                    </div>
                  </div>

                  <button_1.Button size="sm" variant="ghost" className="h-8 w-8 p-0 mr-4 text-muted-foreground hover:text-destructive" onClick={() => remove(index)}>
                    <lucide_react_1.X className="h-4 w-4"/>
                  </button_1.Button>
                </div>);
            })}
          </>)}

        <field_1.FieldError errors={[{ message: errors.children?.message }]}/>
      </div>

      
      <div className="flex gap-4 pt-4 items-end">
        <button_1.Button variant="outline" onClick={onBack} type="button">
          ← Retour
        </button_1.Button>
        <submit_button_1.SubmitButton isSubmitting={isSubmitting} className="flex-1" disabled={fields.length === 0} onClick={handleSubmit(onSubmit, (err) => {
            console.log('Error', err);
        })}>
          <lucide_react_1.Check className="mr-2 h-4 w-4"/>
          Confirmer la sélection
        </submit_button_1.SubmitButton>
      </div>

      
      <dialog_1.Dialog open={!!childToConfigure} onOpenChange={(open) => !open && setChildToConfigure(null)}>
        <dialog_1.DialogContent className="w-90">
          <dialog_1.DialogHeader className="flex items-center justify-between font-poppins">
            <dialog_1.DialogTitle>Configurer le lien</dialog_1.DialogTitle>
            <dialog_1.DialogDescription>
              Précisez votre relation avec{' '}
              <span className="font-semibold">
                {childToConfigure?.user?.profile?.firstname}.
              </span>
            </dialog_1.DialogDescription>
          </dialog_1.DialogHeader>

          <div className="grid gap-4 py-4">
            <field_1.Field>
              <field_1.FieldLabel htmlFor="relation">Votre relation</field_1.FieldLabel>
              <select_1.Select name="relation" value={tempRelation} onValueChange={setTempRelation}>
                <select_1.SelectTrigger className="w-full">
                  <select_1.SelectValue />
                </select_1.SelectTrigger>
                <select_1.SelectContent>
                  {ui_1.relationItems.map((r) => (<select_1.SelectItem key={r.value} value={r.value}>
                      {r.label}
                    </select_1.SelectItem>))}
                </select_1.SelectContent>
              </select_1.Select>
            </field_1.Field>
          </div>

          <dialog_1.DialogFooter>
            <button_1.Button variant="outline" onClick={() => setChildToConfigure(null)}>
              Annuler
            </button_1.Button>
            <button_1.Button onClick={confirmAddChild}>Ajouter</button_1.Button>
          </dialog_1.DialogFooter>
        </dialog_1.DialogContent>
      </dialog_1.Dialog>
    </div>);
}
//# sourceMappingURL=parent-form.js.map