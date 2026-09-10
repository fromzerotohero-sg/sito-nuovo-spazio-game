import { Check } from 'lucide-react';
import type { CmsSection, SplitContent, SplitListItem } from '../../cms/types';
import { useCms } from '../../context/CmsProvider';
import { useIsEditing } from '../../context/EditMode';
import EditableImage from './EditableImage';
import EditableText from './EditableText';

function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function isSpacerItem(item: SplitListItem): boolean {
  return item.kind === 'spacer';
}

const SPACER_PRESETS = [
  { label: 'S', height: 64 },
  { label: 'M', height: 120 },
  { label: 'L', height: 200 },
  { label: 'XL', height: 280 },
] as const;

function SpacerBlock({
  height,
  editing,
  onHeight,
  onRemove,
}: {
  height: number;
  editing: boolean;
  onHeight: (height: number) => void;
  onRemove?: () => void;
}) {
  const h = Number.isFinite(height) && height > 0 ? height : 120;
  return (
    <div
      className={`relative ${editing ? 'border-y border-dashed border-white/20 bg-white/[0.03]' : ''}`}
      style={{ height: editing ? Math.max(h, 56) : h }}
      aria-hidden={!editing}
    >
      {editing && (
        <div className="absolute inset-0 flex items-center justify-center gap-2">
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/40">Spazio</span>
          {SPACER_PRESETS.map((preset) => (
            <button
              key={preset.height}
              type="button"
              className={`px-2 py-0.5 rounded text-[10px] ${
                h === preset.height ? 'bg-neon-cyan text-void-black' : 'text-white/50 hover:text-white'
              }`}
              onClick={() => onHeight(preset.height)}
            >
              {preset.label}
            </button>
          ))}
          {onRemove ? (
            <button type="button" className="text-[10px] text-red-300" onClick={onRemove}>
              togli
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
}

export function SpacerSection({ section }: { section: CmsSection }) {
  const { patchContent } = useCms();
  const editing = useIsEditing();
  const height = typeof section.content.height === 'number' ? section.content.height : 120;
  return (
    <SpacerBlock
      height={height}
      editing={editing}
      onHeight={(next) => patchContent(section.id, { height: next })}
    />
  );
}

export function IntroSection({ section }: { section: CmsSection }) {
  const { patchContent } = useCms();
  return (
    <section className="px-4 sm:px-6 lg:px-12 pb-16">
      <div className="max-w-6xl mx-auto">
        <EditableText
          as="p"
          multiline
          className="text-white/60 text-lg leading-relaxed max-w-3xl"
          value={asString(section.content.text)}
          onChange={(text) => patchContent(section.id, { text })}
        />
      </div>
    </section>
  );
}

function SplitBody({
  content,
  layout,
  onChange,
  overlayTitle = true,
}: {
  content: SplitContent;
  layout: CmsSection['layout'];
  onChange: (next: SplitContent) => void;
  overlayTitle?: boolean;
}) {
  const editing = useIsEditing();
  const imageFirst = layout.imageSide !== 'right';
  const fit = layout.imageFit === 'cover' ? 'cover' : content.imageFit === 'cover' ? 'cover' : 'contain';
  const ratio =
    layout.imageRatio === 'portrait'
      ? 'aspect-[3/4]'
      : layout.imageRatio === 'square'
        ? 'aspect-square'
        : 'aspect-video';

  const imageCol = (
    <div className={`relative ${ratio} rounded-lg overflow-hidden bg-void-dark flex items-center justify-center`}>
      <EditableImage
        src={content.image || '/hero-sede.jpg'}
        alt={content.imageAlt || content.title || ''}
        fit={fit}
        className="w-full h-full"
        href={content.imageHref}
        onChange={(image) => onChange({ ...content, image })}
        onHrefChange={(imageHref) => onChange({ ...content, imageHref })}
      />
      {overlayTitle && (
        <div className="absolute inset-0 bg-gradient-to-t from-void-black/70 via-transparent to-transparent pointer-events-none" />
      )}
      {overlayTitle && (content.eyebrow || content.title) && (
        <div className="absolute bottom-4 left-4 right-4 pointer-events-none">
          {content.eyebrow && (
            <span className="text-neon-cyan text-xs tracking-[0.2em] uppercase">{content.eyebrow}</span>
          )}
          {content.title && <p className="text-white text-2xl font-display mt-1">{content.title}</p>}
        </div>
      )}
    </div>
  );

  const textCol = (
    <div>
      {content.eyebrow != null && (
        <EditableText
          as="p"
          className="text-neon-cyan text-xs tracking-[0.2em] uppercase mb-2"
          value={content.eyebrow}
          onChange={(eyebrow) => onChange({ ...content, eyebrow })}
        />
      )}
      {content.title != null && (
        <EditableText
          as="h2"
          className="text-4xl md:text-5xl font-display text-white uppercase tracking-tight mb-4"
          value={content.title}
          onChange={(title) => onChange({ ...content, title })}
        />
      )}
      {content.subtitle != null && (
        <EditableText
          as="p"
          className="text-white/40 text-sm tracking-[0.2em] uppercase mb-6"
          value={content.subtitle}
          onChange={(subtitle) => onChange({ ...content, subtitle })}
        />
      )}
      {content.body != null && (
        <EditableText
          as="p"
          multiline
          className="text-white/60 text-sm leading-relaxed mb-6"
          value={content.body}
          onChange={(body) => onChange({ ...content, body })}
        />
      )}
      {(editing || (content.specs && content.specs.length > 0)) && (
        <div className="space-y-3 mb-8">
          {content.specsTitle ? (
            <EditableText
              as="h4"
              className="text-white/80 text-xs tracking-[0.2em] uppercase mb-4"
              value={content.specsTitle}
              onChange={(specsTitle) => onChange({ ...content, specsTitle })}
            />
          ) : null}
          {(content.specs ?? []).map((spec, i) => (
            <div key={`${spec.label}-${i}`} className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan" />
              <EditableText
                className="text-white text-sm"
                value={spec.label}
                onChange={(label) => {
                  const specs = [...(content.specs ?? [])];
                  specs[i] = { ...specs[i], label };
                  onChange({ ...content, specs });
                }}
              />
              {(editing || spec.value) && (
                <>
                  <span className="text-white/40">:</span>
                  <EditableText
                    className="text-white/60 text-sm"
                    value={spec.value}
                    onChange={(value) => {
                      const specs = [...(content.specs ?? [])];
                      specs[i] = { ...specs[i], value };
                      onChange({ ...content, specs });
                    }}
                  />
                </>
              )}
              {editing && (
                <button
                  type="button"
                  className="text-[10px] text-white/30 hover:text-red-300"
                  onClick={() =>
                    onChange({ ...content, specs: (content.specs ?? []).filter((_, idx) => idx !== i) })
                  }
                >
                  togli
                </button>
              )}
            </div>
          ))}
          {editing && (
            <button
              type="button"
              className="text-xs text-neon-cyan"
              onClick={() =>
                onChange({
                  ...content,
                  specsTitle: content.specsTitle ?? 'Caratteristiche tecniche',
                  specs: [...(content.specs ?? []), { label: 'Voce', value: 'Valore' }],
                })
              }
            >
              + Aggiungi caratteristica
            </button>
          )}
        </div>
      )}
      {(editing || content.list) && (
        <div className="mb-8">
          {content.listTitle != null && (
            <EditableText
              as="h4"
              className="text-white/80 text-xs tracking-[0.2em] uppercase mb-4"
              value={content.listTitle}
              onChange={(listTitle) => onChange({ ...content, listTitle })}
            />
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {(content.list ?? []).map((item, i) => (
              <div key={`${item}-${i}`} className="flex items-center gap-2 text-white/60 text-sm">
                <Check size={14} className="text-neon-cyan shrink-0" />
                <EditableText
                  value={item}
                  onChange={(next) => {
                    const list = [...content.list!];
                    list[i] = next;
                    onChange({ ...content, list });
                  }}
                />
                {editing && (
                  <button
                    type="button"
                    className="text-[10px] text-white/30"
                    onClick={() => onChange({ ...content, list: content.list!.filter((_, idx) => idx !== i) })}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
          {editing && (
            <button
              type="button"
              className="mt-3 text-xs text-neon-cyan"
              onClick={() => onChange({ ...content, list: [...(content.list ?? []), 'Nuova voce'] })}
            >
              + Aggiungi voce
            </button>
          )}
        </div>
      )}
      {content.blocks?.map((block, i) => (
        <div key={`${block.type}-${i}`} className="mb-8">
          {block.type === 'text' && (
            <>
              <EditableText
                as="h4"
                className="text-white/80 text-xs tracking-[0.2em] uppercase mb-3"
                value={block.title}
                onChange={(title) => {
                  const blocks = [...content.blocks!];
                  blocks[i] = { ...block, title };
                  onChange({ ...content, blocks });
                }}
              />
              <EditableText
                as="p"
                multiline
                className="text-white/60 text-sm leading-relaxed"
                value={block.body}
                onChange={(body) => {
                  const blocks = [...content.blocks!];
                  blocks[i] = { ...block, body };
                  onChange({ ...content, blocks });
                }}
              />
            </>
          )}
          {block.type === 'list' && (
            <>
              <EditableText
                as="h4"
                className="text-white/80 text-xs tracking-[0.2em] uppercase mb-3"
                value={block.title}
                onChange={(title) => {
                  const blocks = [...content.blocks!];
                  blocks[i] = { ...block, title };
                  onChange({ ...content, blocks });
                }}
              />
              <ul className="space-y-2">
                {block.items.map((item, idx) => (
                  <li key={`${item}-${idx}`} className="flex items-center gap-2 text-white/60 text-sm">
                    <Check size={14} className="text-neon-cyan shrink-0" />
                    <EditableText
                      value={item}
                      onChange={(next) => {
                        const blocks = [...content.blocks!];
                        const items = [...block.items];
                        items[idx] = next;
                        blocks[i] = { ...block, items };
                        onChange({ ...content, blocks });
                      }}
                    />
                  </li>
                ))}
              </ul>
            </>
          )}
          {block.type === 'callout' && (
            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
              <EditableText
                as="h4"
                className="text-white/80 text-xs tracking-[0.2em] uppercase mb-2"
                value={block.title}
                onChange={(title) => {
                  const blocks = [...content.blocks!];
                  blocks[i] = { ...block, title };
                  onChange({ ...content, blocks });
                }}
              />
              <EditableText
                as="p"
                multiline
                className="text-white/60 text-sm"
                value={block.body}
                onChange={(body) => {
                  const blocks = [...content.blocks!];
                  blocks[i] = { ...block, body };
                  onChange({ ...content, blocks });
                }}
              />
            </div>
          )}
        </div>
      ))}
      {content.ctaText ? (
        <a
          href={content.ctaHref || '#'}
          className="inline-flex items-center gap-3 px-6 py-3 bg-neon-cyan text-void-black font-medium text-sm tracking-[0.1em] uppercase rounded-full hover:bg-white transition-colors"
        >
          <EditableText
            value={content.ctaText}
            onChange={(ctaText) => onChange({ ...content, ctaText })}
          />
        </a>
      ) : null}
    </div>
  );

  return (
    <div className="grid lg:grid-cols-2 gap-12 items-start">
      <div className={imageFirst ? '' : 'order-1 lg:order-2'}>{imageCol}</div>
      <div className={imageFirst ? '' : 'order-2 lg:order-1'}>{textCol}</div>
    </div>
  );
}

export function SplitSection({ section }: { section: CmsSection }) {
  const { patchContent } = useCms();
  const content = section.content as SplitContent;
  return (
    <section className="px-4 sm:px-6 lg:px-12 py-16 border-t border-white/10">
      <div className="max-w-6xl mx-auto">
        <SplitBody
          content={content}
          overlayTitle={false}
          layout={section.layout}
          onChange={(next) => patchContent(section.id, next)}
        />
      </div>
    </section>
  );
}

export function SplitListSection({ section }: { section: CmsSection }) {
  const { patchContent } = useCms();
  const editing = useIsEditing();
  const items = asArray<SplitListItem>(section.content.items);
  const title = asString(section.content.title);
  const imageSide =
    section.layout.imageSide === 'left' || section.layout.imageSide === 'right'
      ? section.layout.imageSide
      : undefined;

  const updateItems = (next: SplitListItem[]) => patchContent(section.id, { items: next });

  const insertSpacerAfter = (index: number) => {
    const next = [...items];
    next.splice(index + 1, 0, { kind: 'spacer', spacerHeight: 120 });
    updateItems(next);
  };

  let productIndex = 0;

  return (
    <section className="px-4 sm:px-6 lg:px-12 py-10 md:py-16">
      <div className="max-w-6xl mx-auto">
        {title || editing ? (
          <EditableText
            as="h3"
            className="text-2xl font-display text-white uppercase tracking-tight text-center pt-12 pb-4"
            value={title}
            onChange={(next) => patchContent(section.id, { title: next })}
          />
        ) : null}
        {items.map((item, index) => {
          if (isSpacerItem(item)) {
            return (
              <div key={`spacer-${index}`}>
                <SpacerBlock
                  height={item.spacerHeight ?? 120}
                  editing={editing}
                  onHeight={(spacerHeight) => {
                    const copy = [...items];
                    copy[index] = { ...copy[index], kind: 'spacer', spacerHeight };
                    updateItems(copy);
                  }}
                  onRemove={() => updateItems(items.filter((_, i) => i !== index))}
                />
                {editing && (
                  <div className="flex justify-center py-2">
                    <button
                      type="button"
                      className="text-[11px] uppercase tracking-wider text-white/40 hover:text-neon-cyan"
                      onClick={() => insertSpacerAfter(index)}
                    >
                      + Spazio
                    </button>
                  </div>
                )}
              </div>
            );
          }

          const side = imageSide ?? (productIndex % 2 === 1 ? 'right' : 'left');
          productIndex += 1;

          return (
            <div key={`${item.title}-${index}`} className="mb-8 md:mb-10">
              <article className="relative rounded-2xl border border-white/20 bg-white/[0.06] p-5 sm:p-8 md:p-10 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                {editing && (
                  <button
                    type="button"
                    className="absolute top-3 right-3 z-10 text-[10px] text-red-300"
                    onClick={() => updateItems(items.filter((_, i) => i !== index))}
                  >
                    Rimuovi
                  </button>
                )}
                <SplitBody
                  content={item}
                  overlayTitle={false}
                  layout={{
                    imageSide: side,
                    imageRatio: section.layout.imageRatio ?? 'video',
                    imageFit: section.layout.imageFit,
                  }}
                  onChange={(next) => {
                    const copy = [...items];
                    copy[index] = next;
                    updateItems(copy);
                  }}
                />
              </article>
              {editing && (
                <div className="flex justify-center py-2">
                  <button
                    type="button"
                    className="text-[11px] uppercase tracking-wider text-white/40 hover:text-neon-cyan"
                    onClick={() => insertSpacerAfter(index)}
                  >
                    + Spazio
                  </button>
                </div>
              )}
            </div>
          );
        })}
        {editing && (
          <button
            type="button"
            className="mt-6 mb-10 text-sm text-neon-cyan"
            onClick={() =>
              updateItems([
                ...items,
                {
                  title: 'Nuovo elemento',
                  body: 'Descrizione',
                  image: '/hero-sede.jpg',
                  imageHref: '',
                  specsTitle: 'Caratteristiche tecniche',
                  specs: [{ label: 'Voce', value: 'Valore' }],
                  listTitle: 'Dimensioni',
                  list: [],
                },
              ])
            }
          >
            + Aggiungi elemento
          </button>
        )}
      </div>
    </section>
  );
}

export function FeatureGridSection({ section }: { section: CmsSection }) {
  const { patchContent } = useCms();
  const editing = useIsEditing();
  const title = asString(section.content.title);
  const items = asArray<{ title: string; desc: string; features?: string[] }>(section.content.items);
  const cols = section.layout.columns ?? 3;
  const colClass = cols === 2 ? 'md:grid-cols-2' : cols === 4 ? 'md:grid-cols-4' : 'md:grid-cols-3';

  return (
    <section className="px-4 sm:px-6 lg:px-12 py-16 border-t border-white/10">
      <div className="max-w-6xl mx-auto">
        {title ? (
          <EditableText
            as="h3"
            className="text-2xl font-display text-white uppercase tracking-tight mb-8 text-center"
            value={title}
            onChange={(next) => patchContent(section.id, { title: next })}
          />
        ) : null}
        <div className={`grid ${colClass} gap-6`}>
          {items.map((item, i) => (
            <div key={`${item.title}-${i}`} className="p-6 bg-white/5 rounded-lg border border-white/10 relative">
              {editing && (
                <button
                  type="button"
                  className="absolute top-2 right-2 text-[10px] text-white/30 hover:text-red-300"
                  onClick={() => patchContent(section.id, { items: items.filter((_, idx) => idx !== i) })}
                >
                  ×
                </button>
              )}
              <EditableText
                as="h4"
                className="text-white font-medium mb-2"
                value={item.title}
                onChange={(next) => {
                  const copy = [...items];
                  copy[i] = { ...copy[i], title: next };
                  patchContent(section.id, { items: copy });
                }}
              />
              <EditableText
                as="p"
                multiline
                className="text-white/50 text-sm"
                value={item.desc}
                onChange={(next) => {
                  const copy = [...items];
                  copy[i] = { ...copy[i], desc: next };
                  patchContent(section.id, { items: copy });
                }}
              />
              {item.features && (
                <ul className="space-y-2 mt-4">
                  {item.features.map((f, fi) => (
                    <li key={`${f}-${fi}`} className="flex items-center gap-2 text-white/50 text-sm">
                      <Check size={14} className="text-neon-cyan shrink-0" />
                      <EditableText
                        value={f}
                        onChange={(next) => {
                          const copy = [...items];
                          const features = [...(copy[i].features ?? [])];
                          features[fi] = next;
                          copy[i] = { ...copy[i], features };
                          patchContent(section.id, { items: copy });
                        }}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
        {editing && (
          <button
            type="button"
            className="mt-6 text-sm text-neon-cyan"
            onClick={() =>
              patchContent(section.id, {
                items: [...items, { title: 'Nuova card', desc: 'Descrizione' }],
              })
            }
          >
            + Aggiungi card
          </button>
        )}
      </div>
    </section>
  );
}

export function ImageCardsSection({ section }: { section: CmsSection }) {
  const { patchContent } = useCms();
  const editing = useIsEditing();
  const title = asString(section.content.title);
  const items = asArray<{ image: string; title: string; desc: string; href?: string }>(section.content.items);
  const cols = section.layout.columns ?? 3;
  const colClass = cols === 2 ? 'md:grid-cols-2' : cols === 4 ? 'md:grid-cols-4' : 'md:grid-cols-3';
  const fit = section.layout.imageFit === 'cover' ? 'cover' : 'contain';

  return (
    <section className="px-4 sm:px-6 lg:px-12 py-16 border-t border-white/10">
      <div className="max-w-6xl mx-auto">
        {title ? (
          <EditableText
            as="h3"
            className="text-2xl font-display text-white uppercase tracking-tight mb-12 text-center"
            value={title}
            onChange={(next) => patchContent(section.id, { title: next })}
          />
        ) : null}
        <div className={`grid ${colClass} gap-6`}>
          {items.map((item, i) => (
            <div key={`${item.title}-${i}`} className="rounded-lg overflow-hidden bg-void-dark border border-white/10 relative">
              {editing && (
                <button
                  type="button"
                  className="absolute top-2 right-2 z-30 text-[10px] bg-void-black/70 px-2 py-0.5 rounded text-white/70"
                  onClick={() => patchContent(section.id, { items: items.filter((_, idx) => idx !== i) })}
                >
                  Rimuovi
                </button>
              )}
              <div className="aspect-square bg-void-black flex items-center justify-center p-2">
                <EditableImage
                  src={item.image}
                  alt={item.title}
                  fit={fit}
                  className="w-full h-full"
                  href={item.href}
                  onChange={(image) => {
                    const copy = [...items];
                    copy[i] = { ...copy[i], image };
                    patchContent(section.id, { items: copy });
                  }}
                  onHrefChange={(href) => {
                    const copy = [...items];
                    copy[i] = { ...copy[i], href };
                    patchContent(section.id, { items: copy });
                  }}
                />
              </div>
              <div className="p-6">
                <EditableText
                  as="h4"
                  className="text-white font-medium mb-2"
                  value={item.title}
                  onChange={(title) => {
                    const copy = [...items];
                    copy[i] = { ...copy[i], title };
                    patchContent(section.id, { items: copy });
                  }}
                />
                <EditableText
                  as="p"
                  multiline
                  className="text-white/50 text-sm"
                  value={item.desc}
                  onChange={(desc) => {
                    const copy = [...items];
                    copy[i] = { ...copy[i], desc };
                    patchContent(section.id, { items: copy });
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        {editing && (
          <button
            type="button"
            className="mt-6 text-sm text-neon-cyan"
            onClick={() =>
              patchContent(section.id, {
                items: [...items, { image: '/hero-sede.jpg', title: 'Nuova foto', desc: 'Descrizione', href: '' }],
              })
            }
          >
            + Aggiungi foto
          </button>
        )}
      </div>
    </section>
  );
}

export function TableSection({ section }: { section: CmsSection }) {
  const { patchContent } = useCms();
  const editing = useIsEditing();
  const title = asString(section.content.title);
  const headers = asArray<string>(section.content.headers);
  const rows = asArray<string[]>(section.content.rows);

  const setCell = (r: number, c: number, value: string) => {
    const next = rows.map((row) => [...row]);
    next[r][c] = value;
    patchContent(section.id, { rows: next });
  };

  return (
    <section className="px-4 sm:px-6 lg:px-12 py-16 border-t border-white/10">
      <div className="max-w-4xl mx-auto">
        <EditableText
          as="h3"
          className="text-2xl font-display text-white uppercase tracking-tight mb-8 text-center"
          value={title}
          onChange={(next) => patchContent(section.id, { title: next })}
        />
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/20">
                {headers.map((h, i) => (
                  <th key={`${h}-${i}`} className="text-center py-4 px-4 text-white/60 text-xs tracking-[0.2em] uppercase">
                    <EditableText
                      value={h}
                      onChange={(next) => {
                        const copy = [...headers];
                        copy[i] = next;
                        patchContent(section.id, { headers: copy });
                      }}
                    />
                  </th>
                ))}
                {editing && <th className="w-10" />}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr key={ri} className="border-b border-white/5">
                  {row.map((cell, ci) => (
                    <td key={`${ri}-${ci}`} className="py-4 px-4 text-white/70 text-sm text-center">
                      <EditableText value={cell} onChange={(next) => setCell(ri, ci, next)} />
                    </td>
                  ))}
                  {editing && (
                    <td>
                      <button
                        type="button"
                        className="text-[10px] text-white/30"
                        onClick={() => patchContent(section.id, { rows: rows.filter((_, i) => i !== ri) })}
                      >
                        ×
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {editing && (
          <button
            type="button"
            className="mt-4 text-sm text-neon-cyan"
            onClick={() =>
              patchContent(section.id, {
                rows: [...rows, headers.map(() => '—')],
              })
            }
          >
            + Aggiungi riga
          </button>
        )}
      </div>
    </section>
  );
}

export function CtaSection({ section }: { section: CmsSection }) {
  const { patchContent } = useCms();
  const title = asString(section.content.title);
  const text = asString(section.content.text);
  const buttonText = asString(section.content.buttonText);
  const buttonHref = asString(section.content.buttonHref, 'mailto:info@spaziogame.net');
  const button2Text = asString(section.content.button2Text);
  const button2Href = asString(section.content.button2Href);

  return (
    <section className="px-4 sm:px-6 lg:px-12 py-24">
      <div className="max-w-4xl mx-auto text-center">
        <EditableText
          as="h2"
          className="text-3xl md:text-5xl font-display text-white uppercase tracking-tight mb-6"
          value={title}
          onChange={(next) => patchContent(section.id, { title: next })}
        />
        <EditableText
          as="p"
          multiline
          className="text-white/60 text-lg mb-8 max-w-2xl mx-auto"
          value={text}
          onChange={(next) => patchContent(section.id, { text: next })}
        />
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={buttonHref}
            className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-neon-cyan text-void-black font-medium text-sm tracking-[0.1em] uppercase rounded-full hover:bg-white transition-colors"
          >
            <EditableText value={buttonText} onChange={(next) => patchContent(section.id, { buttonText: next })} />
          </a>
          {button2Text ? (
            <a
              href={button2Href}
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white/10 text-white font-medium text-sm tracking-[0.1em] uppercase rounded-full hover:bg-white/20 transition-colors"
            >
              <EditableText value={button2Text} onChange={(next) => patchContent(section.id, { button2Text: next })} />
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export function BrandsSection({ section }: { section: CmsSection }) {
  const { patchContent } = useCms();
  const editing = useIsEditing();
  const title = asString(section.content.title);
  const text = asString(section.content.text);
  const items = asArray<string>(section.content.items);

  return (
    <section className="px-4 sm:px-6 lg:px-12 py-16 border-t border-white/10">
      <div className="max-w-4xl mx-auto text-center">
        <EditableText
          as="h3"
          className="text-2xl font-display text-white uppercase tracking-tight mb-6"
          value={title}
          onChange={(next) => patchContent(section.id, { title: next })}
        />
        {text ? (
          <EditableText
            as="p"
            className="text-white/60 mb-8"
            value={text}
            onChange={(next) => patchContent(section.id, { text: next })}
          />
        ) : null}
        <div className="flex flex-wrap justify-center gap-4">
          {items.map((brand, i) => (
            <span key={`${brand}-${i}`} className="px-6 py-3 bg-white/5 border border-white/10 rounded-full text-white/60 text-sm inline-flex items-center gap-2">
              <EditableText
                value={brand}
                onChange={(next) => {
                  const copy = [...items];
                  copy[i] = next;
                  patchContent(section.id, { items: copy });
                }}
              />
              {editing && (
                <button
                  type="button"
                  className="text-white/30"
                  onClick={() => patchContent(section.id, { items: items.filter((_, idx) => idx !== i) })}
                >
                  ×
                </button>
              )}
            </span>
          ))}
        </div>
        {editing && (
          <button
            type="button"
            className="mt-4 text-sm text-neon-cyan"
            onClick={() => patchContent(section.id, { items: [...items, 'Nuovo marchio'] })}
          >
            + Aggiungi marchio
          </button>
        )}
      </div>
    </section>
  );
}

export function ContactBannerSection({ section }: { section: CmsSection }) {
  const { patchContent } = useCms();
  const title = asString(section.content.title);
  const text = asString(section.content.text);
  const buttonText = asString(section.content.buttonText);
  const buttonHref = asString(section.content.buttonHref);

  return (
    <section className="px-4 sm:px-6 lg:px-12 py-16 border-t border-white/10">
      <div className="max-w-4xl mx-auto p-8 bg-gradient-to-r from-neon-cyan/10 to-transparent rounded-lg border border-neon-cyan/20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="w-full">
            <EditableText
              as="h4"
              className="text-white font-display text-xl uppercase tracking-tight mb-2"
              value={title}
              onChange={(next) => patchContent(section.id, { title: next })}
            />
            <EditableText
              as="p"
              className="text-white/60 text-sm"
              value={text}
              onChange={(next) => patchContent(section.id, { text: next })}
            />
          </div>
          <a
            href={buttonHref}
            className="shrink-0 flex items-center gap-3 px-6 py-3 bg-neon-cyan text-void-black font-medium text-sm tracking-[0.1em] uppercase rounded-full hover:bg-white transition-colors"
          >
            <EditableText value={buttonText} onChange={(next) => patchContent(section.id, { buttonText: next })} />
          </a>
        </div>
      </div>
    </section>
  );
}
