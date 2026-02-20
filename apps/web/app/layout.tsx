import './styles/globals.css';
import './styles/search-input.css';
import { ThemeProvider } from '@/components/ui/ThemeProvider';
import { Toaster } from '@/components/ui/sonner';
import { inter, jost, poppins, sans } from '@/lib/fonts';
import QueryProvider from '@/components/providers/queryClientProvider';

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
        <ThemeProvider attribute="class" enableSystem={false}>
          <QueryProvider>
            {children}

            <Toaster
              position="top-center"
              className="bg-sky-500! text-lg"
              duration={4000}
              id="layout"
            />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
