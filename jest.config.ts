import { pathsToModuleNameMapper } from 'ts-jest';
import type { Config } from 'jest';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const tsconfigPath = path.resolve(__dirname, './tsconfig.base.json');
const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf-8'));

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  modulePaths: ['<rootDir>'],
  moduleNameMapper: pathsToModuleNameMapper(tsconfig.compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),
  // Ajout de transform pour gérer le TS en ESM si nécessaire
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { useESM: true }],
  },
  extensionsToTreatAsEsm: ['.ts'],
};

export default config;
