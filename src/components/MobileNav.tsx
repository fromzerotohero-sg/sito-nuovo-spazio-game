import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Menu, X } from 'lucide-react';
import Logo from './Logo';

export interface MobileNavLink {
  label: string;
  to?: string;
  onClick?: () => void;
}

interface MobileNavProps {
  links: MobileNavLink[];
  className?: string;
}

export default function MobileNav({ links, className = '' }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <div className={`md:hidden ${className}`}>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center justify-center w-11 h-11 rounded-full nav-pill text-white"
        aria-label="Apri menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-[100]">
          <button
            type="button"
            className="absolute inset-0 bg-void-black/80 backdrop-blur-sm"
            aria-label="Chiudi menu"
            onClick={close}
          />
          <nav className="absolute top-0 right-0 h-full w-[min(100%,320px)] bg-void-dark border-l border-white/10 flex flex-col safe-area-top safe-area-bottom">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 gap-3">
              <Logo size="sm" linkTo="/" className="max-w-[160px]" />
              <button
                type="button"
                onClick={close}
                className="w-10 h-10 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/5"
                aria-label="Chiudi menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <ul className="flex-1 overflow-y-auto py-4 px-3">
              {links.map((link) => (
                <li key={link.label}>
                  {link.to ? (
                    <Link
                      to={link.to}
                      onClick={close}
                      className="block px-4 py-3.5 rounded-lg text-sm font-mono-custom uppercase tracking-wider text-white/80 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        link.onClick?.();
                        close();
                      }}
                      className="w-full text-left px-4 py-3.5 rounded-lg text-sm font-mono-custom uppercase tracking-wider text-white/80 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      {link.label}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
}
