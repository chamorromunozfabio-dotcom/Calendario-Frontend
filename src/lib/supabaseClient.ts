import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const supabaseConfigured = Boolean(url && anon && !url.includes('tu-proyecto'));

export const supabase = createClient(
  url || 'https://placeholder.supabase.co',
  anon || 'placeholder-anon-key',
  { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } }
);

export const API_URL = (import.meta.env.VITE_API_URL as string | undefined) || 'http://localhost:8000';

/** Llama al backend FastAPI con el token de Supabase (si hay sesión). */
export async function apiFetch(path: string, init: RequestInit = {}) {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  const headers: Record<string, string> = { 'Content-Type': 'application/json', ...((init.headers as Record<string,string>) || {}) };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_URL}${path}`, { ...init, headers });
  if (!res.ok) {
    let detail = `Error ${res.status}`;
    try { const j = await res.json(); detail = j.detail || detail; } catch { /* texto */ }
    throw new Error(detail);
  }
  if (res.status === 204) return null;
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}
