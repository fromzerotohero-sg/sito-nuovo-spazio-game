import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import { Loader2, LogOut, RotateCcw, Upload } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  resetSiteAssetToDefault,
  uploadSiteAsset,
  type SiteAssetRow,
} from '../lib/siteAssets';
import { useSiteAssets } from '../context/SiteAssetsProvider';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

export default function AdminPage() {
  const { assets, refresh, resolve, ready } = useSiteAssets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Admin — SpazioGame';
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  useEffect(() => {
    if (!supabase) {
      setAuthLoading(false);
      return;
    }
    const client = supabase;
    async function syncSession() {
      const { data } = await client.auth.getSession();
      const user = data.session?.user ?? null;
      setSessionEmail(user?.email ?? null);
      setUserId(user?.id ?? null);
      if (user?.id) {
        const { data: adminRow } = await client
          .from('site_admins')
          .select('user_id')
          .eq('user_id', user.id)
          .maybeSingle();
        setIsAdmin(Boolean(adminRow));
      } else {
        setIsAdmin(false);
      }
      setAuthLoading(false);
    }
    void syncSession();
    const { data: sub } = client.auth.onAuthStateChange((_event, session) => {
      setSessionEmail(session?.user.email ?? null);
      setUserId(session?.user.id ?? null);
      if (session?.user.id) {
        void client
          .from('site_admins')
          .select('user_id')
          .eq('user_id', session.user.id)
          .maybeSingle()
          .then(({ data: adminRow }) => setIsAdmin(Boolean(adminRow)));
      } else {
        setIsAdmin(false);
      }
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const grouped = useMemo(() => {
    const map = new Map<string, SiteAssetRow[]>();
    for (const row of assets) {
      const list = map.get(row.section) ?? [];
      list.push(row);
      map.set(row.section, list);
    }
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [assets]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase) return;
    setMessage(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setMessage(error.message);
  }

  async function handleLogout() {
    if (!supabase) return;
    await supabase.auth.signOut();
    setMessage(null);
  }

  async function handleUpload(key: string, file: File) {
    setBusyKey(key);
    setMessage(null);
    try {
      await uploadSiteAsset(key, file);
      await refresh();
      setMessage(`Immagine aggiornata: ${key}`);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Errore upload');
    } finally {
      setBusyKey(null);
    }
  }

  async function handleReset(key: string) {
    setBusyKey(key);
    setMessage(null);
    try {
      await resetSiteAssetToDefault(key);
      await refresh();
      setMessage(`Ripristinata immagine predefinita: ${key}`);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Errore ripristino');
    } finally {
      setBusyKey(null);
    }
  }

  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen bg-void-black text-white p-8">
        <h1 className="text-2xl font-display mb-4">Admin</h1>
        <p className="text-white/60 max-w-lg">
          Supabase non configurato. Aggiungi <code className="text-neon-cyan">VITE_SUPABASE_URL</code> e{' '}
          <code className="text-neon-cyan">VITE_SUPABASE_ANON_KEY</code> su Vercel e in un file{' '}
          <code className="text-neon-cyan">.env.local</code>.
        </p>
        <Link to="/" className="inline-block mt-6 text-neon-cyan hover:underline">
          ← Torna al sito
        </Link>
      </div>
    );
  }

  if (authLoading || !ready) {
    return (
      <div className="min-h-screen bg-void-black flex items-center justify-center text-white/60">
        <Loader2 className="animate-spin mr-2" size={20} />
        Caricamento…
      </div>
    );
  }

  if (!sessionEmail || !userId) {
    return (
      <div className="min-h-screen bg-void-black text-white flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md border border-white/10 rounded-xl p-8 bg-void-dark/80">
          <h1 className="text-2xl font-display mb-2">Admin SpazioGame</h1>
          <p className="text-white/50 text-sm mb-6">
            Accedi con l&apos;utente creato in Supabase → Authentication → Users.
          </p>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-white/70">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 bg-void-black border-white/20"
                required
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-white/70">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 bg-void-black border-white/20"
                required
              />
            </div>
            {message && <p className="text-red-400 text-sm">{message}</p>}
            <Button type="submit" className="w-full bg-neon-cyan text-void-black hover:bg-white">
              Accedi
            </Button>
          </form>
          <Link to="/" className="block text-center mt-6 text-sm text-white/40 hover:text-neon-cyan">
            ← Sito pubblico
          </Link>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-void-black text-white p-8 max-w-xl mx-auto">
        <h1 className="text-2xl font-display mb-4">Accesso negato</h1>
        <p className="text-white/60 text-sm leading-relaxed mb-4">
          L&apos;account <strong className="text-white">{sessionEmail}</strong> è autenticato ma non è
          ancora abilitato come amministratore.
        </p>
        <p className="text-white/50 text-sm leading-relaxed mb-6">
          In Supabase → SQL Editor esegui (sostituisci l&apos;email):
        </p>
        <pre className="text-xs bg-void-dark border border-white/10 rounded-lg p-4 overflow-x-auto text-neon-cyan/90 mb-6">
{`insert into public.site_admins (user_id)
select id from auth.users
where email = 'tua-email@dominio.it'
on conflict (user_id) do nothing;`}
        </pre>
        <p className="text-[11px] text-white/30 font-mono break-all mb-6">user_id: {userId}</p>
        <div className="flex gap-3">
          <Button type="button" variant="outline" className="border-white/20" onClick={() => void handleLogout()}>
            Esci
          </Button>
          <Link to="/" className="text-sm text-neon-cyan hover:underline self-center">
            ← Sito
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-void-black text-white">
      <header className="sticky top-0 z-10 border-b border-white/10 bg-void-black/95 backdrop-blur px-4 sm:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-display">Gestione immagini</h1>
          <p className="text-white/40 text-xs mt-1">{sessionEmail}</p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/" className="text-sm text-white/50 hover:text-neon-cyan">
            Vedi sito
          </Link>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="border-white/20"
            onClick={() => void handleLogout()}
          >
            <LogOut size={14} className="mr-1" />
            Esci
          </Button>
        </div>
      </header>

      <main className="p-4 sm:p-8 max-w-6xl mx-auto">
        {message && (
          <p className="mb-6 text-sm text-neon-cyan border border-neon-cyan/30 rounded-lg px-4 py-2 bg-neon-cyan/5">
            {message}
          </p>
        )}
        <p className="text-white/50 text-sm mb-8 max-w-2xl">
          Carica una nuova immagine per ogni slot. Il sito pubblico userà subito la versione su Supabase
          Storage (senza ridistribuire su Vercel). &quot;Ripristina&quot; torna al file in{' '}
          <code className="text-white/70">public/</code>.
        </p>

        {grouped.map(([section, rows]) => (
          <section key={section} className="mb-12">
            <h2 className="text-lg font-display text-neon-cyan mb-4 uppercase tracking-wider">{section}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {rows.map((row) => {
                const preview = resolve(row.key, row.default_path);
                const isCustom = Boolean(row.storage_path);
                const busy = busyKey === row.key;
                return (
                  <article
                    key={row.key}
                    className="border border-white/10 rounded-lg overflow-hidden bg-void-dark/50"
                  >
                    <div className="aspect-video bg-void-black relative">
                      <img src={preview} alt={row.label} className="w-full h-full object-cover" />
                      {isCustom && (
                        <span className="absolute top-2 right-2 text-[10px] uppercase tracking-wider bg-neon-cyan text-void-black px-2 py-0.5 rounded">
                          Supabase
                        </span>
                      )}
                    </div>
                    <div className="p-3 space-y-2">
                      <p className="font-medium text-sm">{row.label}</p>
                      <p className="text-[10px] text-white/30 font-mono break-all">{row.key}</p>
                      <div className="flex flex-wrap gap-2">
                        <label
                          className={`inline-flex items-center justify-center gap-1 h-8 px-3 text-sm rounded-md font-medium bg-neon-cyan text-void-black hover:bg-white cursor-pointer ${
                            busy ? 'opacity-50 pointer-events-none' : ''
                          }`}
                        >
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/gif"
                            className="sr-only"
                            disabled={busy}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) void handleUpload(row.key, file);
                              e.target.value = '';
                            }}
                          />
                          {busy ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <Upload size={14} />
                          )}
                          Carica
                        </label>
                        {isCustom && (
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="border-white/20"
                            disabled={busy}
                            onClick={() => void handleReset(row.key)}
                          >
                            <RotateCcw size={14} className="mr-1" />
                            Ripristina
                          </Button>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
