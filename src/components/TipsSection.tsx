import { useState } from 'react';
import { ArrowRight, RotateCcw } from 'lucide-react';
import { PASTEL, TIPS } from '../data/schedule';
import { Reveal } from './Reveal';

export function TipsSection() {
  const [flipped, setFlipped] = useState<Record<string, boolean>>({});

  const toggle = (id: string) => setFlipped((f) => ({ ...f, [id]: !f[id] }));

  return (
    <section id="consejos" className="scroll-mt-20 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Reveal className="max-w-2xl">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Consejos para sentirte mejor
          </h2>
          <p className="mt-3 text-lg text-ink-soft">
            Herramientas sencillas para los problemas más comunes. Toca cada tarjeta para descubrir qué
            puedes hacer hoy.
          </p>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TIPS.map((tip, i) => {
            const p = PASTEL[tip.pastel];
            const Icon = tip.icon;
            const isFlipped = Boolean(flipped[tip.id]);
            return (
              <Reveal key={tip.id} delay={i * 70} className="h-full">
                <button
                  type="button"
                  onClick={() => toggle(tip.id)}
                  aria-expanded={isFlipped}
                  className={`flip-card block h-full w-full text-left ${isFlipped ? 'is-flipped' : ''}`}
                >
                  <span className="flip-inner relative block h-full w-full min-h-[340px]">
                    <span className="flip-face absolute inset-0 flex flex-col rounded-3xl border border-ink/5 bg-white p-6 shadow-[0_18px_40px_-20px_rgba(67,53,82,0.18)]">
                      <span className={`grid size-12 place-items-center rounded-2xl ${p.tile}`}>
                        <Icon className={`size-6 ${p.chipText}`} strokeWidth={2} />
                      </span>
                      <span className="mt-4 block font-display text-lg font-bold leading-snug">
                        {tip.title}
                      </span>
                      <span className="mt-2 block text-sm leading-relaxed text-ink-soft">
                        {tip.teaser}
                      </span>
                      <span className="mt-auto flex items-center gap-1.5 pt-4 text-xs font-bold text-ink-mute">
                        Toca para leer <ArrowRight className="size-3.5" />
                      </span>
                    </span>

                    <span
                      className={`flip-face flip-back absolute inset-0 flex flex-col rounded-3xl border border-ink/10 p-6 shadow-[0_18px_40px_-20px_rgba(67,53,82,0.18)] ${p.softBg}`}
                    >
                      <span className="block font-display text-lg font-bold leading-snug">
                        {tip.title}
                      </span>
                      <span className="mt-3 flex flex-1 flex-col gap-2.5">
                        {tip.steps.map((s, j) => (
                          <span
                            key={j}
                            className="flex gap-2 text-[13px] leading-snug text-ink-soft"
                          >
                            <span
                              className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-full text-[11px] font-bold text-ink ${p.bar}`}
                            >
                              {j + 1}
                            </span>
                            {s}
                          </span>
                        ))}
                      </span>
                      {tip.help && (
                        <span className="mt-3 block rounded-xl bg-white/75 px-3 py-2 text-xs font-bold text-ink">
                          {tip.help}
                        </span>
                      )}
                      <span className="mt-3 block text-xs font-bold text-ink-mute">
                        Toca para volver <RotateCcw className="inline size-3.5" />
                      </span>
                    </span>
                  </span>
                </button>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
