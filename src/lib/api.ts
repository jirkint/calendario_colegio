import type { DayKey, LinkKind, TeacherActivity } from '../data/schedule';

export interface ActivityInput {
  day: DayKey;
  subject: string;
  title: string;
  description: string;
  links: { label: string; url: string; kind: LinkKind }[];
}

async function request<T>(url: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(url, {
    credentials: 'include',
    ...init,
    headers: {
      ...(init.body ? { 'Content-Type': 'application/json' } : {}),
      ...(init.headers ?? {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data as { error?: string }).error || 'Error de red. Intenta de nuevo.');
  }
  return data as T;
}

export const api = {
  me() {
    return request<{ name: string } | null>('/api/auth/me');
  },

  login(email: string, password: string) {
    return request<{ name: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  register(name: string, email: string, password: string, inviteCode: string) {
    return request<{ name: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, inviteCode }),
    });
  },

  logout() {
    return request<{ ok: boolean }>('/api/auth/logout', { method: 'POST' });
  },

  activities() {
    return request<TeacherActivity[]>('/api/activities');
  },

  createActivity(input: ActivityInput) {
    return request<TeacherActivity>('/api/activities', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  deleteActivity(id: string) {
    return request<{ ok: boolean }>(`/api/activities/${id}`, { method: 'DELETE' });
  },
};
