import { useEffect, useRef, useState } from 'react';
import { cn } from '../../lib/utils';
import { useIsEditing } from '../../context/EditMode';

type EditableTextProps = {
  value: string;
  onChange: (value: string) => void;
  as?: 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'div';
  className?: string;
  multiline?: boolean;
  placeholder?: string;
};

export default function EditableText({
  value,
  onChange,
  as: Tag = 'span',
  className,
  multiline = false,
  placeholder = 'Scrivi…',
}: EditableTextProps) {
  const editing = useIsEditing();
  const [active, setActive] = useState(false);
  const [draft, setDraft] = useState(value);
  const ref = useRef<HTMLTextAreaElement | HTMLInputElement>(null);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  useEffect(() => {
    if (active) ref.current?.focus();
  }, [active]);

  if (!editing) {
    return <Tag className={className}>{value}</Tag>;
  }

  const commit = () => {
    setActive(false);
    const next = draft.trim();
    setDraft(next);
    if (next !== value) onChange(next);
  };

  if (active) {
    const shared = {
      ref: ref as never,
      value: draft,
      onChange: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => setDraft(e.target.value),
      onBlur: commit,
      onKeyDown: (e: React.KeyboardEvent) => {
        if (!multiline && e.key === 'Enter') {
          e.preventDefault();
          commit();
        }
        if (e.key === 'Escape') {
          setDraft(value);
          setActive(false);
        }
      },
      placeholder,
      className: cn(
        className,
        'w-full bg-void-black/80 border border-neon-cyan/60 rounded px-1 text-inherit font-inherit outline-none',
      ),
    };
    if (multiline) {
      return <textarea {...shared} rows={Math.min(8, Math.max(3, draft.split('\n').length + 1))} />;
    }
    return <input {...shared} />;
  }

  return (
    <Tag
      className={cn(
        className,
        'cursor-text rounded-sm outline-dashed outline-1 outline-transparent hover:outline-neon-cyan/50 hover:bg-neon-cyan/5',
      )}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setActive(true);
      }}
      title="Clicca per modificare"
    >
      {value || placeholder}
    </Tag>
  );
}
