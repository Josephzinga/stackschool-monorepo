'use client';
import CalendarDisplay from '@/components/bg-calendar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { IconWrapper } from '@/components/animate-ui/icons/icon';
import { MoreHorizontal } from 'lucide-react';
import { LectureCard } from '@/components/lecture-card';

export default function EventSection() {
  return (
    <Card className="h-screen! lg:flex md:max-w-120 px-2 w-full xl:w-[30%]  mt-4 border">
      <div className="flex justify-center w-full items-center h-100 text-center text-lg">
        <CalendarDisplay />
      </div>
      <div className="w-full flex flex-col gap-4">
        <div className="flex justify-between ">
          <h3>Today's Lecture</h3>
          <Button variant="ghost">
            <IconWrapper icon={MoreHorizontal} />
          </Button>
        </div>
        <LectureCard
          classe="11ème"
          title="Ensemble N des entiers naturel"
          chapter={1}
          time="8:30 - 9:10"
          subject="Mathématique"
        />
        <LectureCard
          subject="Histoire"
          classe="10ème B"
          time="8:00 - 9:30"
          title="Histoire de la guerre mondial"
          chapter={4}
        />
      </div>
    </Card>
  );
}
