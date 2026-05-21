import { Link } from 'react-router';
import { Disc, Play, Calendar, Music, ArrowLeft } from 'lucide-react';
import { heroConfig } from '../config';
import Logo from './Logo';
import MobileNav from './MobileNav';

const ICON_MAP = {
  disc: Disc,
  play: Play,
  calendar: Calendar,
  music: Music,
};

interface SiteHeaderProps {
  variant?: 'home' | 'page';
  pageTitle?: string;
}

export default function SiteHeader({ variant = 'home' }: SiteHeaderProps) {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const mobileNavLinks =
    variant === 'home'
      ? [
          ...heroConfig.navItems.map((item) =>
            item.href
              ? { label: item.label, to: item.href }
              : { label: item.label, onClick: () => scrollToSection(item.sectionId) }
          ),
          {
            label: heroConfig.ctaPrimary,
            onClick: () => scrollToSection(heroConfig.ctaPrimaryTarget),
          },
          {
            label: heroConfig.ctaSecondary,
            onClick: () => scrollToSection(heroConfig.ctaSecondaryTarget),
          },
        ]
      : [
          { label: 'Home', to: '/' },
          ...heroConfig.navItems
            .filter((item) => item.href)
            .map((item) => ({ label: item.label, to: item.href! })),
        ];

  return (
    <header className="site-header-bar fixed top-0 left-0 right-0 z-[100] safe-area-top">
      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2 sm:gap-4 px-4 sm:px-6 py-3 sm:py-4 min-h-[56px]">
        <Logo size="md" />

        {variant === 'home' ? (
          <nav
            className="hidden md:flex items-center justify-center gap-0.5 nav-pill rounded-full px-2 py-1.5 border border-white/10 min-w-0"
            aria-label="Navigazione principale"
          >
            {heroConfig.navItems.map((item) => {
              const Icon = ICON_MAP[item.icon];
              if (item.href) {
                return (
                  <Link
                    key={item.label}
                    to={item.href}
                    className="flex items-center gap-1.5 px-3 py-2 text-[10px] lg:text-xs font-mono-custom uppercase tracking-wider text-white/80 hover:text-white transition-colors rounded-full hover:bg-white/5 whitespace-nowrap"
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              }
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => scrollToSection(item.sectionId)}
                  className="flex items-center gap-1.5 px-3 py-2 text-[10px] lg:text-xs font-mono-custom uppercase tracking-wider text-white/80 hover:text-white transition-colors rounded-full hover:bg-white/5 whitespace-nowrap"
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        ) : (
          <div className="hidden md:block" />
        )}

        <div className="flex items-center justify-end gap-2">
          <MobileNav links={mobileNavLinks} />
          {variant === 'page' && (
            <Link
              to="/"
              className="hidden md:flex items-center gap-2 text-white/60 hover:text-white text-xs tracking-[0.2em] uppercase transition-colors"
            >
              <ArrowLeft size={14} />
              Home
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
