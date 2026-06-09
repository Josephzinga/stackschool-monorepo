"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FamilySection = void 0;
const react_hook_form_1 = require("react-hook-form");
const field_1 = require("@/components/ui/field");
const input_1 = require("@/components/ui/input");
const select_1 = require("@/components/ui/select");
const button_1 = require("@/components/ui/button");
const react_phone_number_input_1 = __importDefault(require("react-phone-number-input"));
require("react-phone-number-input/style.css");
const react_1 = __importDefault(require("react"));
const ui_1 = require("@stackschool/ui");
const FamilySection = ({ parentsData, }) => {
    const { register, control, setValue, formState: { errors }, } = (0, react_hook_form_1.useFormContext)();
    const mode = (0, react_hook_form_1.useWatch)({
        control,
        name: 'parentData.mode',
        defaultValue: 'CONNECT',
    });
    return (<div className="mt-6 p-4 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl">
      <h3 className="text-lg font-semibold mb-4 text-slate-700">
        Information du Parent / Tuteur
      </h3>

      <div className="flex gap-4 mb-4">
        <button_1.Button type="button" onClick={() => setValue('parentData.mode', 'CONNECT')} variant={mode === 'CONNECT' ? 'secondary' : 'outline'}>
          Parent existant
        </button_1.Button>
        <button_1.Button type="button" onClick={() => setValue('parentData.mode', 'CREATE')} variant={mode === 'CREATE' ? 'secondary' : 'outline'}>
          Nouveaux parent
        </button_1.Button>
      </div>

      {mode === 'CONNECT' ? (<field_1.Field>
          <field_1.FieldLabel className="block text-sm font-medium mb-1">
            Rechercher un parent (Nom ou Téléphone)
          </field_1.FieldLabel>
          <select_1.Select>
            <select_1.SelectTrigger>
              <select_1.SelectValue placeholder="Sélectionner un parent..."/>
            </select_1.SelectTrigger>
            <select_1.SelectContent></select_1.SelectContent>
          </select_1.Select>
        </field_1.Field>) : (<div className="grid grid-cols-2 gap-4">
          <field_1.Field>
            <field_1.FieldLabel htmlFor="parent-firstname">Prènom</field_1.FieldLabel>
            <input_1.Input {...register('parentData.newParent.firstname')} placeholder="Prénom du parent" id="parent-firstname" aria-invalid={!!errors.parentData?.newParent?.firstname}/>
            <field_1.FieldError>
              {errors.parentData?.newParent?.firstname?.message}
            </field_1.FieldError>
          </field_1.Field>
          <field_1.Field>
            <field_1.FieldLabel htmlFor="parent-lastname">Nom</field_1.FieldLabel>
            <input_1.Input {...register('parentData.newParent.lastname')} placeholder="Nom du parent" id="parent-lastname" aria-invalid={!!errors.parentData?.newParent?.lastname}/>

            <field_1.FieldError>
              {errors.parentData?.newParent?.lastname?.message}
            </field_1.FieldError>
          </field_1.Field>
          <field_1.Field>
            <field_1.FieldLabel htmlFor="parent-phoneNumber">
              Numéro de téléphone
            </field_1.FieldLabel>
            <react_hook_form_1.Controller control={control} name="parentData.newParent.phoneNumber" render={({ field }) => (<react_phone_number_input_1.default id="phoneNumber" international defaultCountry="ML" {...field} className="phone-input-custom h-10! rounded-lg!" type="phoneNumber" placeholder="+223 XXXXXXXX"/>)}/>

            <field_1.FieldError>
              {errors.parentData?.newParent?.phoneNumber?.message}
            </field_1.FieldError>
          </field_1.Field>
          <field_1.Field>
            <field_1.FieldLabel htmlFor="parent-address">Address</field_1.FieldLabel>
            <input_1.Input id="parent-address" {...register('parentData.newParent.address')} aria-invalid={!!errors.parentData?.newParent?.address}/>
            <field_1.FieldError>
              {errors.parentData?.newParent?.address?.message}
            </field_1.FieldError>
          </field_1.Field>
          <field_1.Field>
            <field_1.FieldLabel htmlFor="relation">Type de relation</field_1.FieldLabel>
            <react_hook_form_1.Controller control={control} name="parentData.newParent.relationType" render={({ field: { onChange, value } }) => (<select_1.Select name="relation" value={value} onValueChange={onChange}>
                  <select_1.SelectTrigger className="h-10!">
                    <select_1.SelectValue placeholder="Selectionner voutre relation"/>
                  </select_1.SelectTrigger>
                  <select_1.SelectContent>
                    {ui_1.relationItems.map((r) => (<select_1.SelectItem key={r.value} value={r.value}>
                        {r.label}
                      </select_1.SelectItem>))}
                  </select_1.SelectContent>
                </select_1.Select>)}/>
          </field_1.Field>
          <field_1.Field>
            <field_1.FieldLabel htmlFor="parent-profession">Profession</field_1.FieldLabel>
            <input_1.Input id="parent-profession" {...register('parentData.newParent.profession')} placeholder="Eletricien" aria-invalid={!!errors.parentData?.newParent?.profession}/>
            <field_1.FieldError>
              {errors.parentData?.newParent?.profession?.message}
            </field_1.FieldError>
          </field_1.Field>
        </div>)}
    </div>);
};
exports.FamilySection = FamilySection;
//# sourceMappingURL=family-section.js.map