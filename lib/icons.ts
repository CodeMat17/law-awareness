import { createElement, type SVGProps } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Banknote,
  Bell,
  BookOpen,
  Briefcase,
  Building2,
  CalendarDays,
  Car,
  Check,
  ChevronDown,
  ChevronRight,
  CircleAlert,
  CircleQuestionMark,
  Clock,
  Database,
  ExternalLink,
  FileText,
  Folder,
  Gavel,
  GraduationCap,
  HardHat,
  Headphones,
  Heart,
  House,
  Info,
  Landmark,
  LayoutDashboard,
  Lightbulb,
  ListChecks,
  Lock,
  Map,
  Mic,
  Newspaper,
  Play,
  Radio,
  Receipt,
  Scale,
  Search,
  Shield,
  ShieldCheck,
  ShoppingBag,
  Signature,
  Siren,
  Sparkles,
  TrendingUp,
  Umbrella,
  Users,
  Video,
  Wifi,
  type LucideIcon,
} from "lucide-react";

/**
 * Content stores an icon *name*, never a component, so the CMS can persist it
 * as a plain string. This registry is the only place names become components.
 */
const registry = {
  "arrow-right": ArrowRight,
  "arrow-up-right": ArrowUpRight,
  "badge-check": BadgeCheck,
  banknote: Banknote,
  bell: Bell,
  "book-open": BookOpen,
  briefcase: Briefcase,
  "building-2": Building2,
  "calendar-days": CalendarDays,
  car: Car,
  check: Check,
  "chevron-down": ChevronDown,
  "chevron-right": ChevronRight,
  "circle-alert": CircleAlert,
  "circle-question": CircleQuestionMark,
  clock: Clock,
  database: Database,
  "external-link": ExternalLink,
  "file-text": FileText,
  folder: Folder,
  gavel: Gavel,
  "graduation-cap": GraduationCap,
  "hard-hat": HardHat,
  headphones: Headphones,
  heart: Heart,
  home: House,
  info: Info,
  landmark: Landmark,
  "layout-dashboard": LayoutDashboard,
  lightbulb: Lightbulb,
  "list-checks": ListChecks,
  lock: Lock,
  map: Map,
  mic: Mic,
  newspaper: Newspaper,
  play: Play,
  radio: Radio,
  receipt: Receipt,
  scale: Scale,
  search: Search,
  shield: Shield,
  "shield-check": ShieldCheck,
  "shopping-bag": ShoppingBag,
  signature: Signature,
  siren: Siren,
  sparkles: Sparkles,
  "trending-up": TrendingUp,
  umbrella: Umbrella,
  users: Users,
  video: Video,
  wifi: Wifi,
} as const satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof registry;

export const iconNames = Object.keys(registry) as IconName[];

/** Resolve an icon name to a component, falling back to a neutral glyph. */
export function getIcon(name: string): LucideIcon {
  return (registry as Record<string, LucideIcon>)[name] ?? CircleQuestionMark;
}

/**
 * Renders a registry icon by name.
 *
 * Uses `createElement` rather than assigning the looked-up component to a
 * capitalised local, which reads to the compiler as defining a component
 * during render.
 */
export function Icon({
  name,
  ...props
}: { name: string } & SVGProps<SVGSVGElement>) {
  return createElement(getIcon(name), props);
}
