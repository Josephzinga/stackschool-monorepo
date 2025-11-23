"use client";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { School } from "@stackschool/db";
import { useEffect, useState } from "react";
import { CreateSchoolForm } from "@/components/complete-profile/create-school-form";
import InvitationForm from "./invitation-form";
import { useDebounce } from "@/hooks/useDebounce";
import { Loader2, Search } from "lucide-react";
import { searchSchools } from "@/services/complete-profile";
import { Field, FieldLabel } from "../ui/field";
import { UseCompleteProfileStore } from "@/store/complete-profiile-store";
import { toast } from "sonner";
import { Item, ItemGroup, ItemMedia, ItemTitle } from "../ui/item";
import { AvatarName } from "../profile-avatar";

export default function SchoolStep() {
  const [mode, setMode] = useState<"join" | "create" | "invite">("join");
  const [schools, setSchools] = useState<School[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const searchDebounce = useDebounce(400, searchQuery.trim() || null);
  const { setSchoolData, setCurrentStep } = UseCompleteProfileStore();
  // Recherche d'écoles
  useEffect(() => {
    if (!searchDebounce) return setSchools([]);

    searchSchools(searchDebounce, setIsLoading).then(setSchools);
  }, [searchDebounce]);

  const handleClick = (schoolId: string) => {
    setSchoolData({
      type: "join",
      schoolId,
    });
    setCurrentStep(2);
  };
  return (
    <div className="space-y-6 p-3 w-full h-full">
      <div className="text-center max-h-screen">
        <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
          Votre École
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-slate-200">
          Rejoignez votre établissement scolaire
        </CardDescription>
      </div>

      <Tabs
        className="w-full flex justify-center mx-auto"
        value={mode}
        onValueChange={(val) => setMode(val as any)}>
        <div className="w-full flex justify-center">
          <TabsList className="grid grid-cols-3 mb-6 gap-2 h-10">
            <TabsTrigger value="join">Rejoindre</TabsTrigger>
            <TabsTrigger value="create">Créer</TabsTrigger>
            <TabsTrigger value="invite">Invitation</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="join" className="space-y-4">
          <Field className="relative">
            <FieldLabel htmlFor="search">Rechercher une école</FieldLabel>
            <Input
              id="search"
              placeholder="Nom de l'école ou code..."
              className="h-10"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
            />
            <span className="absolute w-6! right-2 top-10 text-gray-400">
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin text-sky-500" />
              ) : (
                <Search className="h-5 w-5" />
              )}
            </span>
          </Field>
          <ItemGroup className="space-y-2 max-h-60 overflow-y">
            {schools.map((school) => (
              <Item
                key={school.id}
                onClick={() => {
                  handleClick(school.id);
                  toast.success(
                    `vous avez selectionner l'ecole ${school.name}`
                  );
                }}
                className=" cursor-pointer hover:border-blue-500 bg-slate-200 dark:bg-gray-700  transition-colors ">
                <div className="flex justify-between items-center w-full pr-4">
                  <div className="flex flex-col gap-2">
                    <ItemTitle className="font-semibold text-foreground">
                      {school.name}
                    </ItemTitle>

                    <p className="text-sm dark:text-gray-300 text-gray-700 ">
                      {school.address}
                    </p>
                    <p className="text-xs text-foreground">
                      Code: {school.code}
                    </p>
                  </div>
                  <ItemMedia variant="image">
                    <AvatarName
                      name={school.name}
                      url={school.logo}
                      className="rounded-lg! h-20 w-20"
                      size={70}
                    />
                  </ItemMedia>
                </div>
              </Item>
            ))}
          </ItemGroup>
        </TabsContent>

        <TabsContent value="create" className="space-y-4 h-full">
          <CreateSchoolForm />
        </TabsContent>

        <TabsContent value="invite" className="space-y-4">
          <InvitationForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
