'use client';
import { useLessonFilters } from './hooks/useLessonFilters';
import { Filter, X } from 'lucide-react';
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import React from 'react';
import { Button } from '@/components/ui/button';
import { AnimatedButtonGroup } from '@/components/animated-button-group';
import {
  LessonStatus,
  ResourceMode,
  lessonStatusConfig,
  useLessonStore,
} from '@stackschool/ui';
import { LessonStatusEnum } from '@stackschool/contracts';

export const CalendarFilter = ({
  onModeChange,
}: {
  onModeChange: (mode: ResourceMode) => void;
}) => {
  const {
    uniqueDepartments,
    uniqueSections,
    uniqueLevels,
    classData,
    teacherData,
    resourceMode,
    setSelectedFilter,
    hasActiveAdvancedFilters,
  } = useLessonFilters();

  const {
    showFilters,
    toggleShowFilters,
    advancedFilters,
    setAdvancedFilter,
    clearAdvancedFilters,
    resetFilters,
  } = useLessonStore();

  const handleClearInput = () => {
    setSelectedFilter(null);
    resetFilters();
  };

  return (
    <div className="flex flex-col gap-3 px-2 py-2">
      {/* Ligne principale : toggles + combobox + bouton filtres */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <AnimatedButtonGroup
          gap={8}
          className="flex justify-between"
          direction="horizontal"
        >
          <Button
            className={`px-3  text-sm h-8 rounded-md transition-all duration-200 ${
              resourceMode === 'CLASS'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
            onClick={() => onModeChange('CLASS')}
          >
            Classes
          </Button>
          <Button
            className={`px-3 text-xs sm:text-sm h-8 rounded-md transition-all duration-200 ${
              resourceMode === 'TEACHER'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
            onClick={() => onModeChange('TEACHER')}
          >
            Enseignants
          </Button>
        </AnimatedButtonGroup>

        <div className="flex-1 w-full sm:min-w-50">
          {resourceMode === 'CLASS' ? (
            <Combobox
              items={classData || []}
              onValueChange={(name) => {
                const found = classData?.find((c) => c.name === name);
                if (found?.id)
                  setSelectedFilter({ type: 'CLASS', id: found.id });
              }}
              itemToStringValue={(item) => item?.name || ''}
            >
              <ComboboxInput
                placeholder="Sélectionner une classe"
                showClear
                onClear={() => handleClearInput()}
                className=" sm:max-w-90"
              />
              <ComboboxContent>
                <ComboboxEmpty>Aucune classe</ComboboxEmpty>
                <ComboboxList>
                  {(item) => (
                    <ComboboxItem key={item.id} value={item.name}>
                      {item.name}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          ) : (
            <Combobox
              items={teacherData || []}
              onValueChange={(fullName) => {
                const found = teacherData?.find(
                  (t) =>
                    `${t?.schoolProfile?.firstName} ${t?.schoolProfile?.lastName}` ===
                    fullName,
                );
                if (found?.id)
                  setSelectedFilter({ type: 'TEACHER', id: found.id });
              }}
              itemToStringValue={(item) =>
                item
                  ? `${item?.schoolProfile.firstName} ${item?.schoolProfile?.lastName}`
                  : ''
              }
            >
              <ComboboxInput
                placeholder="Sélectionner un enseignant"
                showClear
                onClear={() => setSelectedFilter(null)}
                className="max-w-90"
              />
              <ComboboxContent>
                <ComboboxEmpty>Aucun enseignant</ComboboxEmpty>
                <ComboboxList>
                  {(item) => (
                    <ComboboxItem
                      key={item.id}
                      value={`${item.user.profile.firstname} ${item.user.profile.lastname}`}
                    >
                      {item.user.profile.firstname} {item.user.profile.lastname}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          )}
        </div>

        <Button
          variant={hasActiveAdvancedFilters ? 'secondary' : 'outline'}
          onClick={toggleShowFilters}
          className="gap-1"
          size="sm"
        >
          <Filter className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Filtres avancés</span>
          {hasActiveAdvancedFilters && (
            <span className="ml-1 h-2 w-2 rounded-full bg-primary" />
          )}
        </Button>
      </div>

      {/* Filtres avancés (affichés conditionnellement) */}
      {showFilters && (
        <div className="flex gap-2">
          <div className="flex flex-wrap gap-3 items-center w-full">
            {resourceMode === 'CLASS' ? (
              <>
                <Select
                  value={advancedFilters.level}
                  onValueChange={(v) => setAdvancedFilter('level', v)}
                >
                  <SelectTrigger className="w-[160px] h-8">
                    <SelectValue placeholder="Niveau" />
                  </SelectTrigger>
                  <SelectContent>
                    {uniqueLevels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={advancedFilters.section}
                  onValueChange={(v) => setAdvancedFilter('section', v)}
                >
                  <SelectTrigger className="w-[140px] h-8">
                    <SelectValue placeholder="Section" />
                  </SelectTrigger>
                  <SelectContent>
                    {uniqueSections.map((section) => (
                      <SelectItem key={section} value={section}>
                        {section}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </>
            ) : (
              <Select
                value={advancedFilters.department}
                onValueChange={(v) => setAdvancedFilter('department', v)}
              >
                <SelectTrigger className="w-[180px] h-8">
                  <SelectValue placeholder="Département" />
                </SelectTrigger>
                <SelectContent>
                  {uniqueDepartments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <Select
              value={advancedFilters.status}
              onValueChange={(value) => setAdvancedFilter('status', value)}
            >
              <SelectTrigger className="min-w-30">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={'ALL'}>Tous les status</SelectItem>

                <SelectItem value={LessonStatusEnum.Ongoing}>
                  {lessonStatusConfig[LessonStatusEnum.Ongoing].label}
                </SelectItem>
                <SelectItem value={LessonStatusEnum.Planned}>
                  {lessonStatusConfig[LessonStatusEnum.Planned].label}
                </SelectItem>
                <SelectItem value={LessonStatusEnum.Cancelled}>
                  {lessonStatusConfig[LessonStatusEnum.Cancelled].label}
                </SelectItem>
                <SelectItem value={LessonStatusEnum.Postponed}>
                  {lessonStatusConfig[LessonStatusEnum.Postponed].label}
                </SelectItem>
                <SelectItem value={LessonStatusEnum.Cancelled}>
                  {lessonStatusConfig[LessonStatusEnum.Completed].label}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          {(advancedFilters.level ||
            advancedFilters.section ||
            advancedFilters.department) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAdvancedFilters}
              className="h-8 px-2"
            >
              <X className="h-3 w-3 mr-1" />
              Effacer
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
