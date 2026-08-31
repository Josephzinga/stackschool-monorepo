'use client';

import { QueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createIDBPersister } from '@/lib/idb-keyval-setup';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';

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
            networkMode: 'offlineFirst',
          },
        },
      }),
  );

  const persister = createIDBPersister();

  return (
    <PersistQueryClientProvider
      persistOptions={{ persister }}
      client={queryClient}
    >
      {children}
      <ReactQueryDevtools
        position="left"
        buttonPosition="bottom-left"
        initialIsOpen={false}
      />
    </PersistQueryClientProvider>
  );
}
