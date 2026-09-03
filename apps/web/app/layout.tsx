import './styles/globals.css';
import './styles/search-input.css';
import NextTopLoader from 'nextjs-toploader';
import { ThemeProvider } from '@/components/ui/ThemeProvider';
import { Toaster } from '@/components/ui/toast';
import QueryProvider from '@/components/providers/queryClientProvider';
import { NuqsAdapter } from 'nuqs/adapters/next';
import CsrfProvider from '@/components/providers/csrf-provider';
import {
  Geist,
  Jost,
  Noto_Serif,
  Poppins,
  Public_Sans,
} from 'next/font/google';
import { cn } from '@/lib/utils';
import { GlobalSpinner } from '@/components/global-spinner';
import React from 'react';

const publicSansHeading = Public_Sans({
  subsets: ['latin'],
  variable: '--font-heading',
});

const notoSerif = Noto_Serif({
  subsets: ['latin'],
  variable: '--font-serif',
  weight: ['400', '500', '600', '700'],
});

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  weight: ['400', '500', '600', '700'],
});
const jost = Jost({
  subsets: ['latin'],
  variable: '--font-jost',
  weight: ['400', '500', '600', '700'],
});
const inter = Jost({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'],
});

/**
 * RootLayout est le composant racine de l'application.
 * Il définit la structure HTML de base, injecte les polices globales
 * et configure les fournisseurs de contexte (comme le thème).
 */
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      suppressHydrationWarning
      className={cn(
        jost.variable,
        inter.variable,
        poppins.variable,
        geist.variable,
        'font-serif',
        notoSerif.variable,
        publicSansHeading.variable,
      )}
    >
      <body>
        <QueryProvider>
          <NuqsAdapter>
            <ThemeProvider
              attribute="class"
              enableSystem={true}
              defaultTheme="system"
            >
              {' '}
              <CsrfProvider>{children}</CsrfProvider>
              <GlobalSpinner />
              <Toaster />
            </ThemeProvider>
          </NuqsAdapter>
          <NextTopLoader />
        </QueryProvider>
      </body>
    </html>
  );
}
