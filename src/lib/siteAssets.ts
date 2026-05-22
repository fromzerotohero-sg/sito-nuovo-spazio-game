import { SITE_IMAGES_BUCKET, supabase } from './supabase';

export type SiteAssetRow = {
  key: string;
  label: string;
  section: string;
  default_path: string;
  storage_path: string | null;
  updated_at: string;
};

export function storagePublicUrl(storagePath: string): string {
  if (!supabase) return '';
  const { data } = supabase.storage.from(SITE_IMAGES_BUCKET).getPublicUrl(storagePath);
  return data.publicUrl;
}

export function resolveAssetUrl(
  row: Pick<SiteAssetRow, 'storage_path' | 'default_path'> | undefined,
  fallback: string,
): string {
  if (row?.storage_path) {
    return storagePublicUrl(row.storage_path);
  }
  return row?.default_path ?? fallback;
}

export async function fetchSiteAssets(): Promise<SiteAssetRow[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('site_assets')
    .select('key, label, section, default_path, storage_path, updated_at')
    .order('section')
    .order('label');
  if (error) throw error;
  return data ?? [];
}

export async function uploadSiteAsset(key: string, file: File): Promise<string> {
  if (!supabase) throw new Error('Supabase non configurato');

  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const safeKey = key.replace(/[^a-z0-9._-]/gi, '-');
  const storagePath = `${safeKey}/${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(SITE_IMAGES_BUCKET)
    .upload(storagePath, file, {
      cacheControl: '3600',
      upsert: false,
    });
  if (uploadError) throw uploadError;

  const { error: dbError } = await supabase
    .from('site_assets')
    .update({ storage_path: storagePath, updated_at: new Date().toISOString() })
    .eq('key', key);
  if (dbError) throw dbError;

  return storagePublicUrl(storagePath);
}

export async function resetSiteAssetToDefault(key: string): Promise<void> {
  if (!supabase) throw new Error('Supabase non configurato');
  const { error } = await supabase
    .from('site_assets')
    .update({ storage_path: null, updated_at: new Date().toISOString() })
    .eq('key', key);
  if (error) throw error;
}
