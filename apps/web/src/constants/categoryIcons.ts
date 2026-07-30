const BASE = 'https://api.iconify.design'
const PARAMS = '?color=%23666666&width=100&height=100'

function iconUrl(set: string, name: string): string {
  return `${BASE}/${set}:${name}.svg${PARAMS}`
}

// All available category icons, keyed by semantic name.
// Add entries here to make new icons available throughout the app.
export const CATEGORY_ICONS = {
  // Food & Dining
  utensils: iconUrl('lucide', 'utensils'),
  coffee: iconUrl('lucide', 'coffee'),
  sandwich: iconUrl('lucide', 'sandwich'),
  'chef-hat': iconUrl('lucide', 'chef-hat'),
  cookie: iconUrl('lucide', 'cookie'),

  // Shopping
  'shopping-bag': iconUrl('lucide', 'shopping-bag'),
  shirt: iconUrl('lucide', 'shirt'),
  'book-open': iconUrl('lucide', 'book-open'),
  smartphone: iconUrl('lucide', 'smartphone'),

  // Transportation
  car: iconUrl('lucide', 'car'),
  bus: iconUrl('lucide', 'bus'),
  taxi: iconUrl('lucide', 'car-taxi-front'),
  fuel: iconUrl('lucide', 'fuel'),
  parking: iconUrl('lucide', 'square-parking'),

  // Entertainment
  music: iconUrl('lucide', 'music'),
  film: iconUrl('lucide', 'film'),
  'gamepad-2': iconUrl('lucide', 'gamepad-2'),

  // Healthcare
  'heart-pulse': iconUrl('lucide', 'heart-pulse'),
  stethoscope: iconUrl('lucide', 'stethoscope'),
  pill: iconUrl('lucide', 'pill'),

  // Education
  'graduation-cap': iconUrl('lucide', 'graduation-cap'),
  school: iconUrl('lucide', 'school'),
  book: iconUrl('lucide', 'book'),

  // Finance / Income
  banknote: iconUrl('lucide', 'banknote'),
  wallet: iconUrl('lucide', 'wallet'),
  clock: iconUrl('lucide', 'clock'),
  gift: iconUrl('lucide', 'gift'),
  'trending-up': iconUrl('lucide', 'trending-up'),
  'line-chart': iconUrl('lucide', 'line-chart'),
  'file-text': iconUrl('lucide', 'file-text'),
  building: iconUrl('lucide', 'building'),

  // Work / Business
  briefcase: iconUrl('lucide', 'briefcase'),
  laptop: iconUrl('lucide', 'laptop'),
  users: iconUrl('lucide', 'users'),

  // Pets
  'paw-print': iconUrl('lucide', 'paw-print'),
  dog: iconUrl('lucide', 'dog'),
  cat: iconUrl('lucide', 'cat'),

  // Supplies
  package: iconUrl('lucide', 'package'),
  box: iconUrl('lucide', 'box'),
  wrench: iconUrl('lucide', 'wrench'),
  sparkles: iconUrl('lucide', 'sparkles'),

  // Activities
  calendar: iconUrl('lucide', 'calendar'),
  ticket: iconUrl('lucide', 'ticket'),
  trophy: iconUrl('lucide', 'trophy'),
  activity: iconUrl('lucide', 'activity'),

  // Daily / Utilities
  home: iconUrl('lucide', 'home'),
  droplet: iconUrl('lucide', 'droplet'),
  zap: iconUrl('lucide', 'zap'),
  phone: iconUrl('lucide', 'phone'),
  wifi: iconUrl('lucide', 'wifi'),
  baby: iconUrl('lucide', 'baby'),
  plane: iconUrl('lucide', 'plane'),
  'map-pin': iconUrl('lucide', 'map-pin'),
  receipt: iconUrl('lucide', 'receipt'),
  scissors: iconUrl('lucide', 'scissors'),

  // Misc
  'plus-circle': iconUrl('lucide', 'plus-circle'),
  'credit-card': iconUrl('lucide', 'credit-card'),
  undo: iconUrl('lucide', 'undo'),
} as const

export type CategoryIconKey = keyof typeof CATEGORY_ICONS

export const DEFAULT_CATEGORY_ICON_KEY: CategoryIconKey = 'plus-circle'
