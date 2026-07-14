import { Field, FieldLabel } from '@/components/ui/field';
import { ItemTitle } from '@/components/ui/item';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SchoolSelected } from '@stackschool/contracts';
import { toast } from 'sonner';
import {
  SearchSchoolQuery,
  useCompleteProfileStore,
  useSearchSchoolQuery,
} from '@stackschool/ui';
import { useDebounce } from '@/hooks/useDebounce';
import { useState } from 'react';
import { SearchInput } from '@/components/search-input';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export const SearchSchoolFrom = () => {
  const {
    setSchoolData,
    setCurrentStep,
    currentStep,
    school: schoolData,
  } = useCompleteProfileStore();
  const [searchQuery, setSearchQuery] = useState('');
  const searchDebounce = useDebounce(searchQuery.trim(), 400);
  const [schoolSelected, setSchoolSelected] = useState<SchoolSelected | null>(
    schoolData?.type === 'join' ? schoolData.schoolSelected : null,
  );

  const { data, isLoading, error } = useSearchSchoolQuery(
    {
      input: {
        searchTerm: searchDebounce,
      },
    },
    { enabled: searchDebounce?.length! >= 2 },
  );

  const handleClick = (
    school: NonNullable<SearchSchoolQuery['searchSchool']>[number],
  ) => {
    if (!school) return;
    setSchoolData({
      type: 'join',
      schoolSelected: {
        id: school.id!,
        name: school.name,
        code: school.code!,
        address: school.address,
        logo: school?.logo!,
      },
    });
    setCurrentStep(2);
    toast.success(`vous avez selectionner l'école ${school.name}`);

    console.log('currentStep search-school', currentStep);
  };

  return (
    <div className="space-y-4 px-2!">
      <Field className="">
        <FieldLabel
          htmlFor="search"
          className="font-poppins font-meduim text-center text-lg"
        >
          Rechercher une école
        </FieldLabel>

        <SearchInput
          id="search"
          isLoading={isLoading}
          placeholder="Nom de l'école ou code..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
          }}
        />

        {!!data?.searchSchool?.length ? (
          <div className=" w-full mt-1 border rounded-lg bg-slate-50 dark:bg-slate-900 shadow-lg max-h-60 overflow-y-auto overflow-x-hidden">
            {data.searchSchool.map((item) => (
              <div
                onClick={() => handleClick(item)}
                className={cn(
                  'flex px-3 py-2 justify-start gap-3 items-center w-full font-poppins',
                  'cursor-pointer transition-colors hover:bg-slate-200 dark:hover:bg-slate-800',
                  'border-b last:border-0 border-slate-300 dark:border-slate-800',
                )}
              >
                <Avatar className="w-12 h-12">
                  <AvatarImage src={`/images/${item.logo}`} />
                  <AvatarFallback>{item.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-1">
                  <ItemTitle className="font-poppins font-semibold text-foreground">
                    {item.name}
                  </ItemTitle>
                  <p className="text-sm  ">{item.address}</p>
                  <p className="text-xs text-foreground">Code: {item.code}</p>
                </div>
              </div>
            ))}
          </div>
        ) : searchQuery ? (
          <div className="text-center p-6 border-2 border-dashed rounded-lg text-muted-foreground text-sm">
            Aucuns resultat
          </div>
        ) : (
          <div className="text-center p-6 border-2 border-dashed rounded-lg text-muted-foreground text-sm">
            Aucun école sélectionné. Utilisez la recherche ci-dessus.
          </div>
        )}
      </Field>

      {schoolSelected && !searchQuery && (
        <div className="flex flex-col gap-10 w-full">
          <div className="rounded-lg cursor-pointer border w-full! hover:border-blue-500 bg-slate-200 dark:bg-gray-700 p-2 transition-colors px-4">
            <div className="flex justify-end items-center font-inter">
              <div className="flex gap-4 items-center w-full">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={`/images/${schoolSelected.logo}`} />
                  <AvatarFallback>{schoolSelected.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-2">
                  <ItemTitle className="font-poppins font-semibold text-foreground">
                    {schoolSelected.name}
                  </ItemTitle>

                  <p className="text-sm  ">{schoolSelected.address}</p>
                  <p className="text-xs text-foreground">
                    Code: {schoolSelected.code}
                  </p>
                </div>
              </div>

              <Button variant="ghost" onClick={() => setSchoolSelected(null)}>
                <X />
              </Button>
            </div>
          </div>{' '}
          <Button onClick={() => setCurrentStep(2)}>Continuer →</Button>
        </div>
      )}
    </div>
  );
};
