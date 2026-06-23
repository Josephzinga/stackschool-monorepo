'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWindowSize } from 'react-use';
import gsap from 'gsap';
import { useCompleteProfileStore } from '@stackschool/ui';
import { CardContent, CardFooter } from '@/components/ui/card';
import { ArrowRight, CheckCircle2, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Confetti from 'react-confetti';

export default function SuccessStep() {
  const router = useRouter();

  const { school, clearAllData, profile, role } = useCompleteProfileStore();
  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Séquence d'animation
    tl.set(containerRef.current, { visibility: 'visible' })
      // 1. L'icône apparaît avec un effet "pop" élastique
      .fromTo(
        iconRef.current,
        { scale: 0, rotation: -90 },
        { scale: 1, rotation: 0, duration: 1.2, ease: 'elastic.out(1, 0.5)' },
      )
      // 2. Le titre et le texte glissent vers le haut
      .fromTo(
        titleRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6 },
        '-=0.8', // Commence un peu avant la fin de l'icône
      )
      .fromTo(
        textRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6 },
        '-=0.4',
      )
      //  On déclenche les confettis au milieu de l'animation
      .call(() => setShowConfetti(true), undefined, '-=0.2')
      //  Le bouton apparaît en dernier
      .fromTo(
        buttonRef.current,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.5 },
        '+=0.2',
      );

    const timer = setTimeout(() => setShowConfetti(false), 7000);
    return () => clearTimeout(timer);
  }, []);

  const handleGoToDashboard = async () => {
    await clearAllData();
    router.push(`/dashboard/${role?.role.toLowerCase()}`);
  };

  const firstName = profile?.firstname || 'Utilisateur';
  const schoolName = school?.schoolSelected?.name || 'votre établissement';

  return (
    <div className="h-screen w-full flex justify-center items-center bg-linear-to-tr from-blue-500 via-purple-500 to-purple-200">
      {showConfetti && (
        <Confetti
          height={height}
          width={width}
          numberOfPieces={500}
          friction={1}
          gravity={0.4}
          colors={['red', 'green', 'blue', 'purple', 'yellow']}
        />
      )}
      <div className="rounded-xl relative max-w-xl mx-auto text-center border-none shadow-none sm:border sm:shadow-sm overflow-hidden  z-10 bg-white/90 backdrop-blur-sm">
        {/* Un petit fond dégradé subtil en haut */}
        <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-blue-500 via-emerald-500 to-blue-500" />

        <CardContent className="pt-12 pb-8 px-8 flex flex-col items-center">
          {/* Icône animée */}
          <div ref={iconRef} className="mb-8 relative">
            <div className="absolute inset-0 bg-green-100 rounded-full scale-150 blur-xl opacity-50 animate-pulse"></div>
            <div className="relative bg-white p-4 rounded-full shadow-md z-10">
              <CheckCircle2
                className="w-20 h-20 text-green-600"
                strokeWidth={1.5}
              />
            </div>
          </div>

          {/* Textes animés */}
          <h2
            ref={titleRef}
            className="text-4xl font-bold font-inter text-gray-900 mb-4 tracking-tight"
          >
            Félicitations, {firstName} !
          </h2>
          <p
            ref={textRef}
            className="text-lg text-gray-600 font-poppins max-w-md mx-auto leading-relaxed"
          >
            Votre profil est terminé. Bienvenue dans l'espace numérique de{' '}
            <span className="font-semibold text-blue-700">{schoolName}</span>.
          </p>
        </CardContent>

        <CardFooter
          ref={buttonRef}
          className="flex flex-col sm:flex-row justify-center gap-4 pb-10 px-8"
        >
          <Button
            size="lg"
            onClick={handleGoToDashboard}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-lg h-14 px-8 gap-3 shadow-lg shadow-blue-600/20 transition-transform hover:scale-105 active:scale-95"
          >
            <LayoutDashboard className="w-5 h-5" />
            Accéder à mon Tableau de bord
            <ArrowRight className="w-5 h-5 ml-1 opacity-70" />
          </Button>
        </CardFooter>
      </div>
    </div>
  );
}
