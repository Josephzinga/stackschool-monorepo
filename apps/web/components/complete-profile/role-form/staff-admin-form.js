"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = StaffAdminForm;
const react_1 = __importDefault(require("react"));
const react_hook_form_1 = require("react-hook-form");
const ui_1 = require("@stackschool/ui");
const lucide_react_1 = require("lucide-react");
const button_1 = require("@/components/ui/button");
const shared_1 = require("@stackschool/shared");
const input_1 = require("@/components/ui/input");
const field_1 = require("@/components/ui/field");
const calendar_1 = require("@/components/ui/calendar");
const popover_1 = require("@/components/ui/popover");
const submit_button_1 = require("@/components/submit-button");
const utils_1 = require("@/lib/utils");
function StaffAdminForm({ role, onSubmit, onBack, isLoading, }) {
    const { role: roleData } = (0, ui_1.useCompleteProfileStore)();
    const isAdmin = role === 'ADMIN';
    const [open, setOpen] = react_1.default.useState(false);
    const { handleSubmit, control, formState: { errors }, } = (0, react_hook_form_1.useForm)({
        resolver: (0, ui_1.zodResolver)(shared_1.StaffFormSchema),
        defaultValues: {
            position: isAdmin
                ? 'Administrateur'
                : roleData?.role === 'STAFF'
                    ? roleData.staff.position
                    : '',
            departement: isAdmin
                ? 'Direction'
                : roleData?.role === 'STAFF'
                    ? roleData.staff.departement
                    : '',
        },
    });
    return (<form onSubmit={handleSubmit(onSubmit)} className="space-y-4 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 gap-6">
        
        <field_1.Field>
          <field_1.FieldLabel className="text-sm font-medium flex items-center gap-2">
            Poste occupé
          </field_1.FieldLabel>
          <react_hook_form_1.Controller control={control} name="position" render={({ field: { value, onChange } }) => (<input_1.Input icon={lucide_react_1.Briefcase} value={value} onChange={onChange} placeholder="Ex: Comptable, Secrétaire, Surveillant..." disabled={isAdmin} className={(0, utils_1.cn)(isAdmin && 'bg-muted')} aria-invalid={!!errors.position}/>)}/>
          {errors.position && (<field_1.FieldError>{errors.position.message}</field_1.FieldError>)}
        </field_1.Field>

        
        <field_1.Field>
          <field_1.FieldLabel>Département</field_1.FieldLabel>
          <react_hook_form_1.Controller name="departement" control={control} render={({ field: { value, onChange } }) => (<input_1.Input aria-invalid={!!errors.departement} value={value} onChange={onChange} icon={lucide_react_1.Briefcase} placeholder="Ex: Finance, Ressources Humaines..." className={isAdmin ? 'bg-muted' : ''} disabled={isAdmin}/>)}/>
          {errors.departement && (<field_1.FieldError>{errors.departement.message}</field_1.FieldError>)}
        </field_1.Field>

        
        <field_1.Field>
          <field_1.FieldLabel className="text-sm font-medium flex items-center gap-2">
            Date d'entrée en fonction
          </field_1.FieldLabel>
          <react_hook_form_1.Controller control={control} name="hireDate" render={({ field: { value, onChange } }) => (<popover_1.Popover onOpenChange={setOpen} open={open}>
                <popover_1.PopoverTrigger asChild>
                  <button_1.Button variant="outline" id="date" className="w-full justify-between font-normal">
                    {value ? value.toLocaleDateString() : 'Sélectionné la date'}
                    <lucide_react_1.Calendar className="ml-2 h-4 w-4 opacity-50"/>
                  </button_1.Button>
                </popover_1.PopoverTrigger>
                <popover_1.PopoverContent>
                  <calendar_1.Calendar mode="single" captionLayout="dropdown" selected={value} onSelect={(date) => {
                onChange(date);
                setOpen(false);
            }}/>
                </popover_1.PopoverContent>
              </popover_1.Popover>)}/>
        </field_1.Field>
        <div className="flex gap-3 pt-4">
          <button_1.Button type="button" variant="outline" onClick={onBack} className="flex-1">
            Retour
          </button_1.Button>
          <submit_button_1.SubmitButton isSubmitting={isLoading}>
            {isLoading ? 'Enregistrement...' : 'Terminer mon profil'}
          </submit_button_1.SubmitButton>
        </div>
      </div>
    </form>);
}
//# sourceMappingURL=staff-admin-form.js.map