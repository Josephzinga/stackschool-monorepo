'use client';

import { cn } from '@/lib/utils';
import { AttendanceMode } from '@/types/attendance';
import { Briefcase, GraduationCap, Users } from 'lucide-react';
import { useRef, useEffect } from 'react';
import gsap from 'gsap';

const modes: { value: AttendanceMode; label: string; icon: React.ReactNode }[] =
  [
    {
      value: 'STUDENT',
      label: 'Élèves',
      icon: <GraduationCap className="h-4 w-4" />,
    },
    {
      value: 'TEACHER',
      label: 'Enseignants',
      icon: <Users className="h-4 w-4" />,
    },
    {
      value: 'STAFF',
      label: 'Personnel',
      icon: <Briefcase className="h-4 w-4" />,
    },
  ];

interface ModeButtonGroupProps {
  activeMode: AttendanceMode;
  onModeChange: (mode: AttendanceMode) => void;
}

export function ModeButtonGroup({
  activeMode,
  onModeChange,
}: ModeButtonGroupProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const prevActiveIndex = useRef<number>(-1);

  const activeIndex = modes.findIndex((m) => m.value === activeMode);

  // Animation de l'indicateur au montage et au changement de mode
  useEffect(() => {
    if (!indicatorRef.current || !containerRef.current || activeIndex === -1)
      return;

    const activeButton = buttonRefs.current[activeIndex];
    if (!activeButton) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const buttonRect = activeButton.getBoundingClientRect();

    const left = buttonRect.left - containerRect.left;
    const width = buttonRect.width;

    // Animation GSAP fluide
    gsap.to(indicatorRef.current, {
      x: left,
      width: width,
      duration: 0.4,
      ease: 'power2.inOut',
      overwrite: 'auto',
    });

    // Animation des textes (opacité / échelle) si on change de mode
    if (
      prevActiveIndex.current !== -1 &&
      prevActiveIndex.current !== activeIndex
    ) {
      const prevButton = buttonRefs.current[prevActiveIndex.current];
      const currentButton = buttonRefs.current[activeIndex];
      if (prevButton) {
        gsap.to(prevButton.querySelector('.btn-label'), {
          scale: 0.9,
          opacity: 0.5,
          duration: 0.2,
          ease: 'power2.out',
        });
      }
      if (currentButton) {
        gsap.fromTo(
          currentButton.querySelector('.btn-label'),
          { scale: 0.9, opacity: 0.5 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.3,
            ease: 'power2.out',
            delay: 0.1,
          },
        );
      }
    } else if (prevActiveIndex.current === -1) {
      // Premier montage : apparaître
      gsap.fromTo(
        indicatorRef.current,
        { scaleX: 0.8, opacity: 0.5 },
        { scaleX: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.7)' },
      );
      const activeBtn = buttonRefs.current[activeIndex];
      if (activeBtn) {
        gsap.fromTo(
          activeBtn.querySelector('.btn-label'),
          { scale: 0.8, opacity: 0.3 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.4,
            ease: 'back.out(1.7)',
            delay: 0.1,
          },
        );
      }
    }

    prevActiveIndex.current = activeIndex;
  }, [activeIndex]);

  // Animation au survol des boutons (effet de "lift")
  const handleMouseEnter = (index: number) => {
    if (index === activeIndex) return; // pas d'effet sur le bouton actif
    const btn = buttonRefs.current[index];
    if (btn) {
      gsap.to(btn, {
        y: -2,
        scale: 1.02,
        duration: 0.2,
        ease: 'power2.out',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      });
    }
  };

  const handleMouseLeave = (index: number) => {
    if (index === activeIndex) return;
    const btn = buttonRefs.current[index];
    if (btn) {
      gsap.to(btn, {
        y: 0,
        scale: 1,
        duration: 0.2,
        ease: 'power2.out',
        boxShadow: 'none',
      });
    }
  };

  // Animation au clic (effet "press")
  const handleClick = (mode: AttendanceMode, index: number) => {
    const btn = buttonRefs.current[index];
    if (btn) {
      gsap.to(btn, {
        scale: 0.95,
        duration: 0.1,
        ease: 'power2.in',
        onComplete: () => {
          gsap.to(btn, {
            scale: 1,
            duration: 0.15,
            ease: 'power2.out',
          });
        },
      });
    }
    onModeChange(mode);
  };

  return (
    <div
      ref={containerRef}
      className="relative inline-flex rounded-xl bg-muted/60 p-1 shadow-inner backdrop-blur-sm w-full sm:w-auto"
    >
      {/* Indicateur animé (fond du bouton actif) */}
      <div
        ref={indicatorRef}
        className="absolute top-1 bottom-1 rounded-lg bg-background shadow-md ring-1 ring-border/50"
        style={{ width: '0px', left: '0px' }}
      />

      {modes.map((mode, index) => {
        const isActive = index === activeIndex;
        return (
          <button
            key={mode.value}
            ref={(el) => {
              buttonRefs.current[index] = el;
            }}
            onClick={() => handleClick(mode.value, index)}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={() => handleMouseLeave(index)}
            className={cn(
              'relative z-10 flex cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
              'min-w-25 sm:min-w-30',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
              isActive
                ? 'text-foreground'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <span className="flex items-center gap-1.5 btn-label">
              {mode.icon}
              <span className="sm:inline">{mode.label}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
