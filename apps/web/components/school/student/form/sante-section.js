"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SanteSection = SanteSection;
const react_hook_form_1 = require("react-hook-form");
const field_1 = require("@/components/ui/field");
const input_1 = require("@/components/ui/input");
const grid_form_1 = require("@/components/school/grid-form");
function SanteSection() {
    const { register, control, setError, clearErrors, formState: { errors }, } = (0, react_hook_form_1.useFormContext)();
    return (<grid_form_1.GridForm>
      <field_1.Field>
        <field_1.FieldLabel htmlFor="bloodGroup">Groupe de sang</field_1.FieldLabel>
        <input_1.Input id="bloodGroup" {...register('bloodGroup')} aria-invalid={!!errors.bloodGroup}/>
        <field_1.FieldError>{errors.bloodGroup?.message}</field_1.FieldError>
      </field_1.Field>

      <field_1.Field>
        <field_1.FieldLabel htmlFor="allergies">Allergies</field_1.FieldLabel>
        <input_1.Input id="allergies" {...register('allergies')} aria-invalid={!!errors.allergies}/>
        <field_1.FieldError>{errors.allergies?.message}</field_1.FieldError>
      </field_1.Field>
      <field_1.Field>
        <field_1.FieldLabel htmlFor="medicalCondition">Condition Medical</field_1.FieldLabel>
        <input_1.Input id="medicalCondition" {...register('medicalCondition')} aria-invalid={!!errors.medicalCondition}/>
        <field_1.FieldError>{errors.medicalCondition?.message}</field_1.FieldError>
      </field_1.Field>
    </grid_form_1.GridForm>);
}
//# sourceMappingURL=sante-section.js.map