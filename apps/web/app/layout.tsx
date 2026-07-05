import './styles/globals.css';
import './styles/search-input.css';
import NextTopLoader from 'nextjs-toploader';
import { ThemeProvider } from '@/components/ui/ThemeProvider';
import { Toaster } from '@/components/ui/sonner';
import { inter, jost, poppins, sans } from '@/lib/fonts';
import QueryProvider from '@/components/providers/queryClientProvider';
import { NuqsAdapter } from 'nuqs/adapters/next';
import CsrfProvider from '@/components/providers/csrf-provider';

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
      className={`${jost.variable}  ${inter.variable} ${poppins.variable} ${sans.variable}`}
    >
      <body>
        <QueryProvider>
          <ThemeProvider attribute="class" enableSystem={false}>
            <NuqsAdapter>
              <CsrfProvider>{children}</CsrfProvider>
            </NuqsAdapter>
            <NextTopLoader />
            <Toaster
              position="top-center"
              className="bg-sky-500! text-lg"
              duration={4000}
            />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
