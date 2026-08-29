import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { ADDABLE_SECTIONS } from '../cms/catalog';
import { deleteSections, fetchCms, persistPages, persistSections, seedCmsIfEmpty } from '../cms/api';
import { DEFAULT_PAGES, DEFAULT_SECTIONS } from '../cms/defaults';
import type { CmsPage, CmsSection, SectionLayout, SectionType } from '../cms/types';

type CmsContextValue = {
  ready: boolean;
  dirty: boolean;
  saving: boolean;
  pages: CmsPage[];
  sections: CmsSection[];
  getPage: (slug: string) => CmsPage | undefined;
  getSections: (slug: string) => CmsSection[];
  getFooter: () => CmsSection | undefined;
  getHero: () => CmsSection | undefined;
  updatePageTitle: (slug: string, title: string) => void;
  patchContent: (id: string, content: Record<string, unknown>) => void;
  patchLayout: (id: string, layout: SectionLayout) => void;
  setVisible: (id: string, visible: boolean) => void;
  moveSection: (id: string, direction: -1 | 1) => void;
  removeSection: (id: string) => void;
  addSection: (pageSlug: string, type: SectionType, afterId?: string) => void;
  save: () => Promise<void>;
  seedIfNeeded: () => Promise<void>;
};

const CmsContext = createContext<CmsContextValue | null>(null);

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export function CmsProvider({ children }: { children: ReactNode }) {
  const [pages, setPages] = useState<CmsPage[]>(DEFAULT_PAGES);
  const [sections, setSections] = useState<CmsSection[]>(DEFAULT_SECTIONS);
  const [ready, setReady] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletedIds, setDeletedIds] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    void fetchCms()
      .then((data) => {
        if (cancelled) return;
        setPages(data.pages);
        setSections(data.sections);
      })
      .finally(() => {
        if (!cancelled) setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const markDirty = useCallback(() => setDirty(true), []);

  const getPage = useCallback((slug: string) => pages.find((p) => p.slug === slug), [pages]);

  const getSections = useCallback(
    (slug: string) =>
      sections.filter((s) => s.page_slug === slug).sort((a, b) => a.sort_order - b.sort_order),
    [sections],
  );

  const getFooter = useCallback(
    () => sections.find((s) => s.page_slug === 'home' && s.type === 'footer'),
    [sections],
  );

  const getHero = useCallback(
    () => sections.find((s) => s.page_slug === 'home' && s.type === 'hero'),
    [sections],
  );

  const updatePageTitle = useCallback((slug: string, title: string) => {
    setPages((prev) => prev.map((p) => (p.slug === slug ? { ...p, title } : p)));
    markDirty();
  }, [markDirty]);

  const patchContent = useCallback((id: string, content: Record<string, unknown>) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, content: { ...s.content, ...content } } : s)),
    );
    markDirty();
  }, [markDirty]);

  const patchLayout = useCallback((id: string, layout: SectionLayout) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, layout: { ...s.layout, ...layout } } : s)),
    );
    markDirty();
  }, [markDirty]);

  const setVisible = useCallback((id: string, visible: boolean) => {
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, visible } : s)));
    markDirty();
  }, [markDirty]);

  const moveSection = useCallback((id: string, direction: -1 | 1) => {
    setSections((prev) => {
      const current = prev.find((s) => s.id === id);
      if (!current) return prev;
      const pageItems = prev
        .filter((s) => s.page_slug === current.page_slug)
        .sort((a, b) => a.sort_order - b.sort_order);
      const index = pageItems.findIndex((s) => s.id === id);
      const target = index + direction;
      if (target < 0 || target >= pageItems.length) return prev;
      const swapped = [...pageItems];
      [swapped[index], swapped[target]] = [swapped[target], swapped[index]];
      const order = new Map(swapped.map((s, i) => [s.id, i]));
      return prev.map((s) =>
        order.has(s.id) ? { ...s, sort_order: order.get(s.id)! } : s,
      );
    });
    markDirty();
  }, [markDirty]);

  const removeSection = useCallback((id: string) => {
    setSections((prev) => prev.filter((s) => s.id !== id));
    setDeletedIds((prev) => [...prev, id]);
    markDirty();
  }, [markDirty]);

  const addSection = useCallback((pageSlug: string, type: SectionType, afterId?: string) => {
    const template = ADDABLE_SECTIONS.find((s) => s.type === type);
    if (!template) return;
    setSections((prev) => {
      const pageItems = prev
        .filter((s) => s.page_slug === pageSlug)
        .sort((a, b) => a.sort_order - b.sort_order);
      const afterIndex = afterId ? pageItems.findIndex((s) => s.id === afterId) : pageItems.length - 1;
      const insertAt = afterIndex + 1;
      const newSection: CmsSection = {
        id: crypto.randomUUID(),
        page_slug: pageSlug,
        type: template.type,
        label: template.label,
        sort_order: insertAt,
        visible: true,
        layout: clone(template.layout),
        content: clone(template.content),
      };
      const nextPage = [...pageItems];
      nextPage.splice(insertAt, 0, newSection);
      const others = prev.filter((s) => s.page_slug !== pageSlug);
      return [
        ...others,
        ...nextPage.map((s, i) => ({ ...s, sort_order: i })),
      ];
    });
    markDirty();
  }, [markDirty]);

  const save = useCallback(async () => {
    setSaving(true);
    try {
      if (deletedIds.length) {
        await deleteSections(deletedIds);
        setDeletedIds([]);
      }
      await persistPages(pages);
      await persistSections(sections);
      setDirty(false);
    } finally {
      setSaving(false);
    }
  }, [deletedIds, pages, sections]);

  const seedIfNeeded = useCallback(async () => {
    try {
      const seeded = await seedCmsIfEmpty();
      if (seeded) {
        const data = await fetchCms();
        setPages(data.pages);
        setSections(data.sections);
        setDirty(false);
      }
    } catch {
      // keep local defaults
    }
  }, []);

  const value = useMemo(
    () => ({
      ready,
      dirty,
      saving,
      pages,
      sections,
      getPage,
      getSections,
      getFooter,
      getHero,
      updatePageTitle,
      patchContent,
      patchLayout,
      setVisible,
      moveSection,
      removeSection,
      addSection,
      save,
      seedIfNeeded,
    }),
    [
      ready,
      dirty,
      saving,
      pages,
      sections,
      getPage,
      getSections,
      getFooter,
      getHero,
      updatePageTitle,
      patchContent,
      patchLayout,
      setVisible,
      moveSection,
      removeSection,
      addSection,
      save,
      seedIfNeeded,
    ],
  );

  return <CmsContext.Provider value={value}>{children}</CmsContext.Provider>;
}

export function useCms() {
  const ctx = useContext(CmsContext);
  if (!ctx) throw new Error('useCms must be used within CmsProvider');
  return ctx;
}
