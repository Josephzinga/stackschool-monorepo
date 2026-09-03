'use client';
import { Button } from '@/components/ui/button';
import { motion } from 'motion/react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import React from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ResourceCellInfo } from '@fullcalendar/react-scheduler';
import { Clock, MapPin } from 'lucide-react';

interface ResourceWithDetails {
  id: string;
  title: string;
  totalHours?: number;
  lessons?: Array<{
    subject: string;
    day: string;
    start: string;
    end: string;
    room?: string;
  }>;
}

export function RenderResourceContent({
  resource,
  onClick,
}: {
  resource: ResourceCellInfo['resource'];
  onClick: (r: any) => void;
}) {
  console.log('Resource', resource);
  console.log('Events', resource?.getEvents());
  const weeklyHours = resource?._resource.extendedProps?.weeklyHours;
  return (
    <Popover>
      <div className="flex flex-col py-1 px-2 group cursor-pointer hover:bg-accent/50 transition-colors">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClick(resource);
          }}
          className="font-semibold text-sm truncate"
        >
          {resource?._resource?.title}
        </button>
      </div>

      <div
        className="flex items-center group justify-between
        "
      >
        <PopoverTrigger asChild>
          <Button
            variant="link"
            className="text-[10px] text-primary opacity-0 group-hover:opacity-100 transition-opacity"
          >
            Détails
          </Button>
        </PopoverTrigger>
        <span
          className={`text-[10px] px-1 mt-1.5 rounded ${
            weeklyHours > 8
              ? 'bg-red-100 text-red-700'
              : 'bg-green-100' + ' text-green-700'
          }`}
        >
          {weeklyHours}h
        </span>
      </div>

      <PopoverContent className="w-80 p-3">
        <div className="space-y-2">
          <h4 className="font-semibold">{resource.title}</h4>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
            <span>{resource.totalHours} heures cette semaine</span>
          </div>
          {resource.lessons && resource.lessons.length > 0 && (
            <div className="mt-2 border-t pt-2">
              <p className="text-xs font-medium mb-1">Cours à venir :</p>
              <ul className="text-xs space-y-1">
                {resource.lessons.slice(0, 3).map((lesson, idx) => (
                  <li key={idx} className="flex justify-between">
                    <span>
                      {lesson.day} {lesson.start}-{lesson.end}
                    </span>
                    <span className="font-medium">{lesson.subject}</span>
                    {lesson.room && (
                      <span className="text-muted-foreground">
                        <MapPin className="inline h-3 w-3" /> {lesson.room}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export const TimeGridContaine = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{
      duration: 0.5,
      delay: 0.2,
      ease: 'linear' as const,
    }}
  >
    {children}
  </motion.div>
);
export const TimeGridContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(
      containerRef.current,
      {
        opacity: 0,
        x: -50,
        duration: 0.5,
      },
      {
        opacity: 1,
        x: 0,
        duration: 0.4,
        ease: 'power1.in',
      },
    );
  });
  return (
    <div ref={containerRef} className="lesson-container">
      {children}
    </div>
  );
};
