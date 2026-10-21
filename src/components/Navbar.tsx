import { useEffect, useState } from 'react';
import { ChevronRight, HeartHandshake, Menu, X } from 'lucide-react';

const LINKS = [
  { href: '#calendario', label: 'Calendario de Clases' },
  { href: '#horario', label: 'Horario Ideal de Estudio' },
  { href: '#consejos', label: 'Consejos Anti-Estrés' },
];

interface NavbarProps {
  teacher: string | null;
  onLogin: () => void;
}

export function Navbar({ teacher, onLogin }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-shadow ${
        scrolled ? 'shadow-[0_8px_30px_rgba(67,53,82,0.08)]' : ''
      }`}
    >
      <div className="border-b border-ink/5 bg-bone/80 backdrop-blur-md">
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <a href="#calendario" className="flex items-center gap-2.5">
            <span className="grid size-10 place-items-center rounded-2xl bg-rose shadow-sm">
              <HeartHandshake className="size-6 text-ink" strokeWidth={2} />
            </span>
            <span className="leading-tight">
              <span className="block font-display text-xl font-bold tracking-tight">EduPaz</span>
              <span className="block text-[11px] font-semibold text-ink-mute">Bienestar estudiantil</span>
            </span>
          </a>

          <div className="hidden items-center gap-1 md:flex">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="rounded-xl px-3 py-2 text-sm font-semibold text-ink-soft transition-colors hover:bg-lavender/50 hover:text-ink"
              >
                {l.label}
              </a>
            ))}
          </div>

          <div className="hidden md:block">
            {teacher ? (
              <a
                href="#profesores"
                className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-bold text-bone shadow-sm transition-transform hover:-translate-y-0.5"
              >
                Portal de Profesores
                <ChevronRight className="size-4" />
              </a>
            ) : (
              <button
                onClick={onLogin}
                className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-bold text-bone shadow-sm transition-transform hover:-translate-y-0.5"
              >
                Acceso Profesores
              </button>
            )}
          </div>

          <button
            className="grid size-10 place-items-center rounded-xl bg-lavender/60 text-ink md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={open}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </nav>

        {open && (
          <div className="border-t border-ink/10 bg-bone px-4 py-3 md:hidden">
            <div className="flex flex-col gap-1">
              {LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3 py-2.5 text-sm font-semibold text-ink-soft hover:bg-lavender/50 hover:text-ink"
                >
                  {l.label}
                </a>
              ))}
              {teacher ? (
                <a
                  href="#profesores"
                  onClick={() => setOpen(false)}
                  className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-bold text-bone"
                >
                  Portal de Profesores
                </a>
              ) : (
                <button
                  onClick={() => {
                    setOpen(false);
                    onLogin();
                  }}
                  className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-bold text-bone"
                >
                  Acceso Profesores
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
