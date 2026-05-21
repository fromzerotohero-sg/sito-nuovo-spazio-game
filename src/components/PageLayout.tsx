import { Link, useLocation } from 'react-router';
import { Disc, Play, Calendar, Music, ArrowLeft } from 'lucide-react';

interface PageLayoutProps {
  children: React.ReactNode;
  title: string;
}

export default function PageLayout({ children, title }: PageLayoutProps) {
  const location = useLocation();

  return (
    <div className="relative w-full min-h-screen bg-void-black overflow-x-hidden">
      {/* Fixed Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 lg:px-12 py-5">
        {/* Logo */}
        <Link
          to="/"
          className="relative z-10 text-white font-display text-xl tracking-[0.15em] uppercase"
        >
          SPAZIOGAME
        </Link>

        {/* Center Navigation Pills */}
        <div className="hidden md:flex items-center gap-1 bg-white/5 backdrop-blur-xl rounded-full px-2 py-1.5 border border-white/10">
          <NavPill to="/games" icon={<Disc size={14} />} label="Games" active={location.pathname === '/games'} />
          <NavPill to="/cabinet" icon={<Play size={14} />} label="Cabinet" active={location.pathname === '/cabinet'} />
          <NavPill to="/monitor" icon={<Calendar size={14} />} label="Monitor" active={location.pathname === '/monitor'} />
          <NavPill to="/accessori" icon={<Music size={14} />} label="Accessori" active={location.pathname === '/accessori'} />
        </div>

        {/* Back to Home */}
        <Link
          to="/"
          className="relative z-10 flex items-center gap-2 text-white/60 hover:text-white text-xs tracking-[0.2em] uppercase transition-colors"
        >
          <ArrowLeft size={14} />
          <span className="hidden sm:inline">Home</span>
        </Link>
      </nav>

      {/* Page Header */}
      <header className="relative pt-32 pb-16 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-6 text-white/40 text-xs tracking-[0.2em] uppercase">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white">{title}</span>
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display text-white uppercase tracking-tight">
            {title}
          </h1>

          {/* Decorative line */}
          <div className="mt-8 w-24 h-px bg-gradient-to-r from-neon-cyan to-transparent" />
        </div>
      </header>

      {/* Page Content */}
      <main className="relative">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative py-16 px-6 lg:px-12 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8">
            <div>
              <Link to="/" className="text-white font-display text-xl tracking-[0.15em] uppercase">
                SPAZIOGAME
              </Link>
              <p className="mt-4 text-white/40 text-sm max-w-md">
                Spazio Game è un'azienda dinamica e giovane con sede a Soncino (CR).
                Offriamo un servizio a 360°: schede di gioco comma 6a, cabinet, monitor,
                accessori e assistenza tecnica.
              </p>
            </div>

            <div className="flex gap-12">
              <div>
                <h4 className="text-white/60 text-xs tracking-[0.2em] uppercase mb-4">Link Rapidi</h4>
                <ul className="space-y-2">
                  <li><Link to="/games" className="text-white/40 hover:text-white text-sm transition-colors">Games</Link></li>
                  <li><Link to="/cabinet" className="text-white/40 hover:text-white text-sm transition-colors">Cabinet</Link></li>
                  <li><Link to="/monitor" className="text-white/40 hover:text-white text-sm transition-colors">Monitor</Link></li>
                  <li><Link to="/accessori" className="text-white/40 hover:text-white text-sm transition-colors">Accessori</Link></li>
                  <li><Link to="/assistenza" className="text-white/40 hover:text-white text-sm transition-colors">Assistenza</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="text-white/60 text-xs tracking-[0.2em] uppercase mb-4">Contatti</h4>
                <ul className="space-y-2 text-white/40 text-sm">
                  <li>info@spaziogame.net</li>
                  <li>+39 0374 871615</li>
                  <li>Via Caduti sul Lavoro, snc</li>
                  <li>26029 Soncino (CR)</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/30 text-xs">
              © 2024 Spazio Game srls - P.iva 01625480197. Tutti i diritti riservati.
            </p>
            <div className="flex gap-6 text-white/30 text-xs">
              <span>Privacy Policy</span>
              <span>Termini di Servizio</span>
              <span>Cookie Policy</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function NavPill({ to, icon, label, active }: { to: string; icon: React.ReactNode; label: string; active: boolean }) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs tracking-[0.15em] uppercase transition-all duration-300 ${
        active
          ? 'bg-neon-cyan text-void-black font-medium'
          : 'text-white/60 hover:text-white hover:bg-white/5'
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}
