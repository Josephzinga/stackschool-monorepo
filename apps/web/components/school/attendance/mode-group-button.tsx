'use client';

import { cn } from '@/lib/utils';
import { AttendanceMode } from '@/types/attendance';
import { Briefcase, GraduationCap, Users } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';

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
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 5 }}
      transition={{ duration: 0.2, delay: 0.05 }}
      className="inline-flex rounded-lg border bg-muted p-1 max-w-md"
    >
      {modes.map((mode, i) => (
        <button
          key={mode.value}
          onClick={() => onModeChange(mode.value)}
          className={cn(
            'inline-flex cursor-pointer items-center w-full gap-2 rounded-md px-6 py-1.5 text-sm font-medium transition-all',
            activeMode === mode.value
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          {mode.icon}
          {mode.label}
        </button>
      ))}
    </motion.div>
  );
}
