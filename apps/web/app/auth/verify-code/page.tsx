import {AuthPageLayout} from "@/components/auth/auth-page-layout";
import {VerifyCodeForm} from "@/components/auth/verify-code-form";

const verifyCodeSlides = [
  {
    src: '/images/chalkboard-career-doodle-copy-space-corridor.jpg',
    title: 'Sécurité renforcée',
    description: 'Cette double vérification garantit que vous êtes bien le propriétaire du compte.',
  },
  {
    src: '/images/joyful-young-schoolgirl-wearing-backpack-holding-looking-phone-showing-yes-gesture.jpg',
    title: 'Un code, une protection',
    description: 'Votre sécurité est notre priorité. Ce code expire dans quelques minutes.',
  },
  {
    src: '/images/little-boy-with-happy-new-month-lettering.jpg',
    title: 'Accédez à votre espace en toute sérénité',
    description: 'Une fois vérifié, vous pourrez reprendre vos activités en toute confiance.',
  },
];

export default function VerifyCodePage() {
  return (
      <AuthPageLayout slides={verifyCodeSlides}>
        <VerifyCodeForm />
      </AuthPageLayout>
  );
}
