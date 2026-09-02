import { Link } from 'react-router';
import { useCms } from '../context/CmsProvider';
import { useAppPath, useIsEditing } from '../context/EditMode';
import EditableImage from './cms/EditableImage';
import EditableText from './cms/EditableText';

const PAGE_NAV = [
  { to: '/games', label: 'Games' },
  { to: '/cabinet', label: 'Cabinet' },
  { to: '/monitor', label: 'Monitor' },
  { to: '/accessori', label: 'Accessori' },
  { to: '/assistenza', label: 'Assistenza' },
];

export default function SiteFooter() {
  const to = useAppPath();
  const editing = useIsEditing();
  const { getFooter, patchContent } = useCms();
  const footer = getFooter();
  const content = (footer?.content ?? {}) as Record<string, string>;
  const id = footer?.id;

  const email = content.email || 'info@spaziogame.net';
  const phone = content.phone || '+39 0374 871615';
  const address = content.address || 'Via Caduti sul Lavoro, snc, 26029 Soncino (CR)';
  const brandDescription =
    content.brandDescription ||
    "Spazio Game è un'azienda dinamica e giovane con sede a Soncino (CR). Offriamo un servizio a 360°: schede di gioco comma 6a, cabinet, monitor, accessori e assistenza tecnica.";
  const copyright = content.copyrightText || '© 2024 Spazio Game srls - P.iva 01625480197. Tutti i diritti riservati.';
  const isoLogo = content.isoLogo || '';
  const isoHref = content.isoHref || '';

  function set(partial: Record<string, string>) {
    if (id) patchContent(id, partial);
  }

  return (
    <footer className="relative py-12 sm:py-16 px-4 sm:px-6 lg:px-12 border-t border-white/10">
      {editing && (
        <p className="max-w-6xl mx-auto mb-4 text-[11px] text-neon-cyan/80">
          Footer modificabile: testi, contatti, logo ISO e relativo link.
        </p>
      )}
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between md:items-start">
          <div className="min-w-0">
            <span className="text-white font-display text-lg sm:text-xl tracking-[0.15em] uppercase">SPAZIOGAME</span>
            {id ? (
              <EditableText
                as="p"
                multiline
                className="mt-4 text-white/40 text-sm max-w-md leading-relaxed"
                value={brandDescription}
                onChange={(brandDescription) => set({ brandDescription })}
              />
            ) : (
              <p className="mt-4 text-white/40 text-sm max-w-md leading-relaxed">{brandDescription}</p>
            )}
            <div className="mt-6 w-36 h-20">
              {isoLogo || editing ? (
                <EditableImage
                  src={isoLogo || '/favicon.png'}
                  alt="ISO 9001"
                  fit="contain"
                  className="h-full w-full object-contain"
                  href={isoHref}
                  onChange={(next) => set({ isoLogo: next })}
                  onHrefChange={(next) => set({ isoHref: next })}
                />
              ) : null}
              {editing && !isoLogo && (
                <p className="text-[10px] text-white/35 mt-1">Carica il logo ISO 9001. Poi incolla il link sotto la foto.</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:gap-12 sm:flex sm:flex-row">
            <div>
              <h4 className="text-white/60 text-xs tracking-[0.2em] uppercase mb-4">Link Rapidi</h4>
              <ul className="space-y-2">
                {PAGE_NAV.map((item) => (
                  <li key={item.to}>
                    <Link to={to(item.to)} className="text-white/40 hover:text-white text-sm transition-colors">
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
                  {id ? (
                    <EditableText value={email} onChange={(next) => set({ email: next })} />
                  ) : (
                    <a href={`mailto:${email}`} className="hover:text-white break-all">
                      {email}
                    </a>
                  )}
                </li>
                <li>
                  {id ? (
                    <EditableText value={phone} onChange={(next) => set({ phone: next })} />
                  ) : (
                    <a href={`tel:${phone.replace(/\s/g, '')}`} className="hover:text-white">
                      {phone}
                    </a>
                  )}
                </li>
                <li>
                  {id ? (
                    <EditableText value={address} onChange={(next) => set({ address: next })} />
                  ) : (
                    address
                  )}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 sm:mt-12 pt-8 border-t border-white/5 flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
          {id ? (
            <EditableText
              as="p"
              className="text-white/30 text-xs text-center sm:text-left"
              value={copyright}
              onChange={(copyrightText) => set({ copyrightText })}
            />
          ) : (
            <p className="text-white/30 text-xs text-center sm:text-left">{copyright}</p>
          )}
        </div>
      </div>
    </footer>
  );
}
