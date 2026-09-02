import { SITE_IMAGES_BUCKET, supabase } from '../lib/supabase';
import { DEFAULT_PAGES, DEFAULT_SECTIONS } from './defaults';
import type { CmsPage, CmsSection } from './types';

function ensureDefaultBlocks(sections: CmsSection[]): CmsSection[] {
  if (sections.some((s) => s.page_slug === 'games' && s.type === 'provider_groups')) {
    return sections;
  }
  const template = DEFAULT_SECTIONS.find((s) => s.page_slug === 'games' && s.type === 'provider_groups');
  if (!template) return sections;

  const games = sections
    .filter((s) => s.page_slug === 'games')
    .sort((a, b) => a.sort_order - b.sort_order);
  const cta = games.find((s) => s.type === 'cta');
  const insertOrder = cta ? cta.sort_order : games.length;
  const injected: CmsSection = {
    ...JSON.parse(JSON.stringify(template)),
    id: crypto.randomUUID(),
    sort_order: insertOrder,
  };

  return [
    ...sections.map((s) =>
      s.page_slug === 'games' && s.sort_order >= insertOrder
        ? { ...s, sort_order: s.sort_order + 1 }
        : s,
    ),
    injected,
  ];
}

export async function fetchCms(): Promise<{ pages: CmsPage[]; sections: CmsSection[] }> {
  if (!supabase) {
    return { pages: DEFAULT_PAGES, sections: DEFAULT_SECTIONS };
  }

  const [{ data: pages, error: pageError }, { data: sections, error: sectionError }] = await Promise.all([
    supabase.from('site_pages').select('slug, title, path').order('slug'),
    supabase.from('site_sections').select('id, page_slug, type, label, sort_order, visible, layout, content').order('sort_order'),
  ]);

  if (pageError || sectionError) {
    return { pages: DEFAULT_PAGES, sections: DEFAULT_SECTIONS };
  }

  if (!pages?.length || !sections?.length) {
    return { pages: DEFAULT_PAGES, sections: DEFAULT_SECTIONS };
  }

  return {
    pages: pages as CmsPage[],
    sections: ensureDefaultBlocks(sections as CmsSection[]),
  };
}

export async function persistPages(pages: CmsPage[]): Promise<void> {
  if (!supabase) throw new Error('Supabase non configurato');
  const { error } = await supabase.from('site_pages').upsert(pages, { onConflict: 'slug' });
  if (error) throw error;
}

export async function persistSections(sections: CmsSection[]): Promise<void> {
  if (!supabase) throw new Error('Supabase non configurato');
  const payload = sections.map((s) => ({
    ...s,
    updated_at: new Date().toISOString(),
  }));
  const { error } = await supabase.from('site_sections').upsert(payload, { onConflict: 'id' });
  if (error) throw error;
}

export async function deleteSections(ids: string[]): Promise<void> {
  if (!supabase || ids.length === 0) return;
  const { error } = await supabase.from('site_sections').delete().in('id', ids);
  if (error) throw error;
}

export async function uploadCmsImage(file: File): Promise<string> {
  if (!supabase) throw new Error('Supabase non configurato');
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const storagePath = `cms/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from(SITE_IMAGES_BUCKET).upload(storagePath, file, {
    cacheControl: '3600',
    upsert: false,
  });
  if (error) throw error;
  const { data } = supabase.storage.from(SITE_IMAGES_BUCKET).getPublicUrl(storagePath);
  return data.publicUrl;
}

export async function seedCmsIfEmpty(): Promise<boolean> {
  if (!supabase) return false;
  const { count, error } = await supabase.from('site_sections').select('id', { count: 'exact', head: true });
  if (error) throw error;
  if ((count ?? 0) > 0) return false;
  await persistPages(DEFAULT_PAGES);
  await persistSections(DEFAULT_SECTIONS);
  return true;
}
