import { RelationType } from '../core';

export const relationTypeConstant: Record<RelationType, string> = {
  FATHER: 'Père',
  MOTHER: 'Mère',
  GUARDIAN: 'Tuteur légal',
  UNCLE: 'Oncle',
  OTHER: 'Autre',
  GRAND_MOTHER: 'Grand-mère',
  GRAND_FATHER: 'Grand-père',
  AUNT: 'Tante',
} as const;
export const relationTypeOptions = [
  { value: 'FATHER', label: 'Père' },
  { value: 'MOTHER', label: 'Mère' },
  { value: 'GUARDIAN', label: 'Tuteur légal' },
  { value: 'UNCLE', label: 'Oncle' },
  { value: 'AUNT', label: 'Tante' },
  { value: 'GRAND_FATHER', label: 'Grand-père' },
  { value: 'GRAND_MOTHER', label: 'Grand-mère' },
  { value: 'OTHER', label: 'Autre' },
] as const;
