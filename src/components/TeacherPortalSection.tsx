import { useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { Check, Lock, LogIn, LogOut, Plus, Trash2, Upload } from 'lucide-react';
import {
  SUBJECT_LIST,
  WEEK_DAYS,
  type DayKey,
  type LinkKind,
  type TeacherActivity,
} from '../data/schedule';
import type { ActivityInput } from '../lib/api';
import { Reveal } from './Reveal';

interface LinkRow {
  label: string;
  url: string;
  kind: LinkKind;
}

const KIND_OPTIONS: { value: LinkKind; label: string }[] = [
  { value: 'pdf', label: 'PDF' },
  { value: 'word', label: 'Word' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'drive', label: 'Drive' },
  { value: 'web', label: 'Sitio web' },
];

const fmtDate = (ts: number) =>
  new Date(ts).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });

function TeacherForm({
  onCreate,
}: {
  onCreate: (input: ActivityInput) => Promise<void>;
}) {
  const [day, setDay] = useState<DayKey>('lunes');
  const [subject, setSubject] = useState<string>(SUBJECT_LIST[0]);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [links, setLinks] = useState<LinkRow[]>([{ label: '', url: '', kind: 'web' }]);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [files, setFiles] = useState<{ name: string; url: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileRef = useRef<HTMLInputElement | null>(null);

  const updateLink = (i: number, patch: Partial<LinkRow>) =>
    setLinks((ls) => ls.map((l, idx) => (idx === i ? { ...l, ...patch } : l)));

  const addLink = () => setLinks((ls) => [...ls, { label: '', url: '', kind: 'web' }]);

  const removeLink = (i: number) =>
    setLinks((ls) => (ls.length === 1 ? ls : ls.filter((_, idx) => idx !== i)));

  const handleFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setUploadError('');
    setUploading(true);
    try {
      const res = await fetch('/api/uploads', {
        method: 'POST',
        headers: {
          'Content-Type': file.type || 'application/octet-stream',
          'X-Filename': encodeURIComponent(file.name),
        },
        body: file,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error((data as { error?: string }).error || 'No se pudo subir el archivo.');
      }
      setFiles((f) => [...f, { name: file.name, url: (data as { url: string }).url }]);
    } catch (e: unknown) {
      setUploadError(e instanceof Error ? e.message : 'No se pudo subir el archivo.');
    } finally {
      setUploading(false);
    }
  };

  const removeFile = (url: string) => setFiles((f) => f.filter((x) => x.url !== url));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;
    if (!title.trim()) {
      setError('Escribe un título para la actividad.');
      return;
    }
    const validLinks = links.filter((l) => l.url.trim());
    if (!desc.trim() && validLinks.length === 0 && files.length === 0) {
      setError('Agrega una descripción, un enlace o un archivo.');
      return;
    }
    setError('');
    setBusy(true);
    try {
      await onCreate({
        day,
        subject,
        title: title.trim(),
        description: desc.trim(),
        links: [
          ...files.map((f) => ({ label: f.name, url: f.url, kind: 'file' as LinkKind })),
          ...validLinks.map((l) => ({
            label: l.label.trim() || 'Enlace',
            url: l.url.trim(),
            kind: l.kind,
          })),
        ],
      });
      setTitle('');
      setDesc('');
      setLinks([{ label: '', url: '', kind: 'web' }]);
      setFiles([]);
      setDone(true);
      window.setTimeout(() => setDone(false), 3000);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'No se pudo publicar. Verifica tu conexión.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-bold">Día de la semana</span>
          <select
            value={day}
            onChange={(e) => setDay(e.target.value as DayKey)}
            className="field"
          >
            {WEEK_DAYS.map((d) => (
              <option key={d.key} value={d.key}>
                {d.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-bold">Materia</span>
          <select value={subject} onChange={(e) => setSubject(e.target.value)} className="field">
            {SUBJECT_LIST.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="block">
        <span className="mb-1.5 block text-sm font-bold">Título de la tarea o examen</span>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ej.: Ejercicios de fracciones"
          className="field"
        />
      </label>

      <label className="block">
        <span className="mb-1.5 block text-sm font-bold">Descripción detallada</span>
        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          rows={3}
          placeholder="Explica qué deben hacer los estudiantes, fecha de entrega, criterios..."
          className="field resize-y"
        />
      </label>

      <div>
        <span className="mb-1.5 block text-sm font-bold">Enlaces y archivos</span>
        <div className="space-y-2">
          {links.map((l, i) => (
            <div key={i} className="flex flex-wrap items-center gap-2">
              <input
                value={l.label}
                onChange={(e) => updateLink(i, { label: e.target.value })}
                placeholder="Texto del enlace"
                className="field min-w-0 flex-1 basis-32"
              />
              <input
                value={l.url}
                onChange={(e) => updateLink(i, { url: e.target.value })}
                placeholder="https://..."
                className="field min-w-0 flex-1 basis-40"
              />
              <select
                value={l.kind}
                onChange={(e) => updateLink(i, { kind: e.target.value as LinkKind })}
                className="field w-auto shrink-0"
                aria-label="Tipo de enlace"
              >
                {KIND_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => removeLink(i)}
                aria-label="Quitar enlace"
                className="grid size-9 shrink-0 place-items-center rounded-xl bg-rose/40 text-[#9E4F76] transition-colors hover:bg-rose/70"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addLink}
          className="mt-2 inline-flex items-center gap-1.5 text-sm font-bold text-[#5B4B8A]"
        >
          <Plus className="size-4" /> Añadir otro enlace
        </button>
      </div>

      <div>
        <span className="mb-1.5 block text-sm font-bold">Archivos adjuntos</span>
        <input
          ref={fileRef}
          type="file"
          accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.png,.jpg,.jpeg,.gif,.webp,.txt"
          onChange={handleFile}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-2 rounded-full bg-azure/40 px-4 py-2.5 text-sm font-bold text-[#2E5FA3] transition-colors hover:bg-azure/60 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Upload className="size-4" /> {uploading ? 'Subiendo…' : 'Subir archivo (PDF, Word…)'}
        </button>
        {files.length > 0 && (
          <ul className="mt-3 space-y-1.5">
            {files.map((f) => (
              <li
                key={f.url}
                className="flex items-center justify-between gap-2 rounded-xl bg-lavender/40 px-3 py-2 text-sm font-semibold text-ink-soft"
              >
                <span className="truncate">{f.name}</span>
                <button
                  type="button"
                  onClick={() => removeFile(f.url)}
                  aria-label="Quitar archivo"
                  className="grid size-7 shrink-0 place-items-center rounded-lg bg-white/70 text-[#9E4F76] transition-colors hover:bg-white"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}
        {uploadError && <p className="mt-2 text-sm font-bold text-[#B05555]">{uploadError}</p>}
      </div>

      {error && <p className="text-sm font-bold text-[#B05555]">{error}</p>}

      <button
        type="submit"
        disabled={busy}
        className="w-full rounded-full bg-ink py-3 text-sm font-bold text-bone transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {busy ? 'Publicando…' : 'Publicar en el calendario'}
      </button>

      {done && (
        <p className="flex items-center justify-center gap-2 text-sm font-bold text-[#3A7A80]">
          <Check className="size-4" /> Publicado. Ya aparece en el calendario.
        </p>
      )}
    </form>
  );
}

interface PortalProps {
  activities: TeacherActivity[];
  teacher: string | null;
  onAdd: (input: ActivityInput) => Promise<void>;
  onRemove: (id: string) => Promise<void>;
  onLogout: () => void;
  onLogin: () => void;
}

export function TeacherPortalSection({
  activities,
  teacher,
  onAdd,
  onRemove,
  onLogout,
  onLogin,
}: PortalProps) {
  const own = activities.filter((a) => a.mine);
  const [listError, setListError] = useState('');
  const [removingId, setRemovingId] = useState<string | null>(null);

  const remove = async (id: string) => {
    setListError('');
    setRemovingId(id);
    try {
      await onRemove(id);
    } catch (e: unknown) {
      setListError(e instanceof Error ? e.message : 'No se pudo eliminar la actividad.');
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <section id="profesores" className="scroll-mt-20 bg-azure/25 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Reveal className="max-w-2xl">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Portal para profesores
          </h2>
          <p className="mt-3 text-lg text-ink-soft">
            Publica tareas y evaluaciones con sus enlaces. Se actualizan al instante en el calendario,
            sin registro para padres ni alumnos.
          </p>
        </Reveal>

        {teacher ? (
          <Reveal delay={80}>
            <div className="mt-8 overflow-hidden rounded-3xl border border-ink/5 bg-white shadow-[0_24px_50px_-24px_rgba(67,53,82,0.2)]">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/5 bg-lavender/40 px-6 py-4">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-full bg-white/70 font-display text-lg font-bold text-[#5B4B8A]">
                    {teacher.charAt(0).toUpperCase()}
                  </span>
                  <div>
                    <p className="text-sm font-bold">Sesión de {teacher}</p>
                    <p className="text-xs font-semibold text-ink-mute">
                      Tu contenido se publica al instante
                    </p>
                  </div>
                </div>
                <button
                  onClick={onLogout}
                  className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-sm font-bold text-ink-soft transition-colors hover:text-ink"
                >
                  Cerrar sesión <LogOut className="size-4" />
                </button>
              </div>
              <div className="p-6">
                <TeacherForm onCreate={onAdd} />
              </div>
            </div>

            <div className="mt-10">
              <h3 className="font-display text-xl font-bold">Mis actividades publicadas</h3>
              {listError && <p className="mt-2 text-sm font-bold text-[#B05555]">{listError}</p>}
              {own.length === 0 ? (
                <p className="mt-3 rounded-2xl border border-dashed border-ink/15 px-5 py-6 text-center text-sm font-semibold text-ink-mute">
                  Aún no has publicado ninguna actividad. Usa el formulario de arriba para empezar.
                </p>
              ) : (
                <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {own.map((a) => (
                    <li
                      key={a.id}
                      className="rounded-2xl border border-ink/5 bg-white p-4 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-xs font-bold uppercase tracking-wide text-ink-mute">
                            {WEEK_DAYS.find((d) => d.key === a.day)?.label} · {a.subject}
                          </p>
                          <h4 className="mt-0.5 truncate text-sm font-bold">{a.title}</h4>
                        </div>
                        <button
                          onClick={() => remove(a.id)}
                          disabled={removingId === a.id}
                          aria-label="Eliminar actividad"
                          className="grid size-8 shrink-0 place-items-center rounded-xl bg-rose/40 text-[#9E4F76] transition-colors hover:bg-rose/70 disabled:opacity-50"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                      {a.description && (
                        <p className="mt-2 text-xs leading-relaxed text-ink-soft">{a.description}</p>
                      )}
                      <p className="mt-2 text-[11px] font-semibold text-ink-mute">
                        {fmtDate(a.createdAt)} · {a.links.length} enlace(s)
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Reveal>
        ) : (
          <Reveal delay={80}>
            <div className="mt-8 flex flex-col items-center gap-4 rounded-3xl border border-ink/5 bg-white px-8 py-12 text-center shadow-[0_24px_50px_-24px_rgba(67,53,82,0.2)]">
              <span className="grid size-16 place-items-center rounded-3xl bg-lavender/70">
                <Lock className="size-7 text-[#5B4B8A]" />
              </span>
              <h3 className="font-display text-2xl font-bold">Portal privado para docentes</h3>
              <p className="max-w-md text-sm leading-relaxed text-ink-soft">
                Accede para seleccionar día y materia, escribir la actividad y pegar enlaces que se
                publicarán automáticamente en el calendario público.
              </p>
              <button
                onClick={onLogin}
                className="mt-2 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-bold text-bone transition-transform hover:-translate-y-0.5"
              >
                <LogIn className="size-4" /> Acceso Profesores
              </button>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
