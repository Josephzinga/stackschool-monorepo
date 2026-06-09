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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdentiteSection = IdentiteSection;
const react_1 = __importStar(require("react"));
const grid_form_1 = require("@/components/school/grid-form");
const field_1 = require("@/components/ui/field");
const input_1 = require("@/components/ui/input");
const lucide_react_1 = require("lucide-react");
const react_hook_form_1 = require("react-hook-form");
require("react-phone-number-input/style.css");
const popover_1 = require("@/components/animate-ui/components/radix/popover");
const button_1 = require("@/components/ui/button");
const calendar_1 = require("@/components/ui/calendar");
const select_1 = require("@/components/ui/select");
const react_phone_number_input_1 = __importDefault(require("react-phone-number-input"));
function IdentiteSection({ mode, }) {
    const [open, setOpen] = (0, react_1.useState)(false);
    const { register, control, formState: { errors }, } = (0, react_hook_form_1.useFormContext)();
    return (<div className="space-y-4">
      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
        Identité
      </h3>
      <grid_form_1.GridForm>
        <field_1.Field>
          <field_1.FieldLabel htmlFor="firstname">Prénom</field_1.FieldLabel>
          <input_1.Input {...register('firstname')} icon={lucide_react_1.User} id="firstname" aria-invalid={!!errors.firstname} placeholder="Amadou"/>
          <field_1.FieldError>{errors.firstname?.message}</field_1.FieldError>
        </field_1.Field>
        <field_1.Field>
          <field_1.FieldLabel htmlFor="lastname">Nom</field_1.FieldLabel>
          <input_1.Input {...register('lastname')} id="lastname" icon={lucide_react_1.User2Icon} aria-invalid={!!errors.lastname} placeholder="Diallo"/>
          <field_1.FieldError>{errors.lastname?.message}</field_1.FieldError>
        </field_1.Field>
        {mode === 'FULL_EDIT' && (<>
            <field_1.Field>
              <field_1.FieldLabel htmlFor="email">Email</field_1.FieldLabel>
              <input_1.Input {...register('email')} id="email" aria-invalid={!!errors.email} placeholder="Johndoe@example.com"/>
              <field_1.FieldError>{errors.email?.message}</field_1.FieldError>
            </field_1.Field>
            <field_1.Field>
              <field_1.FieldLabel htmlFor="phoneNumber">Numéro de téléphone</field_1.FieldLabel>
              <react_hook_form_1.Controller control={control} name="phoneNumber" render={({ field }) => (<react_phone_number_input_1.default id="phoneNumber" international defaultCountry="ML" {...field} className="phone-input-custom h-10!" type="phoneNumber" placeholder="+223 xxxxxxx"/>)}/>
            </field_1.Field>
          </>)}
      </grid_form_1.GridForm>

      <grid_form_1.GridForm>
        <field_1.Field>
          <field_1.FieldLabel htmlFor="gender">Sexe</field_1.FieldLabel>
          <react_hook_form_1.Controller control={control} name="gender" render={({ field }) => (<select_1.Select onValueChange={field.onChange} {...field} value={field.value}>
                <select_1.SelectTrigger id="gender" className="h-10!">
                  <select_1.SelectValue placeholder="Sélectionner un genre"/>
                </select_1.SelectTrigger>
                <select_1.SelectContent>
                  <select_1.SelectItem value="MALE">Masculin</select_1.SelectItem>
                  <select_1.SelectItem value="FEMALE">Féminin</select_1.SelectItem>
                </select_1.SelectContent>
              </select_1.Select>)}/>
          <field_1.FieldError>{errors.gender?.message}</field_1.FieldError>
        </field_1.Field>

        {mode === 'FULL_EDIT' && (<>
            <field_1.Field>
              <field_1.FieldLabel>Address</field_1.FieldLabel>
              <input_1.Input {...register('address')} aria-invalid={!!errors.address}/>
              <field_1.FieldError>{errors.address?.message}</field_1.FieldError>
            </field_1.Field>
          </>)}
        <field_1.Field>
          <field_1.FieldLabel htmlFor="nationality">Nationalité</field_1.FieldLabel>
          <input_1.Input id="nationality" aria-invalid={!!errors.nationality} {...register('nationality')}/>
          <field_1.FieldError>{errors.nationality?.message}</field_1.FieldError>
        </field_1.Field>
        <field_1.Field>
          <field_1.FieldLabel htmlFor="birthDate">Date de naissance</field_1.FieldLabel>
          <react_hook_form_1.Controller control={control} name="birthDate" render={({ field: { onChange, value } }) => (<popover_1.Popover open={open} onOpenChange={setOpen}>
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
          <field_1.FieldError>{errors.birthDate?.message}</field_1.FieldError>
        </field_1.Field>
        <field_1.Field>
          <field_1.FieldLabel>Lieu de naissance</field_1.FieldLabel>
          <input_1.Input {...register('birthPlace')} aria-invalid={!!errors.birthPlace} placeholder="Bamako"/>
          <field_1.FieldError>{errors.birthPlace?.message}</field_1.FieldError>
        </field_1.Field>
      </grid_form_1.GridForm>
    </div>);
}
//# sourceMappingURL=identite-section.js.map