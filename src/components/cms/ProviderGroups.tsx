import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { CmsSection } from '../../cms/types';
import { useCms } from '../../context/CmsProvider';
import { useIsEditing } from '../../context/EditMode';
import EditableImage from './EditableImage';
import EditableText from './EditableText';

type GameCard = { title: string; image: string; href?: string };
type ProviderGroup = { name: string; logo: string; href?: string; games: GameCard[] };

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function GameStrip({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  const scrollByCard = (direction: -1 | 1) => {
    const el = ref.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>('[data-game-card]');
    const delta = (card?.offsetWidth ?? 380) + 24;
    el.scrollBy({ left: direction * delta, behavior: 'smooth' });
  };

  return (
    <div className="relative">
      <button
        type="button"
        className="absolute left-0 top-[42%] z-10 hidden md:flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-void-black/80 text-white hover:border-neon-cyan hover:text-neon-cyan"
        onClick={() => scrollByCard(-1)}
        aria-label="Schede precedenti"
      >
        <ChevronLeft size={20} />
      </button>
      <div
        ref={ref}
        className="flex gap-6 overflow-x-auto overscroll-x-contain scroll-smooth snap-x snap-mandatory pb-3 [scrollbar-width:thin] [scrollbar-color:rgba(34,211,238,0.5)_transparent]"
      >
        {children}
      </div>
      <button
        type="button"
        className="absolute right-0 top-[42%] z-10 hidden md:flex h-11 w-11 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-void-black/80 text-white hover:border-neon-cyan hover:text-neon-cyan"
        onClick={() => scrollByCard(1)}
        aria-label="Schede successive"
      >
        <ChevronRight size={20} />
      </button>
      <p className="md:hidden mt-2 text-[11px] uppercase tracking-wider text-white/35">Scorri di lato le schede →</p>
    </div>
  );
}

function GameCardView({
  game,
  onChange,
  onRemove,
}: {
  game: GameCard;
  onChange: (next: GameCard) => void;
  onRemove?: () => void;
}) {
  const editing = useIsEditing();
  return (
    <div
      data-game-card
      className="snap-start shrink-0 w-[78vw] sm:w-[380px] md:w-[420px] rounded-lg border border-white/10 bg-void-dark overflow-hidden"
    >
      <div className="aspect-video bg-void-black flex items-center justify-center p-3">
        <EditableImage
          src={game.image || '/games-scheda.jpg'}
          alt={game.title}
          fit="contain"
          className="max-h-full w-full object-contain"
          href={game.href}
          onChange={(image) => onChange({ ...game, image })}
          onHrefChange={(href) => onChange({ ...game, href })}
        />
      </div>
      <div className="p-3">
        <EditableText
          className="text-white text-sm font-medium"
          value={game.title}
          onChange={(title) => onChange({ ...game, title })}
        />
        {editing && onRemove ? (
          <button type="button" className="mt-2 text-[10px] text-white/30" onClick={onRemove}>
            Rimuovi gioco
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default function ProviderGroupsSection({ section }: { section: CmsSection }) {
  const { patchContent } = useCms();
  const editing = useIsEditing();
  const oursTitle =
    typeof section.content.oursTitle === 'string' ? section.content.oursTitle : 'I nostri giochi';
  const allTitle =
    typeof section.content.allTitle === 'string'
      ? section.content.allTitle
      : typeof section.content.title === 'string'
        ? section.content.title
        : 'Tutti i giochi';
  const ours = asArray<GameCard>(section.content.ours);
  const items = asArray<ProviderGroup>(section.content.items);

  function patch(next: Record<string, unknown>) {
    patchContent(section.id, next);
  }

  return (
    <section className="px-4 sm:px-6 lg:px-12 py-16 border-t border-white/10">
      <div className="max-w-6xl mx-auto space-y-20">
        {(editing || ours.length > 0) && (
          <div className="space-y-8">
            <EditableText
              as="h3"
              className="text-2xl font-display text-white uppercase tracking-tight text-center"
              value={oursTitle}
              onChange={(next) => patch({ oursTitle: next })}
            />
            {ours.length > 0 ? (
              <GameStrip>
                {ours.map((game, gi) => (
                  <GameCardView
                    key={`ours-${game.title}-${gi}`}
                    game={game}
                    onChange={(next) => {
                      const copy = [...ours];
                      copy[gi] = next;
                      patch({ ours: copy });
                    }}
                    onRemove={() => patch({ ours: ours.filter((_, i) => i !== gi) })}
                  />
                ))}
              </GameStrip>
            ) : (
              <p className="text-center text-sm text-white/40">Nessuna scheda in questa sezione.</p>
            )}
            {editing && (
              <button
                type="button"
                className="text-sm text-neon-cyan"
                onClick={() =>
                  patch({
                    ours: [...ours, { title: 'Nuovo gioco', image: '/games-scheda.jpg', href: '' }],
                  })
                }
              >
                + Aggiungi ai nostri giochi
              </button>
            )}
          </div>
        )}

        <div className="space-y-16">
          <EditableText
            as="h3"
            className="text-2xl font-display text-white uppercase tracking-tight text-center"
            value={allTitle}
            onChange={(next) => patch({ allTitle: next })}
          />

          {items.map((provider, pi) => (
            <div key={`${provider.name}-${pi}`} className="space-y-8">
              <div className="flex flex-wrap items-end gap-4">
                <div className="h-40 w-72 max-w-full bg-white/5 rounded-lg border border-white/10 p-3">
                  <EditableImage
                    src={provider.logo || '/games-scheda.jpg'}
                    alt={provider.name}
                    fit="contain"
                    className="h-full w-full object-contain"
                    href={provider.href}
                    onChange={(logo) => {
                      const copy = [...items];
                      copy[pi] = { ...copy[pi], logo };
                      patch({ items: copy });
                    }}
                    onHrefChange={(href) => {
                      const copy = [...items];
                      copy[pi] = { ...copy[pi], href };
                      patch({ items: copy });
                    }}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <EditableText
                    as="h4"
                    className="text-white font-display text-xl uppercase tracking-tight"
                    value={provider.name}
                    onChange={(name) => {
                      const copy = [...items];
                      copy[pi] = { ...copy[pi], name };
                      patch({ items: copy });
                    }}
                  />
                  {editing && (
                    <p className="text-[11px] text-white/35 mt-1">
                      Carica il logo del marchio e incolla il sito. Il logo diventa cliccabile.
                    </p>
                  )}
                </div>
                {editing && (
                  <button
                    type="button"
                    className="text-[11px] text-red-300"
                    onClick={() => patch({ items: items.filter((_, i) => i !== pi) })}
                  >
                    Rimuovi marchio
                  </button>
                )}
              </div>

              {(provider.games ?? []).length > 0 ? (
                <GameStrip>
                  {(provider.games ?? []).map((game, gi) => (
                    <GameCardView
                      key={`${provider.name}-${game.title}-${gi}`}
                      game={game}
                      onChange={(next) => {
                        const copy = [...items];
                        const games = [...(copy[pi].games ?? [])];
                        games[gi] = next;
                        copy[pi] = { ...copy[pi], games };
                        patch({ items: copy });
                      }}
                      onRemove={() => {
                        const copy = [...items];
                        copy[pi] = {
                          ...copy[pi],
                          games: (copy[pi].games ?? []).filter((_, i) => i !== gi),
                        };
                        patch({ items: copy });
                      }}
                    />
                  ))}
                </GameStrip>
              ) : null}

              {editing && (
                <button
                  type="button"
                  className="text-sm text-neon-cyan"
                  onClick={() => {
                    const copy = [...items];
                    copy[pi] = {
                      ...copy[pi],
                      games: [
                        ...(copy[pi].games ?? []),
                        { title: 'Nuovo gioco', image: '/games-scheda.jpg', href: '' },
                      ],
                    };
                    patch({ items: copy });
                  }}
                >
                  + Aggiungi gioco in questa riga
                </button>
              )}
            </div>
          ))}

          {editing && (
            <button
              type="button"
              className="text-sm text-neon-cyan"
              onClick={() =>
                patch({
                  items: [
                    ...items,
                    {
                      name: 'Nuovo marchio',
                      logo: '/games-scheda.jpg',
                      href: 'https://',
                      games: [{ title: 'Gioco', image: '/games-scheda.jpg' }],
                    },
                  ],
                })
              }
            >
              + Aggiungi marchio (Octavian, Cristaltec, …)
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
