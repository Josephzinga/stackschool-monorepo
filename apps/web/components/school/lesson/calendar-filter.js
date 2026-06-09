'use client';
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalendarFilter = void 0;
const useLessonFilters_1 = require("./hooks/useLessonFilters");
const lucide_react_1 = require("lucide-react");
const combobox_1 = require("@/components/ui/combobox");
const select_1 = require("@/components/ui/select");
const react_1 = __importDefault(require("react"));
const lesson_store_1 = require("@/store/lesson-store");
const button_1 = require("@/components/ui/button");
const animated_button_group_1 = require("@/components/animated-button-group");
const ui_1 = require("@stackschool/ui");
const shared_1 = require("@stackschool/shared");
const CalendarFilter = ({ onModeChange, }) => {
    const { uniqueDepartments, uniqueSections, uniqueLevels, classData, teacherData, resourceMode, setSelectedFilter, hasActiveAdvancedFilters, } = (0, useLessonFilters_1.useLessonFilters)();
    const { showFilters, toggleShowFilters, advancedFilters, setAdvancedFilter, clearAdvancedFilters, resetFilters, } = (0, lesson_store_1.useLessonStore)();
    const handleClearInput = () => {
        setSelectedFilter(null);
        resetFilters();
    };
    return (<div className="flex flex-col gap-3 px-2 py-2">
      
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <animated_button_group_1.AnimatedButtonGroup gap={8} className="flex justify-between" direction="horizontal">
          <button_1.Button className={`px-3  text-sm h-8 rounded-md transition-all duration-200 ${resourceMode === 'CLASS'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`} onClick={() => onModeChange(ui_1.ResourceMode.Class)}>
            Classes
          </button_1.Button>
          <button_1.Button className={`px-3 text-xs sm:text-sm h-8 rounded-md transition-all duration-200 ${resourceMode === 'TEACHER'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`} onClick={() => onModeChange(ui_1.ResourceMode.Teacher)}>
            Enseignants
          </button_1.Button>
        </animated_button_group_1.AnimatedButtonGroup>

        <div className="flex-1 w-full sm:min-w-50">
          {resourceMode === 'CLASS' ? (<combobox_1.Combobox items={classData || []} onValueChange={(name) => {
                const found = classData?.find((c) => c.name === name);
                if (found?.id)
                    setSelectedFilter({ type: 'CLASS', id: found.id });
            }} itemToStringValue={(item) => item?.name || ''}>
              <combobox_1.ComboboxInput placeholder="Sélectionner une classe" showClear onClear={() => handleClearInput()} className=" sm:max-w-90"/>
              <combobox_1.ComboboxContent>
                <combobox_1.ComboboxEmpty>Aucune classe</combobox_1.ComboboxEmpty>
                <combobox_1.ComboboxList>
                  {(item) => (<combobox_1.ComboboxItem key={item.id} value={item.name}>
                      {item.name}
                    </combobox_1.ComboboxItem>)}
                </combobox_1.ComboboxList>
              </combobox_1.ComboboxContent>
            </combobox_1.Combobox>) : (<combobox_1.Combobox items={teacherData || []} onValueChange={(fullName) => {
                const found = teacherData?.find((t) => `${t?.user?.profile?.firstname} ${t?.user?.profile?.lastname}` ===
                    fullName);
                if (found?.id)
                    setSelectedFilter({ type: 'TEACHER', id: found.id });
            }} itemToStringValue={(item) => item
                ? `${item?.user?.profile.firstname} ${item?.user?.profile?.lastname}`
                : ''}>
              <combobox_1.ComboboxInput placeholder="Sélectionner un enseignant" showClear onClear={() => setSelectedFilter(null)} className="max-w-90"/>
              <combobox_1.ComboboxContent>
                <combobox_1.ComboboxEmpty>Aucun enseignant</combobox_1.ComboboxEmpty>
                <combobox_1.ComboboxList>
                  {(item) => (<combobox_1.ComboboxItem key={item.id} value={`${item.user.profile.firstname} ${item.user.profile.lastname}`}>
                      {item.user.profile.firstname} {item.user.profile.lastname}
                    </combobox_1.ComboboxItem>)}
                </combobox_1.ComboboxList>
              </combobox_1.ComboboxContent>
            </combobox_1.Combobox>)}
        </div>

        <button_1.Button variant={hasActiveAdvancedFilters ? 'secondary' : 'outline'} onClick={toggleShowFilters} className="gap-1" size="sm">
          <lucide_react_1.Filter className="h-3.5 w-3.5"/>
          <span className="hidden sm:inline">Filtres avancés</span>
          {hasActiveAdvancedFilters && (<span className="ml-1 h-2 w-2 rounded-full bg-primary"/>)}
        </button_1.Button>
      </div>

      
      {showFilters && (<div className="flex gap-2">
          <div className="flex flex-wrap gap-3 items-center w-full">
            {resourceMode === 'CLASS' ? (<>
                <select_1.Select value={advancedFilters.level} onValueChange={(v) => setAdvancedFilter('level', v)}>
                  <select_1.SelectTrigger className="w-[160px] h-8">
                    <select_1.SelectValue placeholder="Niveau"/>
                  </select_1.SelectTrigger>
                  <select_1.SelectContent>
                    {uniqueLevels.map((level) => (<select_1.SelectItem key={level} value={level}>
                        {level}
                      </select_1.SelectItem>))}
                  </select_1.SelectContent>
                </select_1.Select>

                <select_1.Select value={advancedFilters.section} onValueChange={(v) => setAdvancedFilter('section', v)}>
                  <select_1.SelectTrigger className="w-[140px] h-8">
                    <select_1.SelectValue placeholder="Section"/>
                  </select_1.SelectTrigger>
                  <select_1.SelectContent>
                    {uniqueSections.map((section) => (<select_1.SelectItem key={section} value={section}>
                        {section}
                      </select_1.SelectItem>))}
                  </select_1.SelectContent>
                </select_1.Select>
              </>) : (<select_1.Select value={advancedFilters.department} onValueChange={(v) => setAdvancedFilter('department', v)}>
                <select_1.SelectTrigger className="w-[180px] h-8">
                  <select_1.SelectValue placeholder="Département"/>
                </select_1.SelectTrigger>
                <select_1.SelectContent>
                  {uniqueDepartments.map((dept) => (<select_1.SelectItem key={dept} value={dept}>
                      {dept}
                    </select_1.SelectItem>))}
                </select_1.SelectContent>
              </select_1.Select>)}
            <select_1.Select value={advancedFilters.status} onValueChange={(value) => setAdvancedFilter('status', value)}>
              <select_1.SelectTrigger className="min-w-30">
                <select_1.SelectValue placeholder="Status"/>
              </select_1.SelectTrigger>
              <select_1.SelectContent>
                <select_1.SelectItem value={'ALL'}>Tous les status</select_1.SelectItem>

                <select_1.SelectItem value={ui_1.LessonStatus.Ongoing}>
                  {shared_1.lessonStatusConfig[ui_1.LessonStatus.Ongoing].label}
                </select_1.SelectItem>
                <select_1.SelectItem value={ui_1.LessonStatus.Planned}>
                  {shared_1.lessonStatusConfig[ui_1.LessonStatus.Planned].label}
                </select_1.SelectItem>
                <select_1.SelectItem value={ui_1.LessonStatus.Cancelled}>
                  {shared_1.lessonStatusConfig[ui_1.LessonStatus.Cancelled].label}
                </select_1.SelectItem>
                <select_1.SelectItem value={ui_1.LessonStatus.Postponed}>
                  {shared_1.lessonStatusConfig[ui_1.LessonStatus.Postponed].label}
                </select_1.SelectItem>
                <select_1.SelectItem value={ui_1.LessonStatus.Cancelled}>
                  {shared_1.lessonStatusConfig[ui_1.LessonStatus.Completed].label}
                </select_1.SelectItem>
              </select_1.SelectContent>
            </select_1.Select>
          </div>
          {(advancedFilters.level ||
                advancedFilters.section ||
                advancedFilters.department) && (<button_1.Button variant="ghost" size="sm" onClick={clearAdvancedFilters} className="h-8 px-2">
              <lucide_react_1.X className="h-3 w-3 mr-1"/>
              Effacer
            </button_1.Button>)}
        </div>)}
    </div>);
};
exports.CalendarFilter = CalendarFilter;
//# sourceMappingURL=calendar-filter.js.map