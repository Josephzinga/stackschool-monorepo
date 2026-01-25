import { LucideCircleCheck } from 'lucide-react';

interface LectureCardProps {
  subject: string;
  classe: string;
  time: string;
  title: string;
  chapter: number;
  status?: 'COMPLETE' | 'PENDING' | 'CANCELED';
}

export function LectureCard({
  classe,
  time,
  title,
  subject,
  chapter,
  status,
}: LectureCardProps) {
  return (
    <div className="bg-white space-y-4 rounded-lg px-4 py-4 border-l-4 even:border-chart-2 odd:border-chart-5 ">
      <div className="flex justify-between">
        <div className="flex gap-2">
          <p>{classe}</p>
          <p className="font-poppins font-semibold">{subject}</p>
        </div>
        <div>{time}</div>
      </div>
      <div className="flex gap-2 font-poppins">
        <LucideCircleCheck className="text-primary" />
        <p className="text-foreground/60">Chapitre - {chapter}</p>
        <p>{title}</p>
      </div>
    </div>
  );
}