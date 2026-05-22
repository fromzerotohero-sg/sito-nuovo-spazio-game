import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  fetchSiteAssets,
  resolveAssetUrl,
  type SiteAssetRow,
} from '../lib/siteAssets';
import { isSupabaseConfigured } from '../lib/supabase';

type SiteAssetsContextValue = {
  ready: boolean;
  configured: boolean;
  assets: SiteAssetRow[];
  resolve: (key: string, fallback: string) => string;
  refresh: () => Promise<void>;
};

const SiteAssetsContext = createContext<SiteAssetsContextValue | null>(null);

export function SiteAssetsProvider({ children }: { children: ReactNode }) {
  const [assets, setAssets] = useState<SiteAssetRow[]>([]);
  const [ready, setReady] = useState(!isSupabaseConfigured);

  const load = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setReady(true);
      return;
    }
    try {
      const rows = await fetchSiteAssets();
      setAssets(rows);
    } catch {
      setAssets([]);
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const byKey = useMemo(() => new Map(assets.map((a) => [a.key, a])), [assets]);

  const resolve = useCallback(
    (key: string, fallback: string) => resolveAssetUrl(byKey.get(key), fallback),
    [byKey],
  );

  const value = useMemo(
    () => ({
      ready,
      configured: isSupabaseConfigured,
      assets,
      resolve,
      refresh: load,
    }),
    [ready, assets, resolve, load],
  );

  return (
    <SiteAssetsContext.Provider value={value}>{children}</SiteAssetsContext.Provider>
  );
}

export function useSiteAssets() {
  const ctx = useContext(SiteAssetsContext);
  if (!ctx) {
    throw new Error('useSiteAssets must be used within SiteAssetsProvider');
  }
  return ctx;
}

export function useSiteAsset(key: string, fallback: string): string {
  const { resolve, ready } = useSiteAssets();
  if (!ready) return fallback;
  return resolve(key, fallback);
}
