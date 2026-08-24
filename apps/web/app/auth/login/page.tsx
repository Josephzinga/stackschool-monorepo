'use client';

import {authServices, LoginFormType, parseAxiosError,} from '@stackschool/contracts';
import {LoginForm} from '@/components/auth/login-form';
import {useRouter} from 'next/navigation';
import {toast} from 'sonner';
import {AuthImageSlider} from "@/components/ui/auth-image-slider";
import StackSchoolLogo from "@/components/ui/StackSchoolLogo";

const loginSlides = [
  {
    src: '/images/chalkboard-career-doodle-copy-space-corridor.jpg',
    title: 'La connaissance au bout des doigts',
    description: 'Accédez à vos cours, devoirs et résultats en un clic, où que vous soyez.',
  },
  {
    src: '/images/joyful-young-schoolgirl-wearing-backpack-holding-looking-phone-showing-yes-gesture.jpg',
    title: 'Votre espace, en toute sécurité',
    description: 'Chiffrement de bout en bout pour protéger vos données et votre vie privée.',
  },
  {
    src: '/images/little-boy-with-happy-new-month-lettering.jpg',
    title: 'Ensemble, vers la réussite',
    description: 'Une communauté éducative soudée pour accompagner chaque élève dans son parcours.',
  },
];
export default function LoginPage() {
  const router = useRouter();

  const handleLogin = async (values: LoginFormType) => {
    try {
      const res = await authServices.login(values);
      if (res.ok) {
        router.push(`/auth/finish?from=${res.user.provider}`);
      }
      toast.success(res.message || 'Connexion réussie');
    } catch (err: any) {
      const { message, data, status } = parseAxiosError(err);
      if (data?.isSocialOnly) {
        return toast.warning(data.message);
      }
      toast.error(message)
    }
  };

  return (
      <div className="grid min-h-dvh lg:grid-cols-2">
        {/* Colonne gauche - Formulaire */}
        <div className="flex flex-col items-center justify-center px-6 py-8 sm:px-10">
          <div className="w-full max-w-md">
            <div className="flex justify-center mb-4">
              <StackSchoolLogo className="h-12 w-auto" />
            </div>
            <LoginForm handleLogin={handleLogin} />
            <p className="mt-4 text-center text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} StackSchool. Tous droits réservés.
            </p>
          </div>
        </div>

        {/* Colonne droite - Slider */}
        <div className="relative hidden lg:block bg-muted/50">
          <AuthImageSlider slides={loginSlides} interval={5000} />
        </div>
      </div>
  );
}
