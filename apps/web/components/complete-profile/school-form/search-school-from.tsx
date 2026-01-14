import { Field, FieldLabel } from '@/components/ui/field';
import { Item, ItemTitle } from '@/components/ui/item';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SchoolSelected, schoolService } from '@stackschool/shared';
import { toast } from 'sonner';
import { useCompleteProfileStore } from '@stackschool/ui';
import { useDebounce } from '@/hooks/useDebounce';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { SearchInput } from '@/components/search-input';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export const SearchSchoolFrom = () => {
  const {
    setSchoolData,
    setCurrentStep,
    school: schoolData,
  } = useCompleteProfileStore();
  const [searchQuery, setSearchQuery] = useState('');
  const searchDebounce = useDebounce(400, searchQuery.trim() || null);
  const [schoolSelected, setSchoolSelected] = useState<SchoolSelected | null>(
    schoolData?.type === 'join' ? schoolData.schoolSelected : null,
  );

  const { data, isLoading, error } = useQuery({
    queryKey: ['school', searchDebounce],
    queryFn: async (): Promise<SchoolSelected[]> => {
      if (!searchDebounce || searchDebounce.length < 2) return [];
      const data = await schoolService.searchSchools(searchDebounce);
      if (data.errors) {
        const message = data.errors[0]?.message;
        throw new Error(message);
      }
      return data.data.searchSchool as SchoolSelected[];
    },
  });

  if (error) {
    toast.error(error.message);
  }
  console.log('data', data);
  const handleClick = (school: SchoolSelected) => {
    setSchoolData({
      type: 'join',
      schoolSelected: {
        id: school.id,
        name: school.name,
        code: school.code,
        address: school.address,
        logo: school.logo,
      },
    });
    toast.success(`vous avez selectionner l'école ${school.name}`);
    setCurrentStep(2);
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

        {!!data?.length && (
          <div className=" w-full mt-1 border rounded-lg bg-slate-50 dark:bg-slate-900 shadow-lg max-h-60 overflow-y-auto overflow-x-hidden">
            {data.map((item) => (
              <div
                onClick={() => handleClick(item)}
                className={cn(
                  'flex px-3 py-1.5 justify-between items-center w-full font-poppins',
                  'cursor-pointer transition-colors hover:bg-slate-200 dark:hover:bg-slate-800',
                  'border-b last:border-0 border-slate-300 dark:border-slate-800',
                )}
              >
                <div className="flex flex-col gap-2">
                  <ItemTitle className="font-poppins font-semibold text-foreground">
                    {item.name}
                  </ItemTitle>
                  <p className="text-sm  ">{item.address}</p>
                  <p className="text-xs text-foreground">Code: {item.code}</p>
                </div>
                <Avatar className="w-12 h-12">
                  <AvatarImage src={`/images/${item.logo}`} />
                  <AvatarFallback>{item.name[0]}</AvatarFallback>
                </Avatar>
              </div>
            ))}
          </div>
        )}
      </Field>

      {schoolSelected && !searchQuery && (
        <div className="flex flex-col gap-10">
          <Item className=" cursor-pointer hover:border-blue-500 bg-slate-200 dark:bg-gray-700 p-2 transition-colors px-4">
            <div className="flex justify-between items-center w-full font-inter">
              <div className="flex flex-col gap-2">
                <ItemTitle className="font-poppins font-semibold text-foreground">
                  {schoolSelected.name}
                </ItemTitle>

                <p className="text-sm  ">{schoolSelected.address}</p>
                <p className="text-xs text-foreground">
                  Code: {schoolSelected.code}
                </p>
              </div>
              <Avatar className="w-12 h-12">
                <AvatarImage src={`/images/${schoolSelected.logo}`} />
                <AvatarFallback>{schoolSelected.name[0]}</AvatarFallback>
              </Avatar>
              <Button variant="ghost" onClick={() => setSchoolSelected(null)}>
                <X />
              </Button>
            </div>
          </Item>{' '}
          <Button onClick={() => setCurrentStep(2)}>
            <Button>Continuer →</Button>
          </Button>
        </div>
      )}
    </div>
  );
};
