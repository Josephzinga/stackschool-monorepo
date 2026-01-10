import './globals.css';
import { ThemeProvider } from '@/components/ui/ThemeProvider';
import { ModeToggle } from '@/components/DropMenu';
import { Toaster } from '@/components/ui/sonner';
import { inter, jost, poppins } from '@/lib/fonts';
import Providers from './providers';

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
      // suppressHydrationWarning est nécessaire car next-themes modifie le DOM côté client
      // pour appliquer le thème, ce qui peut causer des avertissements d'hydratation.
      suppressHydrationWarning
      // Injection des variables CSS pour les polices (Inter, Jost, Poppins)
      className={`${jost.variable}  ${inter.variable} ${poppins.variable}`}
    >
      <body>
        <ThemeProvider attribute="class" enableSystem={false}>
          <Providers>
            {children}

            <Toaster
              position="top-center"
              className="bg-sky-500! text-lg"
              duration={4000}
            />
            <div className="absolute right-4 top-4">
              <ModeToggle />
            </div>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
