export const API_URL = 'https://fermaconnect-api.onrender.com/api';

export const CATEGORIES = [
  { label: 'All',        value: ''           },
  { label: 'Vegetables', value: 'vegetables' },
  { label: 'Fruits',     value: 'fruits'     },
  { label: 'Dairy',      value: 'dairy'      },
  { label: 'Meat',       value: 'meat'       },
  { label: 'Honey',      value: 'honey'      },
  { label: 'Eggs',       value: 'eggs'       },
  { label: 'Grains',     value: 'grains'     },
  { label: 'Herbs',      value: 'herbs'      },
  { label: 'Other',      value: 'other'      },
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