import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays } from 'lucide-react';

export function TodaySubjects() {
  return (
    <div className="md:col-span-2">
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-lg font-poppins font-medium text-primary" />
            Cours d'aujourd'hui
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Placeholder pour les cours du jour */}
            <div className="flex items-center p-3 border rounded-lg bg-accent">
              <div className="w-20 font-mono text-sm font-medium">08:00</div>
              <div className="w-1 h-8 bg-primary/20 mx-4 rounded-full"></div>
              <div>
                <p className="font-medium">Mathématiques</p>
                <p className="text-sm text-muted-foreground">M. Dupont</p>
              </div>
            </div>
            <div className="flex items-center p-3 border rounded-lg bg-accent">
              <div className="w-20 font-mono text-sm font-medium">10:00</div>
              <div className="w-1 h-8 bg-primary/20 mx-4 rounded-full"></div>
              <div>
                <p className="font-medium">Français</p>
                <p className="text-sm text-muted-foreground">Mme Martin</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground text-center pt-4">
              Voir l'emploi du temps complet pour plus de détails.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
