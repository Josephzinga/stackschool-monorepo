'use client';
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileSubForm = ProfileSubForm;
require("react-phone-number-input/style.css");
const react_hook_form_1 = require("react-hook-form");
const grid_form_1 = require("@/components/school/grid-form");
const field_1 = require("@/components/ui/field");
const input_1 = require("@/components/ui/input");
const lucide_react_1 = require("lucide-react");
const react_phone_number_input_1 = __importDefault(require("react-phone-number-input"));
const check_profile_field_1 = require("@/lib/check-profile-field");
function ProfileSubForm() {
    const { register, control, formState: { errors }, setError, clearErrors, watch, } = (0, react_hook_form_1.useFormContext)();
    const verifiedField = async (fieldName, value) => {
        if (!value)
            return;
        const safeData = await (0, check_profile_field_1.checkField)(fieldName, value);
        if (!safeData?.valid) {
            setError(fieldName, {
                type: 'onBlur',
                message: safeData?.message,
            });
        }
        else {
            clearErrors(fieldName);
        }
    };
    return (<div className="flex flex-col gap-2 md:gap-4">
      <grid_form_1.GridForm>
        <field_1.Field>
          <field_1.FieldLabel>Prénom</field_1.FieldLabel>
          <input_1.Input {...register('firstname')} aria-invalid={!!errors.firstname} placeholder="Jean" icon={lucide_react_1.User}/>
          <field_1.FieldError>{errors.firstname?.message}</field_1.FieldError>
        </field_1.Field>
        <field_1.Field>
          <field_1.FieldLabel>Nom</field_1.FieldLabel>
          <input_1.Input {...register('lastname')} aria-invalid={!!errors.lastname} placeholder="Dupont" icon={lucide_react_1.User2Icon}/>
          <field_1.FieldError>{errors.lastname?.message}</field_1.FieldError>
        </field_1.Field>
      </grid_form_1.GridForm>
      <grid_form_1.GridForm>
        <field_1.Field>
          <field_1.FieldLabel>Email</field_1.FieldLabel>
          <react_hook_form_1.Controller control={control} name="email" render={({ field }) => (<input_1.Input {...field} type="email" icon={lucide_react_1.Mail} aria-invalid={!!errors.email} placeholder="jean.dupont@ecole.com" onBlur={async (e) => {
                field.onBlur();
                await verifiedField('email', e.target.value);
            }}/>)}/>
          <field_1.FieldError>{errors.email?.message}</field_1.FieldError>
        </field_1.Field>

        <field_1.Field>
          <field_1.FieldLabel>Téléphone</field_1.FieldLabel>
          <react_hook_form_1.Controller control={control} name="phoneNumber" render={({ field }) => (<react_phone_number_input_1.default {...field} international defaultCountry="ML" className="phone-input-custom" onBlur={async (e) => {
                field.onBlur();
                await verifiedField('phoneNumber', watch('phoneNumber'));
            }}/>)}/>
          <field_1.FieldError>{errors.phoneNumber?.message}</field_1.FieldError>
        </field_1.Field>
      </grid_form_1.GridForm>
    </div>);
}
//# sourceMappingURL=profile-sub-form.js.map