'use client';
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
exports.SchoolSection = SchoolSection;
const grid_form_1 = require("@/components/school/grid-form");
const field_1 = require("@/components/ui/field");
const input_1 = require("@/components/ui/input");
const react_hook_form_1 = require("react-hook-form");
const select_1 = require("@/components/ui/select");
const ui_1 = require("@stackschool/ui");
const react_1 = __importStar(require("react"));
const popover_1 = require("@/components/animate-ui/components/radix/popover");
const button_1 = require("@/components/ui/button");
const lucide_react_1 = require("lucide-react");
const calendar_1 = require("@/components/ui/calendar");
function SchoolSection({ mode }) {
    const [open, setOpen] = (0, react_1.useState)(false);
    const { register, control, setError, clearErrors, formState: { errors }, } = (0, react_hook_form_1.useFormContext)();
    const currentYear = new Date().getFullYear();
    const academicYears = Array.from({ length: currentYear - 2010 + 1 }, (_, i) => `${currentYear - i - 1}-${currentYear - i}`);
    const { data: classesData, isError: isGetClassesError, error: getClassesError, } = (0, ui_1.useGetClassesOptionsQuery)({
        input: {
            limit: 100,
        },
    });
    (0, react_1.useEffect)(() => {
        if (isGetClassesError) {
            setError('classId', {
                message: 'Erreur lors de la récupération des classes',
            });
        }
        else {
            clearErrors('classId');
        }
    }, [isGetClassesError, getClassesError, setError]);
    return (<div className="space-y-4">
      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
        Scolarité
      </h3>
      <grid_form_1.GridForm>
        <field_1.Field>
          <field_1.FieldLabel htmlFor="matricule">Matricule</field_1.FieldLabel>
          <input_1.Input {...register('matricule')} aria-invalid={!!errors.matricule} placeholder="STU-..." id="matricule"/>
          <field_1.FieldError>{errors.matricule?.message}</field_1.FieldError>
        </field_1.Field>
        <field_1.Field>
          <field_1.FieldLabel>Classe</field_1.FieldLabel>
          <react_hook_form_1.Controller control={control} name="classId" render={({ field }) => (<select_1.Select onValueChange={field.onChange} value={field.value}>
                <select_1.SelectTrigger className="h-10!">
                  <select_1.SelectValue placeholder="Sélectionner une classe"/>
                </select_1.SelectTrigger>
                <select_1.SelectContent className="max-h-60">
                  {classesData?.getSchoolClasses.data?.map((cls) => (<select_1.SelectItem key={cls?.id} value={cls?.id}>
                      {cls?.name} {cls?.level}
                    </select_1.SelectItem>))}
                </select_1.SelectContent>
              </select_1.Select>)}/>
          <field_1.FieldError>{errors.classId?.message}</field_1.FieldError>
        </field_1.Field>
      </grid_form_1.GridForm>
      <grid_form_1.GridForm>
        <field_1.Field>
          <field_1.FieldLabel>Année d'inscription</field_1.FieldLabel>
          <react_hook_form_1.Controller control={control} name="enrollmentYear" render={({ field }) => (<select_1.Select onValueChange={field.onChange} value={field.value}>
                <select_1.SelectTrigger className="h-10!">
                  <select_1.SelectValue placeholder="Sélectionner l'année"/>
                </select_1.SelectTrigger>
                <select_1.SelectContent className="max-h-60">
                  {academicYears.map((year) => (<select_1.SelectItem key={year} value={year}>
                      {year}
                    </select_1.SelectItem>))}
                </select_1.SelectContent>
              </select_1.Select>)}/>
        </field_1.Field>
        {mode === 'FULL_EDIT' && (<>
            <field_1.Field>
              <field_1.FieldLabel>Moyen de transport</field_1.FieldLabel>
              <react_hook_form_1.Controller control={control} name="transportMode" render={({ field: { onChange, value } }) => (<select_1.Select onValueChange={onChange} value={value}>
                    <select_1.SelectTrigger>
                      <select_1.SelectValue placeholder="Moto"/>
                    </select_1.SelectTrigger>
                    <select_1.SelectContent>
                      <select_1.SelectItem value="BUS">Bus scolaire</select_1.SelectItem>
                      <select_1.SelectItem value="MOTO">Moto personnel</select_1.SelectItem>
                      <select_1.SelectItem value="TAXI">Taxi</select_1.SelectItem>
                    </select_1.SelectContent>
                  </select_1.Select>)}/>
            </field_1.Field>
            <field_1.Field>
              <field_1.FieldLabel>Date d'inscription</field_1.FieldLabel>
              <react_hook_form_1.Controller control={control} name="enrollmentDate" render={({ field: { onChange, value } }) => (<popover_1.Popover open={open} onOpenChange={setOpen}>
                    <popover_1.PopoverTrigger asChild>
                      <button_1.Button variant="outline" id="date" className="w-full justify-between font-normal h-10" aria-invalid={!!errors.birthDate}>
                        {value
                    ? new Date(value).toLocaleDateString()
                    : 'Sélectionner la date'}
                        <lucide_react_1.Calendar className="ml-2 h-4 w-4 opacity-50"/>
                      </button_1.Button>
                    </popover_1.PopoverTrigger>
                    <popover_1.PopoverContent className="w-auto p-0 bg-accent" align="start">
                      <calendar_1.Calendar mode="single" selected={value ? new Date(value) : undefined} captionLayout="dropdown" startMonth={new Date(1990, 0)} onSelect={(date) => {
                    onChange(date);
                    setOpen(false);
                }}/>
                    </popover_1.PopoverContent>
                  </popover_1.Popover>)}/>
            </field_1.Field>
            <field_1.Field>
              <field_1.FieldLabel>École de provenance</field_1.FieldLabel>
              <input_1.Input {...register('previousSchool')} placeholder="Nom de l'ècole" aria-invalid={!!errors.previousSchool?.message}/>
            </field_1.Field>
            <field_1.Field></field_1.Field>{' '}
          </>)}
      </grid_form_1.GridForm>
    </div>);
}
//# sourceMappingURL=school-section.js.map