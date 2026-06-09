"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchSchoolFrom = void 0;
const field_1 = require("@/components/ui/field");
const item_1 = require("@/components/ui/item");
const avatar_1 = require("@/components/ui/avatar");
const sonner_1 = require("sonner");
const ui_1 = require("@stackschool/ui");
const useDebounce_1 = require("@/hooks/useDebounce");
const react_1 = require("react");
const search_input_1 = require("@/components/search-input");
const button_1 = require("@/components/ui/button");
const lucide_react_1 = require("lucide-react");
const utils_1 = require("@/lib/utils");
const SearchSchoolFrom = () => {
    const { setSchoolData, setCurrentStep, currentStep, school: schoolData, } = (0, ui_1.useCompleteProfileStore)();
    const [searchQuery, setSearchQuery] = (0, react_1.useState)('');
    const searchDebounce = (0, useDebounce_1.useDebounce)(searchQuery.trim(), 400);
    const [schoolSelected, setSchoolSelected] = (0, react_1.useState)(schoolData?.type === 'join' ? schoolData.schoolSelected : null);
    const { data, isLoading, error } = (0, ui_1.useSearchSchoolQuery)({
        input: {
            searchTerm: searchDebounce,
        },
    }, { enabled: searchDebounce?.length >= 2 });
    const handleClick = (school) => {
        if (!school)
            return;
        setSchoolData({
            type: 'join',
            schoolSelected: {
                id: school.id,
                name: school.name,
                code: school.code,
                address: school.address,
                logo: school?.logo,
            },
        });
        setCurrentStep(2);
        sonner_1.toast.success(`vous avez selectionner l'école ${school.name}`);
        console.log('currentStep search-school', currentStep);
    };
    return (<div className="space-y-4 px-2!">
      <field_1.Field className="">
        <field_1.FieldLabel htmlFor="search" className="font-poppins font-meduim text-center text-lg">
          Rechercher une école
        </field_1.FieldLabel>

        <search_input_1.SearchInput id="search" isLoading={isLoading} placeholder="Nom de l'école ou code..." value={searchQuery} onChange={(e) => {
            setSearchQuery(e.target.value);
        }}/>

        {!!data?.searchSchool.length ? (<div className=" w-full mt-1 border rounded-lg bg-slate-50 dark:bg-slate-900 shadow-lg max-h-60 overflow-y-auto overflow-x-hidden">
            {data.searchSchool.map((item) => (<div onClick={() => handleClick(item)} className={(0, utils_1.cn)('flex px-3 py-2 justify-start gap-3 items-center w-full font-poppins', 'cursor-pointer transition-colors hover:bg-slate-200 dark:hover:bg-slate-800', 'border-b last:border-0 border-slate-300 dark:border-slate-800')}>
                <avatar_1.Avatar className="w-12 h-12">
                  <avatar_1.AvatarImage src={`/images/${item.logo}`}/>
                  <avatar_1.AvatarFallback>{item.name[0]}</avatar_1.AvatarFallback>
                </avatar_1.Avatar>
                <div className="flex flex-col gap-1">
                  <item_1.ItemTitle className="font-poppins font-semibold text-foreground">
                    {item.name}
                  </item_1.ItemTitle>
                  <p className="text-sm  ">{item.address}</p>
                  <p className="text-xs text-foreground">Code: {item.code}</p>
                </div>
              </div>))}
          </div>) : searchQuery ? (<div className="text-center p-6 border-2 border-dashed rounded-lg text-muted-foreground text-sm">
            Aucuns resultat
          </div>) : (<div className="text-center p-6 border-2 border-dashed rounded-lg text-muted-foreground text-sm">
            Aucun école sélectionné. Utilisez la recherche ci-dessus.
          </div>)}
      </field_1.Field>

      {schoolSelected && !searchQuery && (<div className="flex flex-col gap-10 w-full">
          <div className="rounded-lg cursor-pointer border w-full! hover:border-blue-500 bg-slate-200 dark:bg-gray-700 p-2 transition-colors px-4">
            <div className="flex justify-end items-center font-inter">
              <div className="flex gap-4 items-center w-full">
                <avatar_1.Avatar className="w-12 h-12">
                  <avatar_1.AvatarImage src={`/images/${schoolSelected.logo}`}/>
                  <avatar_1.AvatarFallback>{schoolSelected.name[0]}</avatar_1.AvatarFallback>
                </avatar_1.Avatar>
                <div className="flex flex-col gap-2">
                  <item_1.ItemTitle className="font-poppins font-semibold text-foreground">
                    {schoolSelected.name}
                  </item_1.ItemTitle>

                  <p className="text-sm  ">{schoolSelected.address}</p>
                  <p className="text-xs text-foreground">
                    Code: {schoolSelected.code}
                  </p>
                </div>
              </div>

              <button_1.Button variant="ghost" onClick={() => setSchoolSelected(null)}>
                <lucide_react_1.X />
              </button_1.Button>
            </div>
          </div>{' '}
          <button_1.Button onClick={() => setCurrentStep(2)}>Continuer →</button_1.Button>
        </div>)}
    </div>);
};
exports.SearchSchoolFrom = SearchSchoolFrom;
//# sourceMappingURL=search-school-from.js.map