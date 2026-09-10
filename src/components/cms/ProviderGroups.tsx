import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { CmsSection } from '../../cms/types';
import { useCms } from '../../context/CmsProvider';
import { useIsEditing } from '../../context/EditMode';
import EditableImage from './EditableImage';
import EditableText from './EditableText';

type GameCard = { title: string; image: string; href?: string; tags?: GameTagId[] };
type ProviderGroup = { name: string; logo: string; href?: string; games: GameCard[] };
type GameTagId = 'bank' | 'bonus_persistent';

const GAME_TAGS: { id: GameTagId; label: string; src: string }[] = [
  { id: 'bank', label: 'Bank', src: '/bank.png' },
  { id: 'bonus_persistent', label: 'Bonus Persistent', src: '/bonus_persistent.png' },
];

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

const BLANK_GAME: GameCard = { title: 'Nuovo gioco', image: '/games-scheda.jpg', href: '', tags: [] };

function toggleTag(game: GameCard, id: GameTagId): GameCard {
  const tags = game.tags ?? [];
  return {
    ...game,
    tags: tags.includes(id) ? tags.filter((tag) => tag !== id) : [...tags, id],
  };
}

function GameTagBadges({ tags }: { tags?: GameTagId[] }) {
  const active = GAME_TAGS.filter((tag) => tags?.includes(tag.id));
  if (active.length === 0) return null;
  return (
    <div className="pointer-events-none absolute top-2 right-2 z-[25] flex flex-col items-end gap-1">
      {active.map((tag) => (
        <img
          key={tag.id}
          src={tag.src}
          alt={tag.label}
          className="h-12 w-12 md:h-[3.25rem] md:w-[3.25rem] object-contain drop-shadow-[0_6px_12px_rgba(0,0,0,0.65)]"
        />
      ))}
    </div>
  );
}

function insertAt<T>(list: T[], index: number, item: T): T[] {
  const next = [...list];
  next.splice(index, 0, item);
  return next;
}

