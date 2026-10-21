import 'dotenv/config';
import express from 'express';
import type { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { pool, initDb } from './db.js';
import {
  clearAuthCookie,
  hashPassword,
  optionalAuth,
  requireAuth,
  setAuthCookie,
  signToken,
  verifyPassword,
} from './auth.js';
import { config } from './config.js';

const app = express();
app.use(cors({ credentials: true, origin: true }));
app.use(express.json());
app.use(cookieParser());

const uploadsDir = process.env.UPLOADS_DIR ?? path.join(process.cwd(), 'uploads');
fs.mkdirSync(uploadsDir, { recursive: true });
app.use('/uploads', express.static(uploadsDir));

interface ActivityLink {
  label: string;
  url: string;
  kind: string;
}

function normalizeLinks(links: unknown): ActivityLink[] {
  if (!Array.isArray(links)) return [];
  return (links as any[])
    .filter((l) => l && typeof l.url === 'string' && l.url.trim())
    .map((l) => ({
      label: typeof l.label === 'string' && l.label.trim() ? l.label.trim() : 'Enlace',
      url: String(l.url).trim(),
      kind: typeof l.kind === 'string' ? l.kind : 'web',
    }));
}

function mapActivity(row: any, me?: number) {
  return {
    id: String(row.id),
    day: row.day,
    subject: row.subject,
    title: row.title,
    description: row.description ?? '',
    links: Array.isArray(row.links) ? (row.links as ActivityLink[]) : normalizeLinks(row.links),
    teacher: row.teacher_name,
    createdAt: new Date(row.created_at).getTime(),
    mine: me != null && row.teacher_id === me,
  };
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

const RAW_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'image/png',
  'image/jpeg',
  'image/gif',
  'image/webp',
  'text/plain',
];

const ALLOWED_EXT = new Set([
  '.pdf',
  '.doc',
  '.docx',
  '.ppt',
  '.pptx',
  '.xls',
  '.xlsx',
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.webp',
  '.txt',
]);

app.post('/api/uploads', express.raw({ type: RAW_TYPES, limit: '15mb' }), async (req, res) => {
  let rawName = '';
  try {
    rawName = decodeURIComponent(String(req.headers['x-filename'] ?? ''));
  } catch {
    rawName = '';
  }
  const ext = path.extname(rawName).toLowerCase();
  if (!ALLOWED_EXT.has(ext)) {
    res.status(400).json({ error: 'Tipo de archivo no permitido.' });
    return;
  }
  const buf = req.body;
  if (!buf || !Buffer.isBuffer(buf) || buf.length === 0) {
    res.status(400).json({ error: 'Archivo vacío o formato no compatible.' });
    return;
  }
  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
  const displayName = path.basename(rawName) || safeName;
  await fs.promises.writeFile(path.join(uploadsDir, safeName), buf);
  res.status(201).json({ url: `/uploads/${safeName}`, name: displayName });
});

// ---- Auth ----
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, inviteCode } = req.body ?? {};
  if (!name?.trim() || !email?.trim() || !password) {
    res.status(400).json({ error: 'Faltan nombre, correo o contraseña.' });
    return;
  }
  const emailNorm = String(email).trim().toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(emailNorm)) {
    res.status(400).json({ error: 'Escribe un correo válido.' });
    return;
  }
  if (String(password).length < 6) {
    res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres.' });
    return;
  }
  if (config.inviteCode && String(inviteCode ?? '').trim() !== config.inviteCode) {
    res.status(403).json({ error: 'Código de invitación inválido.' });
    return;
  }
  try {
    const { rows } = await pool.query(
      'INSERT INTO teachers (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id',
      [String(name).trim(), emailNorm, hashPassword(String(password))],
    );
    const token = signToken({ sub: String(rows[0].id), name: String(name).trim() });
    setAuthCookie(res, token);
    res.json({ name: String(name).trim() });
  } catch (e: any) {
    if (e?.code === '23505') {
      res.status(409).json({ error: 'Ese correo ya está registrado.' });
      return;
    }
    console.error(e);
    res.status(500).json({ error: 'No se pudo registrar. Intenta de nuevo.' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body ?? {};
  if (!email?.trim() || !password) {
    res.status(400).json({ error: 'Faltan correo o contraseña.' });
    return;
  }
  const { rows } = await pool.query(
    'SELECT id, name, password_hash FROM teachers WHERE email = $1',
    [String(email).trim().toLowerCase()],
  );
  const teacher = rows[0];
  if (!teacher || !verifyPassword(String(password), teacher.password_hash)) {
    res.status(401).json({ error: 'Correo o contraseña incorrectos.' });
    return;
  }
  const token = signToken({ sub: String(teacher.id), name: teacher.name });
  setAuthCookie(res, token);
  res.json({ name: teacher.name });
});

app.post('/api/auth/logout', (_req, res) => {
  clearAuthCookie(res);
  res.json({ ok: true });
});

app.get('/api/auth/me', optionalAuth, (req, res) => {
  res.json(req.auth ? { name: req.auth.name } : null);
});

// ---- Activities ----
app.get('/api/activities', optionalAuth, async (req, res) => {
  const { rows } = await pool.query(
    'SELECT id, teacher_id, day, subject, title, description, links, teacher_name, created_at FROM activities ORDER BY created_at DESC',
  );
  res.json(rows.map((r) => mapActivity(r, req.auth?.id)));
});

app.post('/api/activities', requireAuth, async (req, res) => {
  const { day, subject, title, description, links } = req.body ?? {};
  if (!day || !subject || !title?.trim()) {
    res.status(400).json({ error: 'Día, materia y título son obligatorios.' });
    return;
  }
  const { rows } = await pool.query(
    `INSERT INTO activities (teacher_id, day, subject, title, description, links, teacher_name)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id, teacher_id, day, subject, title, description, links, teacher_name, created_at`,
    [
      req.auth!.id,
      String(day),
      String(subject),
      String(title).trim(),
      String(description ?? ''),
      JSON.stringify(normalizeLinks(links)),
      req.auth!.name,
    ],
  );
  res.status(201).json(mapActivity(rows[0], req.auth!.id));
});

app.delete('/api/activities/:id', requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) {
    res.status(400).json({ error: 'Id inválido.' });
    return;
  }
  const { rowCount } = await pool.query(
    'DELETE FROM activities WHERE id = $1 AND teacher_id = $2',
    [id, req.auth!.id],
  );
  if (!rowCount) {
    res.status(404).json({ error: 'Actividad no encontrada o no te pertenece.' });
    return;
  }
  res.json({ ok: true });
});

// Unknown API routes
app.use('/api', (_req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada.' });
});

// Production: serve built frontend + SPA fallback
if (config.nodeEnv === 'production') {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const distDir = path.resolve(__dirname, '../dist');
  if (fs.existsSync(distDir)) {
    app.use(express.static(distDir));
    app.use((req, res, next) => {
      if (req.method !== 'GET' || req.path.startsWith('/api/')) {
        next();
        return;
      }
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }
}

// Error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err?.statusCode ?? err?.status;
  if (typeof status === 'number' && status >= 400 && status < 500) {
    res.status(status).json({
      error:
        err?.type === 'entity.too.large'
          ? 'El archivo supera el límite de tamaño (15 MB).'
          : 'Solicitud inválida.',
    });
    return;
  }
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor.' });
});

async function start() {
  await initDb();
  app.listen(config.port, () => {
    console.log(`EduPaz API → http://localhost:${config.port} (${config.nodeEnv})`);
  });
}

start().catch((e) => {
  console.error('No se pudo iniciar el servidor:', e);
  process.exit(1);
});
