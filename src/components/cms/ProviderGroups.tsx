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

export default function ProviderGroupsSection({ section }: { section: CmsSection }) {
  const { patchContent } = useCms();
  const editing = useIsEditing();
  const title = typeof section.content.title === 'string' ? section.content.title : '';
  const items = asArray<ProviderGroup>(section.content.items);
  const cols = section.layout.columns === 3 ? 3 : 2;
  const colClass =
    cols === 3
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
      : 'grid-cols-1 sm:grid-cols-2';

  function updateItems(next: ProviderGroup[]) {
    patchContent(section.id, { items: next });
  }

  return (
    <section className="px-4 sm:px-6 lg:px-12 py-16 border-t border-white/10">
      <div className="max-w-6xl mx-auto space-y-16">
        {title ? (
          <EditableText
            as="h3"
            className="text-2xl font-display text-white uppercase tracking-tight text-center"
            value={title}
            onChange={(next) => patchContent(section.id, { title: next })}
          />
        ) : null}

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
                    updateItems(copy);
                  }}
                  onHrefChange={(href) => {
                    const copy = [...items];
                    copy[pi] = { ...copy[pi], href };
                    updateItems(copy);
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
                    updateItems(copy);
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
                  onClick={() => updateItems(items.filter((_, i) => i !== pi))}
                >
                  Rimuovi marchio
                </button>
              )}
            </div>

            <div className={`grid ${colClass} gap-6`}>
              {(provider.games ?? []).map((game, gi) => (
                <div key={`${game.title}-${gi}`} className="rounded-lg border border-white/10 bg-void-dark overflow-hidden">
                  <div className="aspect-video bg-void-black flex items-center justify-center p-3">
                    <EditableImage
                      src={game.image || '/games-scheda.jpg'}
                      alt={game.title}
                      fit="contain"
                      className="max-h-full w-full object-contain"
                      href={game.href}
                      onChange={(image) => {
                        const copy = [...items];
                        const games = [...(copy[pi].games ?? [])];
                        games[gi] = { ...games[gi], image };
                        copy[pi] = { ...copy[pi], games };
                        updateItems(copy);
                      }}
                      onHrefChange={(href) => {
                        const copy = [...items];
                        const games = [...(copy[pi].games ?? [])];
                        games[gi] = { ...games[gi], href };
                        copy[pi] = { ...copy[pi], games };
                        updateItems(copy);
                      }}
                    />
                  </div>
                  <div className="p-3">
                    <EditableText
                      className="text-white text-sm font-medium"
                      value={game.title}
                      onChange={(title) => {
                        const copy = [...items];
                        const games = [...(copy[pi].games ?? [])];
                        games[gi] = { ...games[gi], title };
                        copy[pi] = { ...copy[pi], games };
                        updateItems(copy);
                      }}
                    />
                    {editing && (
                      <button
                        type="button"
                        className="mt-2 text-[10px] text-white/30"
                        onClick={() => {
                          const copy = [...items];
                          copy[pi] = {
                            ...copy[pi],
                            games: (copy[pi].games ?? []).filter((_, i) => i !== gi),
                          };
                          updateItems(copy);
                        }}
                      >
                        Rimuovi gioco
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

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
                  updateItems(copy);
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
              updateItems([
                ...items,
                {
                  name: 'Nuovo marchio',
                  logo: '/games-scheda.jpg',
                  href: 'https://',
                  games: [{ title: 'Gioco', image: '/games-scheda.jpg' }],
                },
              ])
            }
          >
            + Aggiungi marchio (Octavian, Cristaltec, …)
          </button>
        )}
      </div>
    </section>
  );
}
