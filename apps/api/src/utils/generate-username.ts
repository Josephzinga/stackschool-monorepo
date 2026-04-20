interface UsernameOptions {
  separator?: string; // Séparateur entre prénom et nom (défaut: "")
  maxLength?: number; // Longueur maximale du username
  includeNumbers?: boolean; // Ajouter des nombres aléatoires si doublon
  lowercase?: boolean; // Tout en minuscule (sinon camelCase)
  ignoredChars?: string[]; // Caractères supplémentaires à ignorer
}

const DEFAULT_IGNORED_CHARS = [
  "'",
  '"',
  '-',
  '_',
  ' ',
  '.',
  ',',
  ';',
  ':',
  '!',
  '?',
  '@',
  '#',
  '$',
  '%',
  '&',
  '*',
  '(',
  ')',
  '[',
  ']',
  '{',
  '}',
  '/',
  '\\',
  '|',
  '<',
  '>',
  '+',
  '=',
  '~',
  '`',
  '^',
];

function normalizeString(str: string, ignoredChars: string[]): string {
  return str
    .normalize('NFD') // Décompose les accents
    .replace(/[\u0300-\u036f]/g, '') // Supprime les diacritiques
    .split('')
    .filter((char) => !ignoredChars.includes(char))
    .join('');
}

function capitalizeFirst(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function generateUsername(
  firstname: string,
  lastname: string,
  options: UsernameOptions = {},
): string {
  const {
    separator = '',
    maxLength = 20,
    includeNumbers = false,
    lowercase = false,
    ignoredChars = [],
  } = options;

  // Fusionner les caractères ignorés par défaut avec ceux fournis
  const allIgnoredChars = [
    ...new Set([...DEFAULT_IGNORED_CHARS, ...ignoredChars]),
  ];

  // Nettoyer et normaliser
  let cleanFirst = normalizeString(firstname.trim(), allIgnoredChars);
  let cleanLast = normalizeString(lastname.trim(), allIgnoredChars);

  // Capitaliser la première lettre de chaque partie
  cleanFirst = capitalizeFirst(cleanFirst);
  cleanLast = capitalizeFirst(cleanLast);

  let username: string;

  if (lowercase) {
    // Format: johnsmith
    username = `${cleanFirst.toLowerCase()}${separator}${cleanLast.toLowerCase()}`;
  } else {
    // Format: JohnSmith (camelCase par défaut)
    username = `${cleanFirst}${separator}${cleanLast}`;
  }

  // Tronquer si nécessaire
  if (username.length > maxLength) {
    username = username.substring(0, maxLength);
  }

  // Ajouter des nombres si demandé (pour éviter les doublons)
  if (includeNumbers) {
    const randomNum = Math.floor(Math.random() * 999) + 1;
    const numStr = randomNum.toString().padStart(3, '0');
    const availableSpace = maxLength - numStr.length;
    username = username.substring(0, availableSpace) + numStr;
  }

  return username;
}

export function generateUsernameVariants(
  firstname: string,
  lastname: string,
  count: number = 3,
): string[] {
  const variants: string[] = [];
  const separators = ['', '.', '_', '-'];

  for (let i = 0; i < Math.min(count, separators.length); i++) {
    variants.push(
      generateUsername(firstname, lastname, {
        separator: separators[i],
        lowercase: i % 2 === 1,
      }),
    );
  }

  if (count > separators.length) {
    variants.push(
      generateUsername(firstname, lastname, {
        includeNumbers: true,
        maxLength: 20,
      }),
    );
  }

  return variants;
}