function moveItem<T>(list: T[], from: number, to: number): T[] {
  if (to < 0 || to >= list.length) return list;
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
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
  onInsertBefore,
  onInsertAfter,
  onMoveLeft,
  onMoveRight,
}: {
  game: GameCard;
  onChange: (next: GameCard) => void;
  onRemove?: () => void;
  onInsertBefore?: () => void;
  onInsertAfter?: () => void;
  onMoveLeft?: () => void;
  onMoveRight?: () => void;
}) {
  const editing = useIsEditing();
  return (
    <div
      data-game-card
      className="snap-start shrink-0 w-[78vw] sm:w-[380px] md:w-[440px] rounded-2xl border border-white/12 bg-void-dark overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.45)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-void-black">
        <img
          src={game.image || '/games-scheda.jpg'}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full scale-125 object-cover blur-2xl opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-void-black/25 via-void-black/40 to-void-black/70" />
        <div className="relative z-10 h-full w-full p-5">
          <EditableImage
            src={game.image || '/games-scheda.jpg'}
            alt={game.title}
            fit="contain"
            className="h-full w-full object-contain drop-shadow-[0_12px_28px_rgba(0,0,0,0.65)]"
            href={game.href}
            onChange={(image) => onChange({ ...game, image })}
            onHrefChange={(href) => onChange({ ...game, href })}
          />
        </div>
        <GameTagBadges tags={game.tags} />
      </div>
      <div className="px-4 py-3 border-t border-white/10 bg-white/[0.03]">
        <EditableText
          className="text-white text-sm font-medium"
          value={game.title}
          onChange={(title) => onChange({ ...game, title })}
        />
        {editing && (
          <div className="mt-3 flex flex-wrap gap-2">
            {GAME_TAGS.map((tag) => {
              const selected = (game.tags ?? []).includes(tag.id);
              return (
                <button
                  key={tag.id}
                  type="button"
                  className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-wider ${
                    selected
                      ? 'border-neon-cyan bg-neon-cyan/15 text-neon-cyan'
                      : 'border-white/20 text-white/50 hover:border-white/40 hover:text-white/80'
                  }`}
                  onClick={() => onChange(toggleTag(game, tag.id))}
                  aria-pressed={selected}
                >
                  <img src={tag.src} alt="" className="h-6 w-6 object-contain" />
                  {tag.label}
                </button>
              );
            })}
          </div>
        )}
        {editing && (
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[10px] uppercase tracking-wider">
            {onInsertBefore ? (
              <button type="button" className="text-neon-cyan" onClick={onInsertBefore}>
                + Prima
              </button>
            ) : null}
            {onInsertAfter ? (
              <button type="button" className="text-neon-cyan" onClick={onInsertAfter}>
                + Dopo
              </button>
            ) : null}
            {onMoveLeft ? (
              <button type="button" className="text-white/50" onClick={onMoveLeft}>
                ←
              </button>
            ) : null}
            {onMoveRight ? (
              <button type="button" className="text-white/50" onClick={onMoveRight}>
                →
              </button>
            ) : null}
            {onRemove ? (
              <button type="button" className="text-white/30" onClick={onRemove}>
                Rimuovi
              </button>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}

function AddAtEnds({
  onAddFirst,
  onAddLast,
}: {
  onAddFirst: () => void;
  onAddLast: () => void;
}) {
  return (
    <div className="flex flex-wrap gap-4">
      <button type="button" className="text-sm text-neon-cyan" onClick={onAddFirst}>
        + Aggiungi all’inizio
      </button>
      <button type="button" className="text-sm text-neon-cyan" onClick={onAddLast}>
        + Aggiungi in fondo
      </button>
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
                    onInsertBefore={() => patch({ ours: insertAt(ours, gi, { ...BLANK_GAME }) })}
                    onInsertAfter={() => patch({ ours: insertAt(ours, gi + 1, { ...BLANK_GAME }) })}
                    onMoveLeft={gi > 0 ? () => patch({ ours: moveItem(ours, gi, gi - 1) }) : undefined}
                    onMoveRight={
                      gi < ours.length - 1 ? () => patch({ ours: moveItem(ours, gi, gi + 1) }) : undefined
                    }
                    onRemove={() => patch({ ours: ours.filter((_, i) => i !== gi) })}
                  />
                ))}
              </GameStrip>
            ) : (
              <p className="text-center text-sm text-white/40">Nessuna scheda in questa sezione.</p>
            )}
            {editing && (
              <AddAtEnds
                onAddFirst={() => patch({ ours: [{ ...BLANK_GAME }, ...ours] })}
                onAddLast={() => patch({ ours: [...ours, { ...BLANK_GAME }] })}
              />
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
                  {(provider.games ?? []).map((game, gi) => {
                    const games = provider.games ?? [];
                    return (
                      <GameCardView
                        key={`${provider.name}-${game.title}-${gi}`}
                        game={game}
                        onChange={(next) => {
                          const copy = [...items];
                          const nextGames = [...(copy[pi].games ?? [])];
                          nextGames[gi] = next;
                          copy[pi] = { ...copy[pi], games: nextGames };
                          patch({ items: copy });
                        }}
                        onInsertBefore={() => {
                          const copy = [...items];
                          copy[pi] = { ...copy[pi], games: insertAt(games, gi, { ...BLANK_GAME }) };
                          patch({ items: copy });
                        }}
                        onInsertAfter={() => {
                          const copy = [...items];
                          copy[pi] = { ...copy[pi], games: insertAt(games, gi + 1, { ...BLANK_GAME }) };
                          patch({ items: copy });
                        }}
                        onMoveLeft={
                          gi > 0
                            ? () => {
                                const copy = [...items];
                                copy[pi] = { ...copy[pi], games: moveItem(games, gi, gi - 1) };
                                patch({ items: copy });
                              }
                            : undefined
                        }
                        onMoveRight={
                          gi < games.length - 1
                            ? () => {
                                const copy = [...items];
                                copy[pi] = { ...copy[pi], games: moveItem(games, gi, gi + 1) };
                                patch({ items: copy });
                              }
                            : undefined
                        }
                        onRemove={() => {
                          const copy = [...items];
                          copy[pi] = {
                            ...copy[pi],
                            games: games.filter((_, i) => i !== gi),
                          };
                          patch({ items: copy });
                        }}
                      />
                    );
                  })}
                </GameStrip>
              ) : null}

              {editing && (
                <AddAtEnds
                  onAddFirst={() => {
                    const copy = [...items];
                    copy[pi] = { ...copy[pi], games: [{ ...BLANK_GAME }, ...(copy[pi].games ?? [])] };
                    patch({ items: copy });
                  }}
                  onAddLast={() => {
                    const copy = [...items];
                    copy[pi] = { ...copy[pi], games: [...(copy[pi].games ?? []), { ...BLANK_GAME }] };
                    patch({ items: copy });
                  }}
                />
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
