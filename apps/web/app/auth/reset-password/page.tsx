import {useQueryState} from 'nuqs';
import {AuthPageLayout} from "@/components/auth/auth-page-layout";
import Link from "next/link";
import {ResetPasswordForm} from "@/components/auth/reset-password-form";

const resetPasswordSlides = [
  {
    src: '/images/chalkboard-career-doodle-copy-space-corridor.jpg',
    title: 'Un mot de passe fort pour un compte sécurisé',
    description: 'Choisissez un mot de passe unique que vous n’utilisez pas ailleurs.',
  },
  {
    src: '/images/joyful-young-schoolgirl-wearing-backpack-holding-looking-phone-showing-yes-gesture.jpg',
    title: 'La sécurité, au cœur de StackSchool',
    description: 'Nous protégeons vos données avec des technologies de pointe.',
  },
  {
    src: '/images/little-boy-with-happy-new-month-lettering.jpg',
    title: 'Reprenez le contrôle',
    description: 'Votre compte est maintenant sécurisé. Vous pouvez reprendre vos activités.',
  },
];

export default function ResetPasswordPage() {
  const [token] = useQueryState('token');

  if (!token) {
    // Rediriger vers forgot-password si pas de token
    // On peut aussi afficher un message
    return (
        <AuthPageLayout slides={resetPasswordSlides}>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Token manquant. Veuillez refaire une demande.</p>
            <Link href="/auth/forgot-password" className="text-primary hover:underline">
              Demander un nouveau lien
            </Link>
          </div>
        </AuthPageLayout>
    );
  }

  return (
      <AuthPageLayout slides={resetPasswordSlides}>
        <ResetPasswordForm token={token} />
      </AuthPageLayout>
  );
}
