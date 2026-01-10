import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Item, ItemGroup, ItemTitle } from '@/components/ui/item';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { School, schoolService } from '@stackschool/shared';
import { toast } from 'sonner';
import { useCompleteProfileStore } from '@stackschool/ui';
import { useDebounce } from '@/hooks/useDebounce';
import { useState } from 'react';
import { Spinner } from '@/components/ui/spinner';
import { Search } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

export const SearchSchoolFrom = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const searchDebounce = useDebounce(400, searchQuery.trim() || null);
  const {
    setSchoolData,
    setCurrentStep,
    school: schoolData,
  } = useCompleteProfileStore();
  const { data, isLoading, error } = useQuery({
    queryKey: ['school', searchDebounce],
    queryFn: async (): Promise<School[] | null | any> => {
      if (!searchDebounce || searchDebounce.length < 2) return [];
      const data = await schoolService.searchSchools(searchDebounce);
      if (data.errors) {
        const message = data.errors[0]?.message;
        throw new Error(message);
      }
      return data.data.searchSchool;
    },
  });

  if (error) {
    toast.error(error.message);
  }
  const schoolSelected =
    schoolData?.type === 'join' ? schoolData.schoolSelected : null;
  const handleClick = (school: School) => {
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
    setCurrentStep(2);
  };

  return (
    <div className="space-y-4">
      <Field className="relative">
        <FieldLabel htmlFor="search" className="font-poppins">
          Rechercher une école
        </FieldLabel>
        <Input
          id="search"
          icon={Search}
          placeholder="Nom de l'école ou code..."
          className="h-10 border-border"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
          }}
        />
        <span className="absolute w-6! right-2 top-10 text-gray-400">
          {isLoading && <Spinner className="text-primary" />}
        </span>
      </Field>

      {schoolSelected && !searchQuery && (
        <>
          <Item
            onClick={() => setCurrentStep(2)}
            className=" cursor-pointer hover:border-blue-500 bg-slate-200 dark:bg-gray-700 p-2 transition-colors px-4"
          >
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
            </div>
          </Item>
        </>
      )}
      <ItemGroup className="space-y-2 max-h-60 overflow-y-auto h-full">
        {data?.map((school: School) => (
          <Item
            key={school.id}
            onClick={() => {
              handleClick(school);
              toast.success(`vous avez selectionner l'école ${school.name}`);
            }}
            className=" cursor-pointer hover:border-blue-500 bg-slate-200 dark:bg-gray-700 p-2 transition-colors px-4"
          >
            <div className="flex justify-between items-center w-full font-inter">
              <div className="flex flex-col gap-2">
                <ItemTitle className="font-poppins font-semibold text-foreground">
                  {school.name}
                </ItemTitle>

                <p className="text-sm  ">{school.address}</p>
                <p className="text-xs text-foreground">Code: {school.code}</p>
              </div>
              <Avatar className="w-12 h-12">
                <AvatarImage src={`/images/${school.logo}`} />
                <AvatarFallback>{school.name[0]}</AvatarFallback>
              </Avatar>
            </div>
          </Item>
        ))}
      </ItemGroup>
    </div>
  );
};
