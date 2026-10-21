import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { NextFunction, Request, Response } from 'express';
import { config } from './config.js';

export function hashPassword(pw: string): string {
  return bcrypt.hashSync(pw, 10);
}

export function verifyPassword(pw: string, hash: string): boolean {
  return bcrypt.compareSync(pw, hash);
}

export interface JwtPayload {
  sub: string;
  name: string;
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: '7d' });
}

export function setAuthCookie(res: Response, token: string): void {
  res.cookie(config.cookieName, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: config.nodeEnv === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  });
}

export function clearAuthCookie(res: Response): void {
  res.clearCookie(config.cookieName, { path: '/' });
}

export interface AuthUser {
  id: number;
  name: string;
}

function readAuth(req: Request): AuthUser | null {
  const token = req.cookies?.[config.cookieName];
  if (!token) return null;
  try {
    const payload = jwt.verify(token, config.jwtSecret) as JwtPayload;
    return { id: Number(payload.sub), name: payload.name };
  } catch {
    return null;
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const auth = readAuth(req);
  if (!auth) {
    res.status(401).json({ error: 'No autenticado' });
    return;
  }
  req.auth = auth;
  next();
}

export function optionalAuth(req: Request, _res: Response, next: NextFunction): void {
  const auth = readAuth(req);
  if (auth) req.auth = auth;
  next();
}

declare global {
  namespace Express {
    interface Request {
      auth?: AuthUser;
    }
  }
}
