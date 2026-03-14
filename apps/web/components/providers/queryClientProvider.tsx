'use client';

import {
  QueryClient,
  PersistQueryClientProvider,
  QueryClientProvider,
} from '@stackschool/ui';
import { useState } from 'react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createIDBPersister } from '@/lib/idb-keyval-setup';

export default function QueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 minute
            gcTime: 1000 * 60 * 60 * 24, // 24 heure de cache
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools
        position="left"
        buttonPosition="bottom-left"
        initialIsOpen={false}
      />
    </QueryClientProvider>
  );
}
