import { useIsEditing } from '../../context/EditMode';

export function normalizeHref(url?: string): string | undefined {
  const value = url?.trim();
  if (!value || value === '#' || value === 'https://' || value === 'http://') return undefined;
  if (
    value.startsWith('http://') ||
    value.startsWith('https://') ||
    value.startsWith('mailto:') ||
    value.startsWith('tel:') ||
    value.startsWith('/')
  ) {
    return value;
  }
  return `https://${value}`;
}

export default function LinkHrefField({
  value,
  onChange,
  placeholder = 'https://sito-esterno.it',
}: {
  value?: string;
  onChange: (href: string) => void;
  placeholder?: string;
}) {
  const editing = useIsEditing();
  if (!editing) return null;

  return (
    <input
      type="text"
      value={value ?? ''}
      placeholder={placeholder}
      onClick={(e) => e.stopPropagation()}
      onChange={(e) => onChange(e.target.value)}
      className="relative z-30 mt-2 w-full rounded border border-white/20 bg-void-black/90 px-2 py-1 text-[11px] text-white placeholder:text-white/30"
      aria-label="Link cliccabile"
    />
  );
}
