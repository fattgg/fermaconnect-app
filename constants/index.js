export const API_URL = 'https://fermaconnect-api.onrender.com/api';

export const CATEGORIES = [
  { label: 'all',        value: ''           },
  { label: 'vegetables', value: 'vegetables' },
  { label: 'fruits',     value: 'fruits'     },
  { label: 'dairy',      value: 'dairy'      },
  { label: 'meat',       value: 'meat'       },
  { label: 'honey',      value: 'honey'      },
  { label: 'eggs',       value: 'eggs'       },
  { label: 'grains',     value: 'grains'     },
  { label: 'herbs',      value: 'herbs'      },
  { label: 'other',      value: 'other'      },
];

export const MUNICIPALITIES = [
  'Pristina',
  'Prizren',
  'Peja',
  'Gjakova',
  'Gjilan',
  'Mitrovica',
  'Ferizaj',
  'Podujeva',
  'Vushtrri',
  'Suhareka',
  'Rahovec',
  'Drenas',
  'Lipjan',
  'Malisheva',
  'Kamenica',
];

export const ORDER_STATUS_COLORS = {
  pending:   '#F4A261',
  accepted:  '#52B788',
  rejected:  '#E63946',
  completed: '#2D6A4F',
};

export const ORDER_STATUS_LABELS = {
  pending:   'Pending',
  accepted:  'Accepted',
  rejected:  'Rejected',
  completed: 'Completed',
};