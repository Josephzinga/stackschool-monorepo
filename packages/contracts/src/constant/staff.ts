import { StaffPosition } from '../core';

export const staffPositonConstant: Record<StaffPosition, string> = {
  SECRETARY: 'Secrétaire',
  GUARDIAN: 'Gardien / Gardienne',
  SUPERVISOR: 'Surveillant(e)',
  ACCOUNTANT: 'Comptable',
  LIBRARIAN: 'Bibliothécaire',
  NURSE: 'Infirmier / Infirmière',
  CLEANER: 'Agent d’entretien',
  MAINTENANCE: 'Technicien de maintenance',
  OTHER: 'Autre',
};

export const staffPositionOptions: { value: StaffPosition; label: string }[] =
  Object.keys(staffPositonConstant).map((position) => ({
    value: position as StaffPosition,
    label: staffPositonConstant[position as StaffPosition],
  }));
