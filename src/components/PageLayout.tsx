import { Link, useLocation } from 'react-router';
import { Disc, Play, Calendar, Music, Wrench } from 'lucide-react';
import SiteHeader from './SiteHeader';
import { useCms } from '../context/CmsProvider';
import { useAppPath } from '../context/EditMode';

interface PageLayoutProps {
  children: React.ReactNode;
  title: React.ReactNode;
}

const PAGE_NAV = [
  { to: '/games', label: 'Games' },
  { to: '/cabinet', label: 'Cabinet' },
  { to: '/monitor', label: 'Monitor' },
  { to: '/accessori', label: 'Accessori' },
  { to: '/assistenza', label: 'Assistenza' },
];

export default function PageLayout({ children, title }: PageLayoutProps) {
  const location = useLocation();
  const to = useAppPath();
  const { getFooter } = useCms();
  const footer = getFooter()?.content as Record<string, string> | undefined;
  const email = footer?.email || 'info@spaziogame.net';
  const phone = footer?.phone || '+39 0374 871615';
  const address = footer?.address || 'Via Caduti sul Lavoro, snc, 26029 Soncino (CR)';
  const brandDescription =
    footer?.brandDescription ||
    "Spazio Game è un'azienda dinamica e giovane con sede a Soncino (CR). Offriamo un servizio a 360°: schede di gioco comma 6a, cabinet, monitor, accessori e assistenza tecnica.";
  const copyright = footer?.copyrightText || '© 2024 Spazio Game srls - P.iva 01625480197. Tutti i diritti riservati.';

  return (
    <div className="relative w-full min-h-screen bg-void-black overflow-x-hidden">
      <SiteHeader variant="page" />

      <nav className="page-subnav hidden lg:flex fixed top-[4.5rem] left-1/2 -translate-x-1/2 z-[90] items-center gap-1 bg-white/5 backdrop-blur-xl rounded-full px-2 py-1.5 border border-white/10">
        <NavPill to={to('/games')} icon={<Disc size={14} />} label="Games" active={location.pathname.endsWith('/games')} />
        <NavPill to={to('/cabinet')} icon={<Play size={14} />} label="Cabinet" active={location.pathname.endsWith('/cabinet')} />
        <NavPill to={to('/monitor')} icon={<Calendar size={14} />} label="Monitor" active={location.pathname.endsWith('/monitor')} />
        <NavPill to={to('/accessori')} icon={<Music size={14} />} label="Accessori" active={location.pathname.endsWith('/accessori')} />
        <NavPill to={to('/assistenza')} icon={<Wrench size={14} />} label="Assistenza" active={location.pathname.endsWith('/assistenza')} />
      </nav>

      <header className="relative pt-28 sm:pt-36 lg:pt-40 pb-10 sm:pb-16 px-4 sm:px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 mb-4 sm:mb-6 text-white/40 text-[10px] sm:text-xs tracking-[0.15em] sm:tracking-[0.2em] uppercase flex-wrap">
            <Link to={to('/')} className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white">{title}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-display text-white uppercase tracking-tight leading-[0.95]">
            {title}
          </h1>

          <div className="mt-6 sm:mt-8 w-24 h-px bg-gradient-to-r from-neon-cyan to-transparent" />
        </div>
      </header>

      <main className="relative">{children}</main>

      <footer className="relative py-12 sm:py-16 px-4 sm:px-6 lg:px-12 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col gap-10 md:flex-row md:justify-between md:items-start">
            <div className="min-w-0">
              <span className="text-white font-display text-lg sm:text-xl tracking-[0.15em] uppercase">SPAZIOGAME</span>
              <p className="mt-4 text-white/40 text-sm max-w-md leading-relaxed">
                {brandDescription}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 sm:gap-12 sm:flex sm:flex-row">
              <div>
                <h4 className="text-white/60 text-xs tracking-[0.2em] uppercase mb-4">Link Rapidi</h4>
                <ul className="space-y-2">
                  {PAGE_NAV.map((item) => (
                    <li key={item.to}>
                      <Link
                        to={to(item.to)}
                        className="text-white/40 hover:text-white text-sm transition-colors"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-white/60 text-xs tracking-[0.2em] uppercase mb-4">Contatti</h4>
                <ul className="space-y-2 text-white/40 text-sm">
                  <li>
                    <a href={`mailto:${email}`} className="hover:text-white break-all">
                      {email}
                    </a>
                  </li>
                  <li>
                    <a href={`tel:${phone.replace(/\s/g, '')}`} className="hover:text-white">
                      {phone}
                    </a>
                  </li>
                  <li>{address}</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-10 sm:mt-12 pt-8 border-t border-white/5 flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
            <p className="text-white/30 text-xs text-center sm:text-left">
              {copyright}
            </p>
            <div className="flex flex-wrap justify-center sm:justify-end gap-4 sm:gap-6 text-white/30 text-xs">
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
      className={`flex items-center gap-2 px-3 lg:px-4 py-2 rounded-full text-xs tracking-[0.15em] uppercase transition-all duration-300 ${
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
