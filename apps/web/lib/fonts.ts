import localFont from 'next/font/local';

/**
 * Police Inter (Sans-serif).
 * Utilise un fichier de police variable pour une flexibilité maximale des graisses.
 * Variable CSS : --font-inter
 */
export const inter = localFont({
  src: '../fonts/Inter/Inter-VariableFont_opsz,wght.ttf',
  variable: '--font-inter',
  display: 'swap',
});

/*
 * Police google sans
 * Utilise un fichier de police variable.
 * Variable CSS: --google-sans*/

export const sans = localFont({
  src: '../fonts/GoogleSans-VariableFont_GRAD,opsz,wght.ttf',
  variable: '--font-sans',
  display: 'swap',
});

/**
 * Police Jost.
 * Utilise un fichier de police variable.
 * Variable CSS : --font-jost
 */
export const jost = localFont({
  src: '../fonts/Jost/Jost-VariableFont_wght.ttf',
  variable: '--font-jost',
  display: 'swap',
});

/**
 * Police Poppins.
 * Chargement des graisses spécifiques car aucun fichier variable n'est disponible.
 * - 400 (Regular)
 * - 600 (SemiBold)
 * - 700 (bold)
 * Variable CSS : --font-poppins
 */
export const poppins = localFont({
  src: [
    {
      path: '../fonts/Poppins/Poppins-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../fonts/Poppins/Poppins-SemiBold.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../fonts/Poppins/Poppins-Black.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-poppins',
  display: 'swap',
});
