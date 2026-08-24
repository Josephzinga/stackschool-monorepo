'use client';
import 'react-phone-number-input/style.css';
import StackSchoolLogo from "@/components/ui/StackSchoolLogo";
import {AuthImageSlider} from "@/components/ui/auth-image-slider";
import {RegisterForm} from "@/components/auth/register-form";


const registerSlides = [
  {
    src: '/images/chalkboard-career-doodle-copy-space-corridor.jpg',
    title: 'Bienvenue dans la communauté StackSchool',
    description: 'Rejoignez des milliers d’élèves, enseignants et parents qui transforment l’éducation au quotidien.',
  },
  {
    src: '/images/joyful-young-schoolgirl-wearing-backpack-holding-looking-phone-showing-yes-gesture.jpg',
    title: 'Un apprentissage personnalisé',
    description: 'Des ressources adaptées à votre niveau, pour progresser à votre rythme.',
  },
  {
    src: '/images/little-boy-with-happy-new-month-lettering.jpg',
    title: 'Votre réussite est notre priorité',
    description: 'Une plateforme intuitive et sécurisée pour vous accompagner vers l’excellence.',
  },
];

export default function RegisterPage() {
  return (
      <div className="relative grid min-h-dvh lg:grid-cols-2">
        {/* Colonne gauche - Formulaire */}
        <div className="flex flex-col items-center justify-center px-6 py-8 sm:px-10">
          <div className="w-full max-w-md">
            <div className="flex justify-center mb-4">
              <StackSchoolLogo className="h-12 md:h-18 w-auto" />
            </div>
            <RegisterForm />
            <p className="mt-4 text-center text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} StackSchool. Tous droits réservés.
            </p>
          </div>
        </div>
        {/* Colonne droite - Slider */}
        <div className="relative hidden lg:block bg-muted/50">
          <div className="absolute -left-25 z-40 h-full w-50 bg-linear-to-l from-packground/80 via-background to-background/60"/>

          <AuthImageSlider slides={registerSlides} interval={5000} />
        </div>
      </div>
  );
}
