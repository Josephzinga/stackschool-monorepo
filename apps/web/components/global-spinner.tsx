'use client';
import { useLoadingStore } from '@stackschool/ui';
import { LoaderOne } from './ui/loader';

export function GlobalSpinner() {
  const isLoading = useLoadingStore((s) => s.isLoading);
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <LoaderOne />
    </div>
  );
}
