import { useRef, useState } from 'react';
import { ImagePlus, Loader2 } from 'lucide-react';
import { uploadCmsImage } from '../../cms/api';
import { useIsEditing } from '../../context/EditMode';
import { cn } from '../../lib/utils';
import LinkHrefField, { normalizeHref } from './LinkHrefField';

type EditableImageProps = {
  src: string;
  alt?: string;
  className?: string;
  onChange: (url: string) => void;
  href?: string;
  onHrefChange?: (href: string) => void;
  asBackground?: boolean;
  fit?: 'cover' | 'contain';
  children?: React.ReactNode;
};

export default function EditableImage({
  src,
  alt = '',
  className,
  onChange,
  href,
  onHrefChange,
  asBackground,
  fit = 'cover',
  children,
}: EditableImageProps) {
  const editing = useIsEditing();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const link = normalizeHref(href);

  async function handleFile(file: File) {
    setBusy(true);
    try {
      const url = await uploadCmsImage(file);
      onChange(url);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Errore nel caricamento');
    } finally {
      setBusy(false);
    }
  }

  const picker = editing ? (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFile(file);
          e.target.value = '';
        }}
      />
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          inputRef.current?.click();
        }}
        className="absolute inset-0 z-20 flex items-center justify-center bg-void-black/0 hover:bg-void-black/45 transition-colors group/img"
      >
        <span className="opacity-0 group-hover/img:opacity-100 flex items-center gap-2 px-3 py-2 rounded-full bg-neon-cyan text-void-black text-xs font-medium uppercase tracking-wider">
          {busy ? <Loader2 size={14} className="animate-spin" /> : <ImagePlus size={14} />}
          Cambia foto
        </span>
      </button>
    </>
  ) : null;

  if (asBackground) {
    return (
      <div className={cn('relative', className)}>
        <div
          className={cn(
            'absolute inset-0 bg-center bg-no-repeat',
            fit === 'contain' ? 'bg-contain' : 'bg-cover',
          )}
          style={{ backgroundImage: `url(${src})` }}
        />
        {children}
        {picker}
      </div>
    );
  }

  const image = (
    <img
      src={src}
      alt={alt}
      className={cn('h-full w-full', className, fit === 'contain' ? 'object-contain' : 'object-cover')}
    />
  );

  return (
    <div className={cn('relative h-full w-full', editing && 'group')}>
      {!editing && link ? (
        <a href={link} target="_blank" rel="noopener noreferrer" className="block h-full w-full">
          {image}
        </a>
      ) : (
        image
      )}
      {picker}
      {onHrefChange ? (
        <div className="absolute bottom-2 left-2 right-2 z-30">
          <LinkHrefField value={href} onChange={onHrefChange} placeholder="Link al clic (https://…)" />
        </div>
      ) : null}
    </div>
  );
}
