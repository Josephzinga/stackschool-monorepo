import { RelationType } from '@stackschool/shared/src';

export const relationItems: Array<{
  value: RelationType;
  label: string;
}> = [
  { value: 'FATHER', label: 'Père' },
  { value: 'MOTHER', label: 'Mère' },
  { value: 'GUARDIAN', label: 'Tuteur légal' },
  { value: 'GRAND_FATHER', label: 'Grand-père' },
  { value: 'GRAND_MOTHER', label: 'Grand-mère' },
  { value: 'UNCLE', label: 'Oncle' },
  { value: 'AUNT', label: 'Tante' },
  { value: 'OTHER', label: 'Autre' },
];
