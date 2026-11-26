import {
  Activity,
  Baby,
  Banknote,
  Book,
  BookOpen,
  Box,
  Briefcase,
  Building,
  Bus,
  Calendar,
  Car,
  CarTaxiFront,
  Cat,
  ChartLine,
  ChefHat,
  CirclePlus,
  Clock,
  Coffee,
  Cookie,
  CreditCard,
  Dog,
  Droplet,
  FileText,
  Film,
  Fuel,
  Gamepad2,
  Gift,
  GraduationCap,
  HeartPulse,
  Home,
  Laptop,
  MapPin,
  Music,
  Package,
  PawPrint,
  Phone,
  Pill,
  Plane,
  Receipt,
  Sandwich,
  School,
  Scissors,
  Shapes,
  Shirt,
  ShoppingBag,
  Smartphone,
  Sparkles,
  SquareParking,
  Stethoscope,
  Ticket,
  TrendingUp,
  Trophy,
  Undo,
  Users,
  Utensils,
  Wallet,
  Wifi,
  Wrench,
  Zap,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export const BUILTIN_CATEGORY_ICONS = {
  // Food & Dining
  utensils: Utensils,
  coffee: Coffee,
  sandwich: Sandwich,
  'chef-hat': ChefHat,
  cookie: Cookie,

  // Shopping
  'shopping-bag': ShoppingBag,
  shirt: Shirt,
  'book-open': BookOpen,
  smartphone: Smartphone,

  // Transportation
  car: Car,
  bus: Bus,
  taxi: CarTaxiFront,
  fuel: Fuel,
  parking: SquareParking,

  // Entertainment
  music: Music,
  film: Film,
  'gamepad-2': Gamepad2,

  // Healthcare
  'heart-pulse': HeartPulse,
  stethoscope: Stethoscope,
  pill: Pill,

  // Education
  'graduation-cap': GraduationCap,
  school: School,
  book: Book,

  // Finance / Income
  banknote: Banknote,
  wallet: Wallet,
  clock: Clock,
  gift: Gift,
  'trending-up': TrendingUp,
  'line-chart': ChartLine,
  'file-text': FileText,
  building: Building,

  // Work / Business
  briefcase: Briefcase,
  laptop: Laptop,
  users: Users,

  // Pets
  'paw-print': PawPrint,
  dog: Dog,
  cat: Cat,

  // Supplies
  package: Package,
  box: Box,
  wrench: Wrench,
  sparkles: Sparkles,

  // Activities
  calendar: Calendar,
  ticket: Ticket,
  trophy: Trophy,
  activity: Activity,

  // Daily / Utilities
  home: Home,
  droplet: Droplet,
  zap: Zap,
  phone: Phone,
  wifi: Wifi,
  baby: Baby,
  plane: Plane,
  'map-pin': MapPin,
  receipt: Receipt,
  scissors: Scissors,

  // Misc
  shapes: Shapes,
  'plus-circle': CirclePlus,
  'credit-card': CreditCard,
  undo: Undo,
} satisfies Record<string, LucideIcon>

export type CategoryIconKey = keyof typeof BUILTIN_CATEGORY_ICONS

export const DEFAULT_CATEGORY_ICON_KEY: CategoryIconKey = 'shapes'
