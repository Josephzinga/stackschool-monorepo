'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { SplitText } from './split-text';
import { cn } from '@/lib/utils';

interface SlideData {
  src: string;
  title: string;
  description: string;
}

interface AuthImageSliderProps {
  slides: SlideData[];
  interval?: number;
  className?: string;
}

export function AuthImageSlider({
  slides,
  interval = 6000,
  className,
}: AuthImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, interval);

    return () => clearInterval(timer);
  }, [slides.length, interval]);

  return (
    <div
      className={cn('relative  z-50 overflow-hidden w-full h-full', className)}
    >
      {/* Conteneur des images */}
      {slides.map((slide, index) => (
        <div
          key={`${slide.title}_${index}`}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={slide.src}
            layout="constrained"
            width={1200}
            height={1600}
            priority={index === 0}
            alt={slide.src.split('.*')[0]}
            className="h-full w-full object-cover overflow-hidden mask-b-from-60% mask-b-to-95% mask-radial-[100%_100%] mask-radial-from-80% mask-radial-at-right"
          />
          {/* Overlay pour assombrir l'image et mettre le texte en valeur */}
        </div>
      ))}

      {/* Conteneur du texte animé */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 z-10">
        {/* La clé (key) change à chaque slide, forçant SplitText à se remonter et rejouer l'animation GSAP */}
        <SplitText
          key={`title-${currentIndex}`}
          text={slides[currentIndex].title}
          className="text-3xl lg:text-4xl text-shadow-2xs text-shadow-cyan-600 font-bold mb-3 block"
        />

        {/* Animation simple pour la description (un fade up classique) */}
        <div key={`desc-${currentIndex}`} className="overflow-hidden">
          <p className="text-base md:text-lg font-poppins text-white/80 max-w-md animate-fade-up">
            {slides[currentIndex].description}
          </p>
        </div>
      </div>
    </div>
  );
}
