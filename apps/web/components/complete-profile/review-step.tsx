import {
  allRoles,
  useCompleteProfileStore,
  useConfirmCompleteProfileMutation,
} from '@stackschool/ui';
import { Button } from '@/components/ui/button';
import { SubmitButton } from '@/components/submit-button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  BookOpen,
  Briefcase,
  Check,
  Edit2,
  GraduationCap,
  Mail,
  MapPin,
  PartyPopper,
  Phone,
  School,
  User,
  Users,
} from 'lucide-react';
import { ParentFormData, StudentFormData } from '@stackschool/shared';
import { useRouter } from 'next/navigation';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { toast } from 'sonner';

// --- Sous-composants de Review ---

function TeacherReview({ data }: { data: any }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 text-sm ">
        <div>
          <p className="text-muted-foreground flex items-center gap-1">
            <GraduationCap className="h-3 w-3" /> Diplôme
          </p>
          <p className="font-medium">{data.diploma}</p>
        </div>
        {data.department && (
          <div>
            <p className="text-muted-foreground flex items-center gap-1">
              <BookOpen className="h-3 w-3" /> Département
            </p>
            <p className="font-medium">{data.department}</p>
          </div>
        )}
      </div>
      <Separator />
      <div className="space-y-3">
        <p className="font-medium text-sm">
          Classes assignées ({data.assignments?.length || 0})
        </p>
        <div className="grid gap-2">
          {data.assignments?.map((assign: any, i: number) => (
            <div
              key={i}
              className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-md flex justify-between items-center"
            >
              <div>
                <p className="font-medium text-sm">{assign.className}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {assign.subjectNames?.map((sub: string) => (
                    <Badge
                      variant="outline"
                      className="border-chart-5 border"
                      key={sub}
                    >
                      {sub}
                    </Badge>
                  ))}
                </div>
              </div>
              {assign.isMainTeacher && (
                <Badge variant="secondary" className="text-xs">
                  Titulaire
                </Badge>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ParentReview({ data }: { data: ParentFormData }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 text-sm">
        {data.profession && (
          <div>
            <p className="text-muted-foreground flex items-center gap-1">
              <Briefcase className="h-3 w-3" /> Profession
            </p>
            <p className="font-medium">{data.profession}</p>
          </div>
        )}
        {data.address && (
          <div>
            <p className="text-muted-foreground flex items-center gap-1">
              <MapPin className="h-3 w-3" /> Adresse
            </p>
            <p className="font-medium">{data.address}</p>
          </div>
        )}
        <div>
          <p className="text-muted-foreground flex items-center gap-1">
            {data.contactPreference === 'EMAIL' ? (
              <Mail className="h-3 w-3" />
            ) : (
              <Phone className="h-3 w-3" />
            )}
            Contact préféré
          </p>
          <p className="font-medium capitalize">
            {data.contactPreference?.toLowerCase()}
          </p>
        </div>
      </div>
      <Separator />
      <div className="space-y-3">
        <p className="font-medium text-sm flex items-center gap-2">
          <Users className="h-4 w-4" />
          Enfants liés ({data.children?.length || 0})
        </p>
        <div className="grid gap-2">
          {data.children?.map((child, i: number) => (
            <div
              key={i}
              className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-md flex items-center gap-3"
            >
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                C
              </div>
              <div>
                <p className="font-medium text-sm">
                  Enfant {i + 1} {child.firstname}
                </p>
                <p className="text-xs text-muted-foreground">
                  Relation :{' '}
                  {child.relation === 'FATHER'
                    ? 'Père'
                    : child.relation === 'MOTHER'
                      ? 'Mère'
                      : 'Tuteur'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StudentReview({ data }: { data: StudentFormData }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-muted-foreground">Matricule</p>
          <Badge variant="secondary">{data.matricule}</Badge>
        </div>
        <div>
          <p className="text-muted-foreground">Année d'inscription</p>
          <p className="font-medium">{data.enrollmentYear}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Date de naissance</p>
          <p className="font-medium">
            {new Date(data.birthDate).toLocaleDateString()}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground">Lieu de naissance</p>
          <p className="font-medium">{data.birthPlace}</p>
        </div>
      </div>
      <Separator />
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-muted-foreground">Père</p>
          <p className="font-medium">{data.fatherName || '-'}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Mère</p>
          <p className="font-medium">{data.motherName || '-'}</p>
        </div>
      </div>
    </div>
  );
}

// --- Composant Principal ---

export default function ReviewStep() {
  const { profile, school, role, setCurrentStep } = useCompleteProfileStore();
  const router = useRouter();

  const { mutateAsync, isPending, error } = useConfirmCompleteProfileMutation({
    onSuccess: (data, context) => {
      if (!data.confirmCompleteProfile) return;
      if (data.confirmCompleteProfile.ok) {
        toast.success(data.confirmCompleteProfile.message);
        setTimeout(() => router.push('/onboard'));
      }
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = async () => {
    await mutateAsync({});
  };

  if (!profile || !school || !role) return null;
  useGSAP(() => {
    gsap.fromTo(
      '.review-card',
      {
        opacity: 0,
        duration: 0.2,
        x: 50,
        stagger: 0.2,
        ease: 'power2.out',
        yoyo: true,
      },
      {
        opacity: 1,
        duration: 0.4,
        x: 1,
        stagger: 0.2,
      },
    );
  });
  const roleSpecificData =
    role.role === 'TEACHER'
      ? role.teacher
      : role.role === 'PARENT'
        ? role.parent
        : role.role === 'STUDENT'
          ? role.student
          : null;

  return (
    <div className="space-y-6 max-w-3xl mx-auto w-full">
      <div className="text-center space-y-2 animate-in fade-in-50 duration-500">
        <PartyPopper className="h-12 w-12 text-primary mx-auto" />
        <h2 className="text-3xl font-bold font-inter">Presque Fini !</h2>
        <p className="text-muted-foreground">
          Vérifiez vos informations une dernière fois.
        </p>
      </div>

      {/* 2. Informations École */}
      <div className="review-card overflow-hidden inset-shadow-chart-1 inset-shadow-sm rounded-lg p-2 border-l-4 border-l-chart-1">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="w-14 h-14">
              <AvatarImage
                src={
                  school.type === 'join'
                    ? `/images/${school.schoolSelected.logo}`
                    : undefined
                }
              />
              <AvatarFallback className="border border-chart-1">
                <School className="text-chart-1 h-9 w-9" />
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">École rejointe</p>
              <h3 className="font-semibold font-poppins text-lg">
                {school.type === 'join'
                  ? school.schoolSelected.name
                  : school.type === 'invite'
                    ? school.invitationCode
                    : ''}
              </h3>
              <p className="text-xs text-muted-foreground">
                {school.type === 'join' && school?.schoolSelected?.address}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Badge variant="outline">Étape 1</Badge>
            <Button variant="ghost" size="sm" onClick={() => setCurrentStep(1)}>
              <Edit2 className="h-4 w-4 mr-1" /> Modifier
            </Button>
          </div>
        </div>
      </div>

      {/* 1. Informations Personnelles */}
      <div className="review-card overflow-hidden inset-shadow-chart-4 inset-shadow-sm rounded-lg px-3 py-2  border-l-4 border-l-chart-4 ">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14">
              <AvatarImage src={`${profile.photo}`} />
              <AvatarFallback className="border-chart-4 border">
                <User className="h-9 w-9 text-chart-4" />
              </AvatarFallback>
            </Avatar>

            <div>
              <p>Informations personnelles</p>
              <p className="font-bold text-xl">
                {profile.firstname} {profile.lastname}
              </p>
              <p className="text-muted-foreground">
                {profile?.email} {profile?.phoneNumber}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Badge variant="outline">Étape 2</Badge>
            <Button variant="ghost" size="sm" onClick={() => setCurrentStep(2)}>
              <Edit2 className="h-4 w-4 mr-1" /> Modifier
            </Button>
          </div>
        </div>
      </div>

      {/* 3. Informations Spécifiques au Rôle */}
      <div className="review-card overflow-hidden inset-shadow-chart-5 inset-shadow-sm rounded-lg px-3 py-3  border-l-4 border-l-chart-5 ">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Check className="h-5 w-5 text-primary" />
            Rôle : {allRoles.filter((r) => r.value === role?.role)[0].label}
          </h3>
          <Button variant="ghost" size="sm" onClick={() => setCurrentStep(3)}>
            <Edit2 className="h-4 w-4 mr-1" /> Modifier
          </Button>
        </div>

        {role.role === 'TEACHER' && role.teacher && (
          <TeacherReview data={role.teacher} />
        )}
        {role.role === 'PARENT' && role.parent && (
          <ParentReview data={role.parent} />
        )}
        {role.role === 'STUDENT' && role.student && (
          <StudentReview data={role.student} />
        )}
      </div>

      <div className="flex gap-4 pt-4 animate-in fade-in-50 duration-500 delay-500">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(3)}
          disabled={isPending}
        >
          ← Retour
        </Button>
        <SubmitButton
          isSubmitting={isPending}
          onClick={handleSubmit}
          className="flex-1"
        >
          <Check className="mr-2 h-4 w-4" />
          Valider et Terminer
        </SubmitButton>
      </div>
    </div>
  );
}
