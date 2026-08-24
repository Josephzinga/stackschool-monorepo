interface GenerateUsernameOptions {
    firstName: string;
    lastName: string;
    /** Ajoute un suffixe numérique aléatoire (ex: .482) - Défaut: false */
    includeSuffix?: boolean;
    /** Longueur du suffixe numérique - Défaut: 3 */
    suffixLength?: number;
}

/**
 * Nettoie une chaîne : enlève les accents, les caractères spéciaux et passe en minuscules.
 */
function sanitizeString(str: string): string {
    return str
        .trim()
        .normalize('NFD')                     // Décompose les caractères accentués (ex: 'é' -> 'e' + '´')
        .replace(/[\u0300-\u036f]/g, '')     // Supprime les signes diacritiques (accents)
        .toLowerCase()                        // Convertit en minuscules
        .replace(/[^a-z0-9]/g, '');           // Ne garde que les lettres et chiffres
}

/**
 * Génère un username au format standard (ex: "prenom.nom" ou "p.nom")
 */
export function generateUsername({
                                     firstName,
                                     lastName,
                                     includeSuffix = false,
                                     suffixLength = 3,
                                 }: GenerateUsernameOptions): string {
    const cleanFirst = sanitizeString(firstName);
    const cleanLast = sanitizeString(lastName);

    if (!cleanFirst && !cleanLast) {
        throw new Error('Au moins le prénom ou le nom doit contenir des caractères valides.');
    }

    // Construction du nom d'utilisateur de base : "prenom.nom"
    let baseUsername = '';

    if (cleanFirst && cleanLast) {
        baseUsername = `${cleanFirst}.${cleanLast}`;
    } else {
        baseUsername = cleanFirst || cleanLast;
    }

    // Ajout facultatif d'un suffixe aléatoire
    if (includeSuffix) {
        const min = Math.pow(10, suffixLength - 1);
        const max = Math.pow(10, suffixLength) - 1;
        const randomNumber = Math.floor(min + Math.random() * (max - min + 1));
        return `${baseUsername}${randomNumber}`;
    }

    return baseUsername;
}
