import {AuthPageLayout} from "@/components/auth/auth-page-layout";
import {ForgotPasswordForm} from "@/components/auth/forgot-password-form";


const forgotPasswordSlides = [
  {
    src: '/images/chalkboard-career-doodle-copy-space-corridor.jpg',
    title: 'Sécurité et sérénité',
    description: 'Nous protégeons vos données avec les meilleures technologies pour vous offrir un espace sûr.',
  },
  {
    src: '/images/joyful-young-schoolgirl-wearing-backpack-holding-looking-phone-showing-yes-gesture.jpg',
    title: 'Une réinitialisation en toute confiance',
    description: 'Vous recevrez un lien sécurisé pour retrouver l’accès à votre compte en quelques clics.',
  },
  {
    src: '/images/little-boy-with-happy-new-month-lettering.jpg',
    title: 'L’éducation ne s’arrête jamais',
    description: 'Reprenez le contrôle et poursuivez votre parcours scolaire sans interruption.',
  },
];

export default function ForgotPasswordPage() {
  return (
      <AuthPageLayout slides={forgotPasswordSlides}>
        <ForgotPasswordForm />
      </AuthPageLayout>
  );
}
