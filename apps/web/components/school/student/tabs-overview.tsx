import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BriefcaseBusinessIcon,
  CalendarDays,
  Car,
  ChartLineIcon,
  FileIcon,
  FileText,
  Mail,
  MapPin,
  MapPinIcon,
  MoreHorizontal,
  Phone,
  SchoolIcon,
  User,
  Users,
} from 'lucide-react';
import { InfoItem } from '../info-item';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { GetStudentDetailsQuery, relationItems } from '@stackschool/ui';
import { studentStatusLabel, transportMode } from '@/constant';
import { IconSchool } from '@tabler/icons-react';
import { Badge } from '@/components/ui/badge';

export function TabsOverview({
  student,
}: {
  student?: GetStudentDetailsQuery['student'];
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Colonne Gauche : Identité & Famille */}
      <div className="md:col-span-2 space-y-6">
        {/* Identité */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Informations Personnelles
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
            <InfoItem
              label="Date de naissance"
              value={
                student?.birthDate
                  ? new Date(student?.birthDate).toLocaleDateString()
                  : '-'
              }
              icon={CalendarDays}
            />
            <InfoItem
              label="Lieu de naissance"
              value={student?.birthPlace || '-'}
              icon={MapPin}
            />
            <InfoItem
              label="Nationalité"
              value={student?.nationality || '-'}
              icon={FileText}
            />
            <InfoItem
              label="Sexe"
              value={
                student?.user?.profile?.gender === 'MALE'
                  ? 'Masculin'
                  : 'Féminin'
              }
              icon={User}
            />
            {student?.user?.phoneNumber && (
              <InfoItem
                icon={Phone}
                label="Numéro de téléphone"
                value={student?.user?.phoneNumber}
              />
            )}
            <InfoItem
              label="Address"
              value={student?.user?.profile?.address ?? undefined}
              icon={MapPinIcon}
            />
            <InfoItem
              label="Mode de transport"
              icon={Car}
              value={
                transportMode.find((m) => m.value === student?.transportMode)
                  ?.label
              }
            />
          </CardContent>
        </Card>

        {/* Famille */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Informations Familiales
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col gap-2">
              {student?.parents?.map((p) => (
                <div
                  key={p?.id}
                  className="flex flex-col gap-2 border rounded-lg w-full px-3 py-2 bg-white dark:bg-black"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-sans font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                      {
                        relationItems.find((r) => r.value === p?.relationType)
                          ?.label
                      }
                    </p>
                    <Button className="w-8 h-8" variant="ghost">
                      <MoreHorizontal />
                    </Button>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center sm:gap-4 gap-3">
                    <div className="flex gap-2 items-center">
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src={p?.user?.profile?.photo ?? undefined}
                        />
                        <AvatarFallback>
                          {p?.user?.profile?.firstname?.[0]}
                          {p?.user?.profile?.lastname?.[0]}
                        </AvatarFallback>
                      </Avatar>

                      <p className="font-sans text-lg font-medium">
                        {p?.user?.profile?.firstname}{' '}
                        {p?.user?.profile?.lastname}
                      </p>
                    </div>

                    <InfoItem
                      label="Numéro de téléphone"
                      value={p?.user?.phoneNumber}
                      icon={Phone}
                    />
                    {p?.user?.email && (
                      <InfoItem
                        label="Addrese email"
                        value={p?.user?.email}
                        icon={Mail}
                      />
                    )}
                    <InfoItem
                      label="Profession"
                      value={p?.profession!}
                      icon={BriefcaseBusinessIcon}
                    />
                    <InfoItem
                      label="Addresse"
                      value={p?.user?.profile?.address}
                      icon={MapPin}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <SchoolIcon className="h-5 w-5 text-primary" />
              Information Scolaire
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
            <InfoItem
              label="Date d'inscription"
              value={
                student?.enrollmentDate
                  ? new Date(student?.enrollmentDate).toLocaleDateString()
                  : undefined
              }
              icon={CalendarDays}
            />
            <InfoItem
              icon={IconSchool}
              label="École de provenance"
              value={student?.previousSchool}
            />
            {student?.status && (
              <InfoItem icon={ChartLineIcon} label="Statut scolaire">
                <Badge>{studentStatusLabel[student?.status]}</Badge>
              </InfoItem>
            )}
            <InfoItem
              icon={FileIcon}
              label="Numéro de cetifica de naissance"
              value={student?.birthCertificateNumber}
            />
          </CardContent>
        </Card>
      </div>

      {/* Colonne Droite : Stats Rapides */}
      <div className="space-y-6">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase">
              État Financier
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">À jour</div>
            <p className="text-xs text-muted-foreground mt-1">
              Aucun paiement en retard
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase">
              Moyenne Générale
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">14.5/20</div>
            <p className="text-xs text-green-600 mt-1 flex items-center">
              +0.5 vs Trimestre 1
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase">
              Assiduité
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground mt-1">
              3 absences justifiées
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
