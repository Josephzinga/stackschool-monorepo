"use client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { School, SchoolUser } from "@stackschool/db";
import { useEffect, useState } from "react";
import { CreateSchoolForm } from "@/components/complete-profile/school-step/create-school-form";
import InvitationForm from "../../../components/complete-profile/school-step/invitation-form";
import { CompleteProfileData } from "./page";
import api from "@/services/api";

// Étendre SchoolUser pour le rendre générique

export default function SchoolStep({
  onNext,
}: {
  onNext: (value: CompleteProfileData) => void;
}) {
  const [mode, setMode] = useState<"join" | "create" | "invite">("join");
  const [schools, setSchools] = useState<School[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Recherche d'écoles
  useEffect(() => {
    const searchSchools = async () => {
      try {
        const res = await api.get(`/api/schools?search=${searchQuery}`);
        setSchools(res.data?.schools || []);
        console.log(res);
      } catch (error: any) {
        console.error(error.response?.error || "Erreur réseau");
      }
    };
    searchSchools();
  }, [searchQuery]);
  console.log(mode);
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Votre École</h2>
        <p className="text-gray-600">Rejoignez votre établissement scolaire</p>
      </div>

      <Tabs className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="join">Rejoindre</TabsTrigger>
          <TabsTrigger value="create">Créer</TabsTrigger>
          <TabsTrigger value="invite">Invitation</TabsTrigger>
        </TabsList>

        <TabsContent value="join" className="space-y-4">
          <div>
            <Label htmlFor="search">Rechercher une école</Label>
            <Input
              id="search"
              placeholder="Nom de l'école ou code..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
            />
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {schools.map((school) => (
              <Card
                key={school.id}
                className="p-4 cursor-pointer hover:border-blue-500 transition-colors"
                onClick={() =>
                  onNext({
                    school: {
                      schoolId: school.id,
                    },
                  })
                }>
                <h3 className="font-semibold">{school.name}</h3>
                <p className="text-sm text-gray-600">{school.address}</p>
                <p className="text-xs text-gray-500">Code: {school.code}</p>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="create" className="space-y-4">
          <CreateSchoolForm onSuccess={onNext} />
        </TabsContent>

        <TabsContent value="invite" className="space-y-4">
          <InvitationForm onSuccess={onNext} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
