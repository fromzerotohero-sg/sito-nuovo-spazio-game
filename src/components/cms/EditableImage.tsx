import { useRef, useState } from 'react';
import { ImagePlus, Loader2 } from 'lucide-react';
import { uploadCmsImage } from '../../cms/api';
import { useIsEditing } from '../../context/EditMode';
import { cn } from '../../lib/utils';

type EditableImageProps = {
  src: string;
  alt?: string;
  className?: string;
  onChange: (url: string) => void;
  asBackground?: boolean;
  children?: React.ReactNode;
};

export default function EditableImage({
  src,
  alt = '',
  className,
  onChange,
  asBackground,
  children,
}: EditableImageProps) {
  const editing = useIsEditing();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

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
        accept="image/jpeg,image/png,image/webp,image/gif"
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
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${src})` }} />
        {children}
        {picker}
      </div>
    );
  }

  return (
    <div className={cn('relative', editing && 'group')}>
      <img src={src} alt={alt} className={className} />
      {picker}
    </div>
  );
}
