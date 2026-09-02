import { Link } from 'react-router';
import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';
import { useAppPath } from '../context/EditMode';

interface PageLayoutProps {
  children: React.ReactNode;
  title: React.ReactNode;
}

export default function PageLayout({ children, title }: PageLayoutProps) {
  const to = useAppPath();

  return (
    <div className="relative w-full min-h-screen bg-void-black">
      <SiteHeader variant="page" />

      <div className="overflow-x-hidden">
        <header className="relative pt-28 sm:pt-32 pb-10 sm:pb-16 px-4 sm:px-6 lg:px-12">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-2 mb-4 sm:mb-6 text-white/40 text-[10px] sm:text-xs tracking-[0.15em] sm:tracking-[0.2em] uppercase flex-wrap">
              <Link to={to('/')} className="hover:text-white transition-colors">
                Home
              </Link>
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

        <SiteFooter />
      </div>
    </div>
  );
}
