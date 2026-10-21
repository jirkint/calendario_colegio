import { useEffect, useState, type FormEvent } from 'react';
import { HeartHandshake, X } from 'lucide-react';
import { api } from '../lib/api';

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (name: string) => void;
}

type Mode = 'login' | 'register';

export function LoginModal({ open, onClose, onSuccess }: LoginModalProps) {
  const [mode, setMode] = useState<Mode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [invite, setInvite] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) setError('');
  }, [open]);

  if (!open) return null;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Escribe un correo válido.');
      return;
    }
    if (pass.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (mode === 'register' && !name.trim()) {
      setError('Escribe tu nombre.');
      return;
    }
    if (mode === 'register' && !invite.trim()) {
      setError('Escribe el código de invitación.');
      return;
    }
    setError('');
    setBusy(true);
    try {
      const result =
        mode === 'register'
          ? await api.register(name.trim(), email, pass, invite.trim())
          : await api.login(email, pass);
      onSuccess(result.name);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'No se pudo entrar. Intenta de nuevo.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-ink/5 bg-bone shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-label="Acceso Profesores"
      >
        <div className="flex items-center justify-between bg-rose/40 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-xl bg-white/70">
              <HeartHandshake className="size-5 text-[#9E4F76]" />
            </span>
            <span className="font-display text-lg font-bold">EduPaz · Profesores</span>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="grid size-8 place-items-center rounded-xl bg-white/60 transition-colors hover:bg-white"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 gap-2 rounded-2xl bg-lavender/50 p-1">
            {(['login', 'register'] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => {
                  setMode(m);
                  setError('');
                }}
                className={`rounded-xl py-2 text-sm font-bold transition-colors ${
                  mode === m ? 'bg-white shadow-sm' : 'text-ink-soft'
                }`}
              >
                {m === 'login' ? 'Iniciar sesión' : 'Registrarse'}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="mt-5 space-y-4">
            {mode === 'register' && (
              <>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-bold">Nombre</span>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Prof. Ana Torres"
                    className="field"
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-bold">Código de invitación</span>
                  <input
                    value={invite}
                    onChange={(e) => setInvite(e.target.value)}
                    placeholder="Código que te dio la institución"
                    className="field"
                  />
                </label>
              </>
            )}
            <label className="block">
              <span className="mb-1.5 block text-sm font-bold">Correo</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@colegio.edu"
                className="field"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-bold">Contraseña</span>
              <input
                type="password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                placeholder="••••••"
                className="field"
              />
            </label>
            {error && <p className="text-sm font-bold text-[#B05555]">{error}</p>}
            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-full bg-ink py-3 text-sm font-bold text-bone transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {busy ? 'Entrando…' : mode === 'login' ? 'Entrar al portal' : 'Crear cuenta y entrar'}
            </button>
          </form>

          <p className="mt-4 text-center text-xs font-semibold text-ink-mute">
            Tu cuenta se guarda de forma segura y encriptada.
          </p>
        </div>
      </div>
    </div>
  );
}
