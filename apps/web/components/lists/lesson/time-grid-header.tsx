import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ViewType } from '@/types/lessons-types';
import React from 'react';
import { cn } from '@/lib/utils';

interface TimeGridHeaderProps {
  // Navigation
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  // Vue
  currentView: ViewType;
  isResourceView: boolean;
  onChangeView: (view: ViewType) => void;
  // Affichage
  currentDateTitle?: string;
  showNavigation?: boolean;
  showViewButtons?: boolean;
  // Désactivation conditionnelle (pour vues timeGrid)
  disableNonResourceViews?: boolean; // si true, désactive les boutons Jour/Semaine
  hideResourceViewButtons?: boolean;
}

export function TimeGridHeader({
  onPrev,
  onNext,
  onToday,
  currentView,
  isResourceView,
  onChangeView,
  currentDateTitle,
  showNavigation = true,
  showViewButtons = true,
  disableNonResourceViews = false,
  hideResourceViewButtons = false,
}: TimeGridHeaderProps) {
  return (
    <div className="flex flex-col gap-2 p-2 border shadow-sm  bg-muted/80 rounded-md mb-2 md:flex-row md:items-center md:justify-between">
      {/* Groupe gauche : navigation */}
      {showNavigation && (
        <div className="flex items-center gap-1">
          <ButtonGroup>
            <Button
              variant="outline"
              size="sm"
              onClick={onPrev}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onNext}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </ButtonGroup>
          <Button
            variant="outline"
            size="sm"
            onClick={onToday}
            className="h-8 px-2 text-xs"
          >
            Aujourd'hui
          </Button>
        </div>
      )}
      {/* Titre de la période (optionnel) */}
      {currentDateTitle && (
        <div className="text-sm font-medium text-center md:text-left">
          {currentDateTitle}
        </div>
      )}
      {/* Groupe droit : boutons de changement de vue */}
      {showViewButtons && (
        <div className="flex flex-wrap gap-2 md:gap-3 justify-center md:justify-end">
          <Button
            size="sm"
            variant={
              !isResourceView && currentView === 'timeGridDay'
                ? 'default'
                : 'outline'
            }
            onClick={() => onChangeView('timeGridDay')}
            disabled={disableNonResourceViews}
            className="h-8 px-2 text-xs"
          >
            Jour
          </Button>

          <Button
            size="sm"
            variant={
              !isResourceView && currentView === 'timeGridWeek'
                ? 'default'
                : 'outline'
            }
            onClick={() => onChangeView('timeGridWeek')}
            className={cn('h-8 px-2 text-xs')}
            disabled={disableNonResourceViews}
          >
            Semaine
          </Button>

          {!hideResourceViewButtons && (
            <>
              <Button
                size="sm"
                variant={
                  isResourceView && currentView === 'resourceTimelineDay'
                    ? 'default'
                    : 'outline'
                }
                onClick={() => onChangeView('resourceTimelineDay')}
                className="h-8 px-2 text-xs"
              >
                Timeline Jour
              </Button>
              <Button
                size="sm"
                variant={
                  isResourceView && currentView === 'resourceTimelineWeek'
                    ? 'default'
                    : 'outline'
                }
                onClick={() => onChangeView('resourceTimelineWeek')}
                className="h-8 px-2 text-xs"
              >
                Timeline Semaine
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
