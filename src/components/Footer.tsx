import { Heart, HeartHandshake } from 'lucide-react';

const LINKS = [
  { href: '#calendario', label: 'Calendario de Clases' },
  { href: '#horario', label: 'Horario Ideal' },
  { href: '#consejos', label: 'Consejos Anti-Estrés' },
  { href: '#profesores', label: 'Portal Profesores' },
];

export function Footer() {
  return (
    <footer className="bg-lavender/50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left">
        <div className="flex flex-col items-center gap-3 sm:items-start">
          <span className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-xl bg-white/70">
              <HeartHandshake className="size-5 text-[#5B4B8A]" />
            </span>
            <span className="font-display text-lg font-bold">EduPaz</span>
          </span>
          <p className="max-w-sm text-sm text-ink-soft">
            Reducción del estrés estudiantil. Un espacio tranquilo para organizar, estudiar y vivir
            el colegio con calma.
          </p>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-semibold text-ink-soft underline-offset-4 transition-colors hover:text-ink hover:underline"
            >
              {l.label}
            </a>
          ))}
        </nav>
      </div>

      <p className="mt-10 flex items-center justify-center gap-1.5 text-center text-xs font-semibold text-ink-mute">
        Hecho con <Heart className="size-3.5 fill-[#F3A4C8] text-[#F3A4C8]" /> para los estudiantes de
        11 a 17 años.
      </p>
    </footer>
  );
}
