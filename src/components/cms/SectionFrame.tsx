import { ArrowDown, ArrowUp, Columns3, Eye, EyeOff, Image, Maximize2, Plus, Trash2 } from 'lucide-react';
import { ADDABLE_SECTIONS, SECTION_LABELS } from '../../cms/catalog';
import type { CmsSection } from '../../cms/types';
import { useCms } from '../../context/CmsProvider';
import { useIsEditing } from '../../context/EditMode';
import { useState } from 'react';

export default function SectionFrame({
  section,
  children,
}: {
  section: CmsSection;
  children: React.ReactNode;
}) {
  const editing = useIsEditing();
  const { moveSection, setVisible, removeSection, patchLayout, addSection } = useCms();
  const [openAdd, setOpenAdd] = useState(false);

  if (!editing) return <>{children}</>;

  const canColumns =
    section.type === 'feature_grid' || section.type === 'image_cards' || section.type === 'provider_groups';
  const columnOptions: Array<2 | 3 | 4> =
    section.type === 'provider_groups' ? [2, 3] : [2, 3, 4];
  const activeColumns =
    section.type === 'provider_groups'
      ? section.layout.columns === 3
        ? 3
        : 2
      : (section.layout.columns ?? 3);
  const canFlip = section.type === 'split' || section.type === 'split_list';
  const canFit =
    section.type === 'split' ||
    section.type === 'split_list' ||
    section.type === 'image_cards' ||
    section.type === 'provider_groups';
  const fitIsCover = section.layout.imageFit === 'cover';

  return (
    <div
      className={`relative group/section ${section.visible ? '' : 'opacity-50'}`}
    >
      <div className="sticky top-16 z-30 flex flex-wrap items-center gap-2 px-3 py-2 mx-3 sm:mx-6 mt-3 rounded-lg border border-neon-cyan/30 bg-void-black/90 backdrop-blur text-xs">
        <span className="font-medium text-neon-cyan mr-1">{section.label || SECTION_LABELS[section.type]}</span>
        {!section.visible && (
          <span className="px-2 py-0.5 rounded bg-white/10 text-white/60">Nascosto sul sito</span>
        )}
        <button
          type="button"
          className="p-1.5 rounded hover:bg-white/10"
          title="Sposta su"
          onClick={() => moveSection(section.id, -1)}
        >
          <ArrowUp size={14} />
        </button>
        <button
          type="button"
          className="p-1.5 rounded hover:bg-white/10"
          title="Sposta giù"
          onClick={() => moveSection(section.id, 1)}
        >
          <ArrowDown size={14} />
        </button>
        <button
          type="button"
          className="p-1.5 rounded hover:bg-white/10"
          title={section.visible ? 'Nascondi' : 'Mostra'}
          onClick={() => setVisible(section.id, !section.visible)}
        >
          {section.visible ? <Eye size={14} /> : <EyeOff size={14} />}
        </button>
        {canFlip && (
          <button
            type="button"
            className="inline-flex items-center gap-1 px-2 py-1 rounded hover:bg-white/10"
            onClick={() =>
              patchLayout(section.id, {
                imageSide: section.layout.imageSide === 'right' ? 'left' : 'right',
              })
            }
          >
            <Image size={14} />
            Foto a {section.layout.imageSide === 'right' ? 'sinistra' : 'destra'}
          </button>
        )}
        {canFit && (
          <button
            type="button"
            className="inline-flex items-center gap-1 px-2 py-1 rounded hover:bg-white/10"
            title="Come entra la foto nel riquadro"
            onClick={() =>
              patchLayout(section.id, {
                imageFit: fitIsCover ? 'contain' : 'cover',
              })
            }
          >
            <Maximize2 size={14} />
            {fitIsCover ? 'Ritaglia' : 'Foto intera'}
          </button>
        )}
        {canColumns && (
          <span className="inline-flex items-center gap-1">
            <Columns3 size={14} />
            {columnOptions.map((n) => (
              <button
                key={n}
                type="button"
                className={`px-2 py-0.5 rounded ${
                  activeColumns === n ? 'bg-neon-cyan text-void-black' : 'hover:bg-white/10'
                }`}
                onClick={() => patchLayout(section.id, { columns: n })}
              >
                {n}
              </button>
            ))}
          </span>
        )}
        <button
          type="button"
          className="ml-auto p-1.5 rounded hover:bg-red-500/20 text-red-300"
          title="Elimina blocco"
          onClick={() => {
            if (confirm('Eliminare questo blocco?')) removeSection(section.id);
          }}
        >
          <Trash2 size={14} />
        </button>
      </div>

      {children}

      <div className="relative z-20 flex justify-center py-2">
        {openAdd ? (
          <div className="flex flex-wrap justify-center gap-2 px-4">
            {ADDABLE_SECTIONS.map((item) => (
              <button
                key={item.type}
                type="button"
                className="px-3 py-2 rounded-lg border border-white/15 bg-void-dark text-left hover:border-neon-cyan/50"
                onClick={() => {
                  addSection(section.page_slug, item.type, section.id);
                  setOpenAdd(false);
                }}
              >
                <span className="block text-xs text-white">{item.label}</span>
                <span className="block text-[10px] text-white/40">{item.hint}</span>
              </button>
            ))}
            <button
              type="button"
              className="px-3 py-2 text-xs text-white/50"
              onClick={() => setOpenAdd(false)}
            >
              Annulla
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-dashed border-white/20 text-[11px] uppercase tracking-wider text-white/50 hover:text-neon-cyan hover:border-neon-cyan/50"
            onClick={() => setOpenAdd(true)}
          >
            <Plus size={12} />
            Aggiungi blocco
          </button>
        )}
      </div>
    </div>
  );
}

export function AddFirstSection({ pageSlug }: { pageSlug: string }) {
  const editing = useIsEditing();
  const { addSection, getSections } = useCms();
  if (!editing || getSections(pageSlug).length > 0) return null;

  return (
    <div className="py-16 text-center">
      <p className="text-white/50 mb-4">Questa pagina è vuota.</p>
      <div className="flex flex-wrap justify-center gap-2">
        {ADDABLE_SECTIONS.map((item) => (
          <button
            key={item.type}
            type="button"
            className="px-3 py-2 rounded-lg border border-white/15 hover:border-neon-cyan/50 text-sm"
            onClick={() => addSection(pageSlug, item.type)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
