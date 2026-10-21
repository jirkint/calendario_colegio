import { useState } from 'react';
import {
  CalendarDays,
  ChevronDown,
  Download,
  ExternalLink,
  FileText,
  HardDrive,
  Play,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import {
  PASTEL,
  SUBJECTS,
  WEEK_DAYS,
  WEEK_SCHEDULE,
  type ClassBlock,
  type DayKey,
  type LinkKind,
  type TeacherActivity,
  type WeekDay,
} from '../data/schedule';
import { Reveal } from './Reveal';

const KIND_META: Record<LinkKind, { icon: LucideIcon; label: string; cls: string }> = {
  pdf: { icon: FileText, label: 'PDF', cls: 'bg-rose/45 text-[#9E4F76]' },
  word: { icon: FileText, label: 'Word', cls: 'bg-azure/40 text-[#2E5FA3]' },
  youtube: { icon: Play, label: 'Video', cls: 'bg-rose/45 text-[#9E4F76]' },
  drive: { icon: HardDrive, label: 'Drive', cls: 'bg-mint/70 text-[#3A7A80]' },
  web: { icon: ExternalLink, label: 'Web', cls: 'bg-lavender/55 text-[#5B4B8A]' },
  file: { icon: Download, label: 'Archivo', cls: 'bg-azure/40 text-[#2E5FA3]' },
};

const fmtDate = (ts: number) =>
  new Date(ts).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });

function BlockItem({
  day,
  block,
  activities,
}: {
  day: DayKey;
  block: ClassBlock;
  activities: TeacherActivity[];
}) {
  const [open, setOpen] = useState(false);
  const meta = SUBJECTS[block.subject] ?? { icon: CalendarDays, pastel: 'lavender' as const };
  const p = PASTEL[meta.pastel];
  const Icon = meta.icon;
  const blockActivities = activities.filter((a) => a.day === day && a.subject === block.subject);

  return (
    <li>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-bone/70"
      >
        <span className={`grid size-9 shrink-0 place-items-center rounded-xl ${p.tile}`}>
          <Icon className={`size-5 ${p.chipText}`} strokeWidth={2} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-bold">{block.subject}</span>
          <span className="block text-xs font-semibold text-ink-mute">
            {block.start} – {block.end}
          </span>
        </span>
        {blockActivities.length > 0 && (
          <span
            className={`grid size-5 shrink-0 place-items-center rounded-full text-[11px] font-bold text-ink ${p.bar}`}
          >
            {blockActivities.length}
          </span>
        )}
        <ChevronDown
          className={`size-4 shrink-0 text-ink-mute transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="px-3 pb-3">
          {blockActivities.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-ink/15 px-3 py-3 text-center text-xs font-semibold text-ink-mute">
              Aún no hay actividades publicadas para esta clase.
            </p>
          ) : (
            <ul className="space-y-2">
              {blockActivities.map((a) => (
                <li key={a.id} className={`rounded-2xl border p-3 ${p.softBg} ${p.border}`}>
                  <h4 className="text-sm font-bold">{a.title}</h4>
                  {a.description && (
                    <p className="mt-1 text-xs leading-relaxed text-ink-soft">{a.description}</p>
                  )}
                  {a.links.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      {a.links.map((l, i) => {
                        const K = KIND_META[l.kind] ?? KIND_META.web;
                        const Li = K.icon;
                        return (
                          <a
                            key={i}
                            href={l.url}
                            target="_blank"
                            rel="noreferrer"
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[11px] font-bold transition-transform hover:-translate-y-0.5 ${K.cls}`}
                          >
                            <Li className="size-3.5" /> {l.label || K.label}
                          </a>
                        );
                      })}
                    </div>
                  )}
                  <p className="mt-2 text-[11px] font-semibold text-ink-mute">
                    {a.teacher} · {fmtDate(a.createdAt)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </li>
  );
}

function DayColumn({ day, activities }: { day: WeekDay; activities: TeacherActivity[] }) {
  const blocks = WEEK_SCHEDULE[day.key];
  return (
    <article className="overflow-hidden rounded-3xl border border-ink/5 bg-white shadow-[0_18px_40px_-20px_rgba(67,53,82,0.18)]">
      <header className="bg-lavender/40 px-4 py-3">
        <h3 className="font-display text-lg font-bold">{day.label}</h3>
        <p className="text-xs font-semibold text-ink-mute">{blocks.length} bloques de clase</p>
      </header>
      <ul className="divide-y divide-ink/5">
        {blocks.map((b) => (
          <BlockItem key={`${day.key}-${b.start}`} day={day.key} block={b} activities={activities} />
        ))}
      </ul>
    </article>
  );
}

export function CalendarSection({ activities }: { activities: TeacherActivity[] }) {
  return (
    <section id="calendario" className="scroll-mt-20 px-4 pb-20 pt-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Reveal className="max-w-2xl">
          <h1 className="font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            Tu semana, con la mente tranquila.
          </h1>
          <p className="mt-4 text-lg text-ink-soft">
            Tus clases, tus tareas y un plan para llegar al final de la semana sin estrés. Todo en un
            solo lugar.
          </p>
        </Reveal>

        <Reveal
          delay={120}
          className="mt-8 flex items-center gap-2 rounded-2xl bg-mint/40 px-4 py-3 text-sm font-semibold text-ink-soft"
        >
          <Sparkles className="size-4 shrink-0 text-[#3A7A80]" />
          Toca un bloque para ver las actividades y evaluaciones de cada profesor. Descarga libre,
          sin registro para padres ni alumnos.
        </Reveal>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {WEEK_DAYS.map((day, i) => (
            <Reveal key={day.key} delay={i * 60}>
              <DayColumn day={day} activities={activities} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
