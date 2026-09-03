import type { Config } from 'jest';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const tsconfigPath = path.resolve(__dirname, './tsconfig.base.json');
const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf-8'));

const config: Config = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  modulePaths: ['<rootDir>'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  // Ajout de transform pour gérer le TS en ESM si nécessaire
  transform: {
    '^.+\\.(ts|js)$': ['ts-jest', { useESM: true }],
  },
  extensionsToTreatAsEsm: ['.ts'],
};

export default config;
