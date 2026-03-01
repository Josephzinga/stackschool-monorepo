export const studentStatusConfig = {
  ACTIVE: {
    label: 'Actif',
    color: 'green',
  },
  SUSPENDED: {
    label: 'Suspendu',
    color: 'orange',
  },
  EXPELLED: {
    label: 'Exclu',
    color: 'red',
  },
  TRANSFERRED: {
    label: 'Transféré',
    color: 'blue',
  },
  DROPPED_OUT: {
    label: 'Abandon',
    color: 'purple',
  },
  GRADUATED: {
    label: 'Diplômé',
    color: 'emerald',
  },
  INACTIVE: {
    label: 'Inactif',
    color: 'gray',
  },
  DECEASED: {
    label: 'Décédé',
    color: 'zinc',
  },
} as const;
