import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router';
import { ExternalLink, Loader2, LogOut, Save } from 'lucide-react';
import {
  isSupabaseConfigured,
  supabase,
  supabaseConfigError,
  SUPABASE_SETUP_HINT,
} from '../lib/supabase';
import { PAGE_ORDER } from '../cms/types';
import { useCms } from '../context/CmsProvider';
import { EditModeProvider } from '../context/EditMode';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

export default function AdminPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Modifica sito — SpazioGame';
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

  if (!isSupabaseConfigured) {
    const swappedKeyInUrl = supabaseConfigError === 'url_is_api_key';
    return (
      <div className="min-h-screen bg-void-black text-white p-8 max-w-2xl">
        <h1 className="text-2xl font-display mb-4">Configurazione</h1>
        {swappedKeyInUrl ? (
          <p className="text-red-400/90 text-sm">Le chiavi ambiente su Vercel sono invertite.</p>
        ) : (
          <p className="text-white/60">
            Aggiungi {SUPABASE_SETUP_HINT.urlName} e {SUPABASE_SETUP_HINT.keyName} su Vercel.
          </p>
        )}
        <Link to="/" className="inline-block mt-6 text-neon-cyan hover:underline">
          ← Torna al sito
        </Link>
      </div>
    );
  }

  if (authLoading) {
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
          <h1 className="text-2xl font-display mb-2">Modifica il sito</h1>
          <p className="text-white/50 text-sm mb-6">Accedi per cambiare testi, foto e layout.</p>
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
        <p className="text-white/60 text-sm mb-6">
          L&apos;account {sessionEmail} non è ancora abilitato come amministratore.
        </p>
        <Button type="button" variant="outline" className="border-white/20" onClick={() => void handleLogout()}>
          Esci
        </Button>
      </div>
    );
  }

  return (
    <EditModeProvider enabled>
      <AdminShell email={sessionEmail} onLogout={() => void handleLogout()}>
        <Outlet />
      </AdminShell>
    </EditModeProvider>
  );
}

function AdminShell({
  email,
  onLogout,
  children,
}: {
  email: string;
  onLogout: () => void;
  children: React.ReactNode;
}) {
  const { dirty, saving, save, seedIfNeeded } = useCms();
  const location = useLocation();
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  useEffect(() => {
    void seedIfNeeded();
  }, [seedIfNeeded]);

  useEffect(() => {
    document.body.classList.add('cms-editing');
    return () => document.body.classList.remove('cms-editing');
  }, []);

  const publicPath = location.pathname.replace(/^\/admin/, '') || '/';

  async function handleSave() {
    setSaveMsg(null);
    try {
      await save();
      setSaveMsg('Salvato');
      setTimeout(() => setSaveMsg(null), 2000);
    } catch (err) {
      setSaveMsg(err instanceof Error ? err.message : 'Errore nel salvataggio');
    }
  }

  return (
    <div className="min-h-screen bg-void-black">
      <div className="fixed top-0 left-0 right-0 z-[200] h-14 border-b border-white/10 bg-void-black/95 backdrop-blur flex items-center gap-3 px-3 sm:px-4">
        <span className="hidden sm:block text-xs uppercase tracking-wider text-neon-cyan shrink-0">
          Modifica
        </span>
        <nav className="flex-1 flex items-center gap-1 overflow-x-auto">
          {PAGE_ORDER.map((page) => {
            const to = page.path === '/' ? '/admin' : `/admin${page.path}`;
            return (
              <NavLink
                key={page.slug}
                to={to}
                end={page.path === '/'}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-full text-xs uppercase tracking-wider whitespace-nowrap ${
                    isActive ? 'bg-neon-cyan text-void-black' : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                {page.title}
              </NavLink>
            );
          })}
        </nav>
        <div className="flex items-center gap-2 shrink-0">
          {saveMsg && <span className="text-[11px] text-neon-cyan hidden sm:inline">{saveMsg}</span>}
          <Button
            type="button"
            size="sm"
            className="bg-neon-cyan text-void-black hover:bg-white"
            disabled={saving || !dirty}
            onClick={() => void handleSave()}
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            Salva
          </Button>
          <a
            href={publicPath}
            className="hidden sm:inline-flex items-center gap-1 text-xs text-white/50 hover:text-white"
            target="_blank"
            rel="noreferrer"
          >
            <ExternalLink size={12} />
            Vedi sito
          </a>
          <button type="button" className="text-white/40 hover:text-white p-1" title={`Esci (${email})`} onClick={onLogout}>
            <LogOut size={14} />
          </button>
        </div>
      </div>
      <div className="pt-14">{children}</div>
    </div>
  );
}
