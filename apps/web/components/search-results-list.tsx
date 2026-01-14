import React, { useRef } from 'react';
import { cn } from '@/lib/utils';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface SearchResultsListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  onSelect: (item: T) => void;
  className?: string;
  emptyMessage?: string;
}

export function SearchResultsList<T extends { id: string | number }>({
  items,
  renderItem,
  onSelect,
  className,
}: SearchResultsListProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!items.length || !containerRef.current) return;

    const children = containerRef.current.children;

    // Animation simple et robuste : on part de 0 vers 1
    gsap.fromTo(children, 
      { autoAlpha: 0, y: -10 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.3,
        stagger: 0.05,
        ease: 'power2.out',
        clearProps: 'all' // Nettoie les styles inline après l'animation pour éviter les conflits
      }
    );

  }, { dependencies: [items], scope: containerRef });

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        'absolute z-50 w-full mt-1 border rounded-md bg-white dark:bg-slate-900 shadow-lg max-h-60 overflow-y-auto overflow-x-hidden',
        className
      )}
    >
      {items.map((item) => (
        <div
          key={item.id}
          className={cn(
            'cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-800',
            'border-b last:border-0 border-slate-100 dark:border-slate-800'
          )}
          onClick={() => onSelect(item)}
        >
          {renderItem(item)}
        </div>
      ))}
    </div>
  );
}
