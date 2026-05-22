import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export type SupabaseConfigError =
  | 'missing'
  | 'url_is_api_key'
  | 'invalid_url'
  | 'missing_key';

function trimEnv(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim().replace(/^['"]|['"]$/g, '');
  return trimmed || undefined;
}

function looksLikeApiKey(value: string): boolean {
  return (
    value.startsWith('sb_publishable_') ||
    value.startsWith('sb_secret_') ||
    value.startsWith('eyJ')
  );
}

function looksLikeProjectUrl(value: string): boolean {
  return value.includes('supabase.co');
}

function normalizeSupabaseUrl(raw: string | undefined): string | null {
  if (!raw) return null;
  if (looksLikeApiKey(raw)) return null;

  const withProtocol =
    raw.startsWith('http://') || raw.startsWith('https://') ? raw : `https://${raw}`;

  try {
    const url = new URL(withProtocol);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;
    if (!url.hostname.includes('supabase.co')) return null;
    return url.origin;
  } catch {
    return null;
  }
}

function resolveEnvPair(): {
  url: string | null;
  key: string | undefined;
  error: SupabaseConfigError | null;
} {
  let urlRaw = trimEnv(import.meta.env.VITE_SUPABASE_URL);
  let keyRaw = trimEnv(import.meta.env.VITE_SUPABASE_ANON_KEY);

  // Common Vercel mistake: publishable key pasted into URL variable
  if (urlRaw && looksLikeApiKey(urlRaw) && keyRaw && looksLikeProjectUrl(keyRaw)) {
    [urlRaw, keyRaw] = [keyRaw, urlRaw];
  }

  if (urlRaw && looksLikeApiKey(urlRaw)) {
    return { url: null, key: keyRaw, error: 'url_is_api_key' };
  }

  const url = normalizeSupabaseUrl(urlRaw);
  if (!urlRaw && !keyRaw) {
    return { url: null, key: undefined, error: 'missing' };
  }
  if (urlRaw && !url) {
    return { url: null, key: keyRaw, error: 'invalid_url' };
  }
  if (!keyRaw) {
    return { url, key: undefined, error: 'missing_key' };
  }

  return { url, key: keyRaw, error: null };
}

const resolved = resolveEnvPair();

export const supabaseConfigError = resolved.error;
export const isSupabaseConfigured = Boolean(resolved.url && resolved.key && !resolved.error);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(resolved.url!, resolved.key!)
  : null;

export const SITE_IMAGES_BUCKET = 'site-images';

export const SUPABASE_SETUP_HINT = {
  url: 'https://zcgynarwbouaaamioegr.supabase.co',
  keyName: 'VITE_SUPABASE_ANON_KEY',
  urlName: 'VITE_SUPABASE_URL',
} as const;
