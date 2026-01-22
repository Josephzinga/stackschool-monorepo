'use client';

import { QueryClient, QueryClientProvider } from '@stackschool/ui';
import { useState } from 'react';

export default function QueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // On utilise un state pour s'assurer que chaque requête a son propre QueryClient
  // et éviter de partager les données entre différents utilisateurs sur le serveur
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
