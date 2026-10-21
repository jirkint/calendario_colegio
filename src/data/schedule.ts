import type { LucideIcon } from 'lucide-react';
import {
  Apple,
  BookMarked,
  BookOpen,
  Compass,
  Cpu,
  Gamepad2,
  Globe,
  Languages,
  Leaf,
  ListTodo,
  Moon,
  Palette,
  Pencil,
  ShieldCheck,
  Sigma,
  Smartphone,
  Sun,
  Trophy,
  Utensils,
} from 'lucide-react';

export type DayKey = 'lunes' | 'martes' | 'miercoles' | 'jueves' | 'viernes';

export type LinkKind = 'pdf' | 'word' | 'youtube' | 'drive' | 'web' | 'file';

export interface ActivityLink {
  label: string;
  url: string;
  kind: LinkKind;
}

export interface TeacherActivity {
  id: string;
  day: DayKey;
  subject: string;
  title: string;
  description: string;
  links: ActivityLink[];
  teacher: string;
  createdAt: number;
  mine?: boolean;
}

export type Pastel = 'lavender' | 'mint' | 'azure' | 'rose';

export interface SubjectMeta {
  icon: LucideIcon;
  pastel: Pastel;
}

export const SUBJECTS: Record<string, SubjectMeta> = {
  Castellano: { icon: BookOpen, pastel: 'lavender' },
  Matemáticas: { icon: Sigma, pastel: 'azure' },
  'G.H.C': { icon: Globe, pastel: 'rose' },
  Deporte: { icon: Trophy, pastel: 'mint' },
  Idiomas: { icon: Languages, pastel: 'azure' },
  'Arte y Patrimonio': { icon: Palette, pastel: 'rose' },
  'Ciencias Naturales': { icon: Leaf, pastel: 'mint' },
  Robótica: { icon: Cpu, pastel: 'lavender' },
  Orientación: { icon: Compass, pastel: 'rose' },
};

export const SUBJECT_LIST = Object.keys(SUBJECTS);

export const PASTEL: Record<
  Pastel,
  { tile: string; chipText: string; bar: string; dot: string; softBg: string; border: string }
> = {
  lavender: {
    tile: 'bg-lavender',
    chipText: 'text-[#5B4B8A]',
    bar: 'bg-[#B4A9E4]',
    dot: 'bg-[#B4A9E4]',
    softBg: 'bg-lavender/45',
    border: 'border-[#B4A9E4]/40',
  },
  mint: {
    tile: 'bg-mint',
    chipText: 'text-[#3A7A80]',
    bar: 'bg-[#9CCED3]',
    dot: 'bg-[#9CCED3]',
    softBg: 'bg-mint/60',
    border: 'border-[#9CCED3]/40',
  },
  azure: {
    tile: 'bg-azure',
    chipText: 'text-[#2E5FA3]',
    bar: 'bg-[#6FA3E0]',
    dot: 'bg-[#6FA3E0]',
    softBg: 'bg-azure/40',
    border: 'border-[#6FA3E0]/40',
  },
  rose: {
    tile: 'bg-rose',
    chipText: 'text-[#9E4F76]',
    bar: 'bg-[#F3A4C8]',
    dot: 'bg-[#F3A4C8]',
    softBg: 'bg-rose/45',
    border: 'border-[#F3A4C8]/40',
  },
};

export interface ClassBlock {
  start: string;
  end: string;
  subject: string;
}

export interface WeekDay {
  key: DayKey;
  label: string;
  short: string;
}

export const WEEK_DAYS: WeekDay[] = [
  { key: 'lunes', label: 'Lunes', short: 'Lun' },
  { key: 'martes', label: 'Martes', short: 'Mar' },
  { key: 'miercoles', label: 'Miércoles', short: 'Mié' },
  { key: 'jueves', label: 'Jueves', short: 'Jue' },
  { key: 'viernes', label: 'Viernes', short: 'Vie' },
];

export const WEEK_SCHEDULE: Record<DayKey, ClassBlock[]> = {
  lunes: [
    { start: '7:00 am', end: '8:30 am', subject: 'Castellano' },
    { start: '8:45 am', end: '10:15 am', subject: 'Matemáticas' },
    { start: '10:20 am', end: '11:50 am', subject: 'G.H.C' },
    { start: '11:50 am', end: '1:25 pm', subject: 'Deporte' },
  ],
  martes: [
    { start: '7:00 am', end: '8:30 am', subject: 'Matemáticas' },
    { start: '8:45 am', end: '10:15 am', subject: 'Idiomas' },
    { start: '10:20 am', end: '11:50 am', subject: 'Arte y Patrimonio' },
  ],
  miercoles: [
    { start: '7:00 am', end: '8:30 am', subject: 'Deporte' },
    { start: '8:45 am', end: '10:15 am', subject: 'Ciencias Naturales' },
    { start: '10:20 am', end: '11:50 am', subject: 'Idiomas' },
  ],
  jueves: [
    { start: '7:00 am', end: '8:30 am', subject: 'Castellano' },
    { start: '8:45 am', end: '10:15 am', subject: 'G.H.C' },
    { start: '10:20 am', end: '11:05 am', subject: 'Ciencias Naturales' },
    { start: '11:05 am', end: '11:50 am', subject: 'Robótica' },
  ],
  viernes: [
    { start: '7:00 am', end: '8:30 am', subject: 'Orientación' },
    { start: '8:45 am', end: '10:15 am', subject: 'G.H.C' },
    { start: '10:20 am', end: '11:05 am', subject: 'Robótica' },
    { start: '11:05 am', end: '11:50 am', subject: 'Ciencias Naturales' },
  ],
};

