"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUsername = generateUsername;
exports.generateUsernameVariants = generateUsernameVariants;
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
function normalizeString(str, ignoredChars) {
    return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .split('')
        .filter((char) => !ignoredChars.includes(char))
        .join('');
}
function capitalizeFirst(str) {
    if (!str)
        return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
function generateUsername(firstname, lastname, options = {}) {
    const { separator = '', maxLength = 20, includeNumbers = false, lowercase = false, ignoredChars = [], } = options;
    const allIgnoredChars = [
        ...new Set([...DEFAULT_IGNORED_CHARS, ...ignoredChars]),
    ];
    let cleanFirst = normalizeString(firstname.trim(), allIgnoredChars);
    let cleanLast = normalizeString(lastname.trim(), allIgnoredChars);
    cleanFirst = capitalizeFirst(cleanFirst);
    cleanLast = capitalizeFirst(cleanLast);
    let username;
    if (lowercase) {
        username = `${cleanFirst.toLowerCase()}${separator}${cleanLast.toLowerCase()}`;
    }
    else {
        username = `${cleanFirst}${separator}${cleanLast}`;
    }
    if (username.length > maxLength) {
        username = username.substring(0, maxLength);
    }
    if (includeNumbers) {
        const randomNum = Math.floor(Math.random() * 999) + 1;
        const numStr = randomNum.toString().padStart(3, '0');
        const availableSpace = maxLength - numStr.length;
        username = username.substring(0, availableSpace) + numStr;
    }
    return username;
}
function generateUsernameVariants(firstname, lastname, count = 3) {
    const variants = [];
    const separators = ['', '.', '_', '-'];
    for (let i = 0; i < Math.min(count, separators.length); i++) {
        variants.push(generateUsername(firstname, lastname, {
            separator: separators[i],
            lowercase: i % 2 === 1,
        }));
    }
    if (count > separators.length) {
        variants.push(generateUsername(firstname, lastname, {
            includeNumbers: true,
            maxLength: 20,
        }));
    }
    return variants;
}
//# sourceMappingURL=generate-username.js.map