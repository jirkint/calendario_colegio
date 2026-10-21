import { Clock, Moon } from 'lucide-react';
import { IDEAL_SCHEDULE, PASTEL } from '../data/schedule';
import { Reveal } from './Reveal';

export function IdealScheduleSection() {
  return (
    <section id="horario" className="scroll-mt-20 bg-lavender/30 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Reveal className="max-w-2xl">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Horario ideal fuera de clase
          </h2>
          <p className="mt-3 text-lg text-ink-soft">
            Una tarde organizada para rendir en el estudio y descansar de verdad: tiempo para tareas,
            recreación y sueño suficiente.
          </p>
        </Reveal>

        <div className="mt-10 overflow-hidden rounded-3xl border border-ink/5 bg-white shadow-[0_24px_50px_-24px_rgba(67,53,82,0.2)]">
          <ol>
            {IDEAL_SCHEDULE.map((b, i) => {
              const p = PASTEL[b.pastel];
              const Icon = b.icon;
              return (
                <li key={b.time} className="border-b border-ink/5 last:border-0">
                  <Reveal
                    delay={i * 50}
                    className="flex flex-col gap-3 px-5 py-5 sm:flex-row sm:items-start sm:gap-5 sm:px-7"
                  >
                    <div
                      className={`shrink-0 self-start rounded-full px-3 py-1 text-sm font-bold ${p.tile}`}
                    >
                      {b.time}
                    </div>
                    <div className="flex gap-3">
                      <span
                        className={`mt-0.5 hidden size-11 shrink-0 place-items-center rounded-2xl sm:grid ${p.tile}`}
                      >
                        <Icon className={`size-5 ${p.chipText}`} strokeWidth={2} />
                      </span>
                      <div>
                        <h3 className="text-base font-bold">{b.title}</h3>
                        <p className="mt-1 text-sm leading-relaxed text-ink-soft">{b.description}</p>
                        {b.note && (
                          <p className="mt-2 inline-flex flex-wrap items-center gap-2 rounded-xl bg-bone px-3 py-1.5 text-xs font-semibold text-ink-soft">
                            <Clock className="size-3.5 text-ink-mute" /> {b.note}
                          </p>
                        )}
                      </div>
                    </div>
                  </Reveal>
                </li>
              );
            })}
          </ol>
        </div>

        <Reveal delay={120} className="mt-6 flex items-center gap-4 rounded-2xl bg-rose/40 px-6 py-4">
          <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-white/60">
            <Moon className="size-5 text-[#9E4F76]" strokeWidth={2} />
          </span>
          <p className="text-sm font-semibold text-ink-soft">
            Dormir bien es parte del estudio:{' '}
            <span className="font-bold text-ink">mínimo 8 horas de sueño</span> para que el cerebro
            consolide lo aprendido.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