export interface IdealBlock {
  time: string;
  title: string;
  description: string;
  icon: LucideIcon;
  pastel: Pastel;
  note?: string;
}

export const IDEAL_SCHEDULE: IdealBlock[] = [
  {
    time: '1:30 pm – 3:00 pm',
    title: 'Almuerzo, descanso y desconexión',
    description: 'Come tranquilo y apaga las notificaciones: la mente también necesita pausa.',
    icon: Utensils,
    pastel: 'rose',
  },
  {
    time: '3:00 pm – 4:30 pm',
    title: 'Bloque de Estudio y Tareas',
    description: 'El momento de mayor foco del día. Divide las tareas y avanza una por una.',
    icon: Pencil,
    pastel: 'azure',
    note: 'Técnica Pomodoro: 25 min de estudio · 5 min de descanso',
  },
  {
    time: '4:30 pm – 5:00 pm',
    title: 'Merienda y pausa activa',
    description: 'Recarga energía: una fruta, agua y estirar el cuerpo.',
    icon: Apple,
    pastel: 'mint',
  },
  {
    time: '5:00 pm – 6:30 pm',
    title: 'Recreación, Deporte, Videojuegos o Redes',
    description: 'Tiempo libre de verdad. Tu cerebro lo necesita para rendir mejor después.',
    icon: Gamepad2,
    pastel: 'lavender',
  },
  {
    time: '6:30 pm – 7:30 pm',
    title: 'Repaso liviano o lectura para el día siguiente',
    description: 'Un vistazo rápido a lo de mañana o un libro que te guste. Sin apuros.',
    icon: BookMarked,
    pastel: 'azure',
  },
  {
    time: '7:30 pm en adelante',
    title: 'Cena, familia y preparación para dormir',
    description: 'Baja el ritmo y descansa: mínimo 8 horas de sueño para despertar con energía.',
    icon: Moon,
    pastel: 'rose',
    note: 'Mínimo 8 horas de sueño',
  },
];

export interface Tip {
  id: string;
  title: string;
  teaser: string;
  icon: LucideIcon;
  pastel: Pastel;
  steps: string[];
  help?: string;
}

export const TIPS: Tip[] = [
  {
    id: 'organizacion',
    title: 'Acumulación de tareas y desorganización',
    teaser: 'Muchas tareas juntas parecen una montaña. La clave está en dividirlas.',
    icon: ListTodo,
    pastel: 'lavender',
    steps: [
      'Anota todo en un solo lugar: agenda o calendario. Lo que se escribe, se recuerda.',
      'Divide las tareas grandes en pasos pequeños y haz uno a la vez.',
      'Usa la técnica Pomodoro: 25 minutos de foco y 5 de descanso.',
      'Empieza por la tarea que menos te gusta. El resto se siente más liviano.',
    ],
  },
  {
    id: 'bullying',
    title: 'Manejo del acoso escolar',
    teaser: 'Nadie merece sentirse solo o asustado en el colegio. Pedir ayuda es valiente.',
    icon: ShieldCheck,
    pastel: 'rose',
    steps: [
      'No respondas a las agresiones: alejarte y guardar la calma te protege.',
      'Cuéntale a un adulto de confianza: un docente, tu coordinador o tus padres.',
      'Guarda mensajes o capturas como evidencia, sin difundirlas.',
      'Habla con alguien que te escuche. No estás solo.',
    ],
    help: 'Si te sientes en riesgo, habla hoy mismo con un adulto responsable.',
  },
  {
    id: 'telefono',
    title: 'Uso responsable del teléfono y redes',
    teaser: 'La pantalla no manda sobre tu tiempo ni sobre cómo te sientes.',
    icon: Smartphone,
    pastel: 'azure',
    steps: [
      'Define horas sin pantalla, sobre todo antes de dormir.',
      'Desactiva las notificaciones mientras estudias para mantener el foco.',
      'Recuerda: lo que publicas queda. Piensa antes de compartir.',
      'Si algo en redes te hace sentir mal, sal de ahí y háblalo con alguien.',
    ],
  },
  {
    id: 'motivacion',
    title: 'Desánimo y motivación personal',
    teaser: 'No siempre hay ganas, y está bien. Importa dar el primer paso pequeño.',
    icon: Sun,
    pastel: 'mint',
    steps: [
      'Celebra los avances pequeños, no solo el resultado final.',
      'Fija metas claras y realistas: hoy 20 minutos de estudio ya cuenta.',
      'Mueve el cuerpo: una pausa activa llena de energía el cerebro.',
      'Si el desánimo dura mucho o pesa, compártelo con un adulto que te escuche.',
    ],
  },
];
