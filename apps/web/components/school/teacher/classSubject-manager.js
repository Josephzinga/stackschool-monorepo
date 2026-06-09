'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeacherClassSubjectManager = void 0;
const react_1 = require("react");
const react_hook_form_1 = require("react-hook-form");
const useDebounce_1 = require("@/hooks/useDebounce");
const ui_1 = require("@stackschool/ui");
const button_1 = require("@/components/ui/button");
const badge_1 = require("@/components/ui/badge");
const checkbox_1 = require("@/components/ui/checkbox");
const label_1 = require("@/components/ui/label");
const skeleton_1 = require("@/components/ui/skeleton");
const dialog_1 = require("@/components/ui/dialog");
const command_1 = require("@/components/ui/command");
const collapsible_1 = require("@/components/ui/collapsible");
const button_group_1 = require("@/components/ui/button-group");
const lucide_react_1 = require("lucide-react");
const button_2 = require("@/components/animate-ui/components/buttons/button");
const TeacherClassSubjectManager = ({ name, placeholder = 'Rechercher une classe...', }) => {
    const { control } = (0, react_hook_form_1.useFormContext)();
    const { fields, append, update, remove } = (0, react_hook_form_1.useFieldArray)({
        control,
        name,
    });
    const [searchTerm, setSearchTerm] = (0, react_1.useState)('');
    const [tempSubjectIds, setTempSubjectIds] = (0, react_1.useState)([]);
    const [selectedClass, setSelectedClass] = (0, react_1.useState)();
    const [openCommand, setOpenCommand] = (0, react_1.useState)(false);
    const [openDialog, setOpenDialog] = (0, react_1.useState)(false);
    const [subjectsCache, setSubjectsCache] = (0, react_1.useState)({});
    const debounceSearch = (0, useDebounce_1.useDebounce)(searchTerm, 400);
    const { data: classesData, isPending: searchLoading } = (0, ui_1.useGetClassesOptionsQuery)({
        input: {
            searchTerm: debounceSearch,
            limit: 10,
        },
    });
    const { data: subjectsData, isPending: subjectLoading } = (0, ui_1.useGetSubjectsOptionsQuery)({
        input: {
            classId: selectedClass?.id,
        },
    }, {
        enabled: !!selectedClass?.id,
    });
    (0, react_1.useEffect)(() => {
        if (selectedClass && subjectsData?.getSchoolSubjects?.data) {
            setSubjectsCache((prev) => ({
                ...prev,
                [selectedClass?.id]: {
                    subjects: subjectsData?.getSchoolSubjects?.data || [],
                    fetchedAt: Date.now(),
                },
            }));
        }
    }, [selectedClass?.id, subjectsData]);
    const classes = classesData?.getSchoolClasses?.data;
    const subjects = subjectsData?.getSchoolSubjects?.data;
    const filteredClasses = (0, react_1.useMemo)(() => {
        if (!classes)
            return [];
        const selectedIds = fields.map((f) => f.classId);
        return classes.filter((c) => !selectedIds.includes(c.id));
    }, [classes, fields]);
    (0, react_1.useEffect)(() => {
        if (selectedClass && openDialog) {
            const existing = fields.find((f) => f.classId === selectedClass.id);
            setTempSubjectIds(existing?.subjectIds || []);
        }
    }, [selectedClass, openDialog, fields]);
    const handleSelectItem = (cls) => {
        setSelectedClass(cls);
        setOpenCommand(false);
        setOpenDialog(true);
        setSearchTerm('');
    };
    const handleSaveAssignments = () => {
        if (!selectedClass)
            return;
        if (tempSubjectIds.length === 0) {
            const index = fields.findIndex((f) => f.classId === selectedClass.id);
            if (index !== -1) {
                remove(index);
            }
        }
        else {
            const existingIndex = fields.findIndex((f) => f.classId === selectedClass.id);
            const newAssignment = {
                classId: selectedClass.id,
                subjectIds: tempSubjectIds,
            };
            if (existingIndex !== -1) {
                update(existingIndex, newAssignment);
            }
            else {
                append(newAssignment);
            }
        }
        setOpenDialog(false);
        setSelectedClass(undefined);
        setTempSubjectIds([]);
    };
    const handleEditAssignment = (classId) => {
        const classToEdit = classes?.find((c) => c.id === classId);
        if (classToEdit) {
            setSelectedClass(classToEdit);
            setOpenDialog(true);
        }
    };
    const getSubjectNames = (classId, subjectIds) => {
        if (selectedClass?.id === classId && subjects) {
            return subjectIds
                .map((id) => subjects.find((s) => s.id === id)?.name)
                .filter(Boolean);
        }
        const cached = subjectsCache[classId];
        if (cached) {
            return subjectIds
                .map((id) => cached.subjects.find((s) => s.id === id)?.name)
                .filter(Boolean);
        }
        return subjectIds;
    };
    return (<div className="space-y-4">
      
      <div className="flex flex-wrap gap-2 items-center">
        <button_1.Button onClick={() => setOpenCommand(true)} variant="outline" type="button" className="border-dashed">
          <lucide_react_1.Search className="h-4 w-4 mr-2"/>
          Ajouter une classe
        </button_1.Button>
      </div>

      
      <command_1.CommandDialog open={openCommand} onOpenChange={setOpenCommand}>
        <command_1.Command shouldFilter={false}>
          <command_1.CommandInput placeholder={placeholder} value={searchTerm} onValueChange={setSearchTerm}/>
          <command_1.CommandList className="max-h-60">
            {searchLoading && (<command_1.CommandEmpty>Recherche en cours...</command_1.CommandEmpty>)}
            {!searchLoading && searchTerm.length < 2 && (<command_1.CommandEmpty>Saisissez au moins 2 caractères</command_1.CommandEmpty>)}
            {!searchLoading &&
            filteredClasses.length === 0 &&
            searchTerm.length >= 2 && (<command_1.CommandEmpty>Aucune classe trouvée</command_1.CommandEmpty>)}
            <command_1.CommandGroup heading="Classes">
              {filteredClasses.map((cls) => (<command_1.CommandItem key={cls.id} onSelect={() => handleSelectItem(cls)}>
                  {cls.name}{' '}
                  <span className="text-muted-foreground ml-1">
                    ({cls.level})
                  </span>
                </command_1.CommandItem>))}
            </command_1.CommandGroup>
          </command_1.CommandList>
        </command_1.Command>
      </command_1.CommandDialog>

      
      {fields.length > 0 && (<div className="border rounded-md p-3 space-y-2">
          <p className="text-sm font-medium">Classes assignées :</p>
          <div className="space-y-2">
            {fields.map((field, idx) => {
                const classId = field.classId;
                const subjectIds = field.subjectIds;
                const className = classes?.find((c) => c.id === classId)?.name || classId;
                const subjectNames = getSubjectNames(classId, subjectIds);
                console.log('SubjectNames', subjectNames, subjectIds);
                return (<collapsible_1.Collapsible key={field.id} className="bg-muted/30 rounded-md">
                  <div className="flex justify-between items-center p-2">
                    <collapsible_1.CollapsibleTrigger asChild>
                      <div className="flex items-center gap-2 cursor-pointer">
                        <lucide_react_1.ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180"/>
                        <span className="font-medium text-sm">{className}</span>
                        <badge_1.Badge variant="outline" className="text-xs">
                          {subjectIds.length} matière
                          {subjectIds.length > 1 ? 's' : ''}
                        </badge_1.Badge>
                      </div>
                    </collapsible_1.CollapsibleTrigger>
                    <button_group_1.ButtonGroup className="flex gap-1">
                      <button_1.Button type="button" variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => handleEditAssignment(classId)}>
                        Modifier
                      </button_1.Button>
                      <button_1.Button type="button" variant="ghost" size="sm" className="h-6 w-6 p-0 text-destructive" onClick={() => remove(idx)}>
                        <lucide_react_1.X className="h-3 w-3"/>
                      </button_1.Button>
                    </button_group_1.ButtonGroup>
                  </div>
                  <collapsible_1.CollapsibleContent className="px-2 pb-2">
                    <div className="flex flex-wrap gap-1">
                      {subjectNames.length > 0 ? (subjectNames.map((name) => (<badge_1.Badge key={name} variant="secondary" className="text-xs">
                            {name}
                          </badge_1.Badge>))) : (<span className="text-xs text-muted-foreground">
                          Aucune matière sélectionnée
                        </span>)}
                    </div>
                  </collapsible_1.CollapsibleContent>
                </collapsible_1.Collapsible>);
            })}
          </div>
        </div>)}

      
      <dialog_1.Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <dialog_1.DialogContent className="sm:max-w-md">
          <dialog_1.DialogHeader>
            <dialog_1.DialogTitle>Assigner des matières</dialog_1.DialogTitle>
            <dialog_1.DialogDescription>
              {selectedClass
            ? `Classe : ${selectedClass.name}`
            : 'Sélectionnez les matières enseignées dans cette classe.'}
            </dialog_1.DialogDescription>
          </dialog_1.DialogHeader>

          <div className="py-2">
            {subjectLoading ? (<div className="space-y-2">
                <skeleton_1.Skeleton className="h-4 w-full"/>
                <skeleton_1.Skeleton className="h-4 w-3/4"/>
              </div>) : subjects?.length === 0 ? (<p className="text-sm text-muted-foreground text-center">
                Aucune matière associée à cette classe.
              </p>) : (<div className="space-y-2 max-h-60 overflow-y-auto">
                {subjects?.map((subject) => (<div key={subject.id} className="flex items-center space-x-2">
                    <checkbox_1.Checkbox id={`subject-${subject.id}`} checked={tempSubjectIds.includes(subject.id)} onCheckedChange={(checked) => {
                    if (checked) {
                        setTempSubjectIds((prev) => [...prev, subject.id]);
                    }
                    else {
                        setTempSubjectIds((prev) => prev.filter((id) => id !== subject.id));
                    }
                }}/>
                    <label_1.Label htmlFor={`subject-${subject.id}`} className="text-sm cursor-pointer">
                      {subject.name}
                    </label_1.Label>
                  </div>))}
              </div>)}
          </div>

          <dialog_1.DialogFooter>
            <dialog_1.DialogClose asChild>
              <button_1.Button variant="outline" type="button">
                Annuler
              </button_1.Button>
            </dialog_1.DialogClose>
            <button_2.Button hoverScale={1.02} tapScale={0.95} disabled={tempSubjectIds.length === 0} onClick={handleSaveAssignments} type="button">
              Enregistrer
            </button_2.Button>
          </dialog_1.DialogFooter>
        </dialog_1.DialogContent>
      </dialog_1.Dialog>
    </div>);
};
exports.TeacherClassSubjectManager = TeacherClassSubjectManager;
//# sourceMappingURL=classSubject-manager.js.map