import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ImagePlus, Loader2 } from 'lucide-react';
import { heroConfig } from '../config';
import type { CmsSection } from '../cms/types';
import { uploadCmsImage } from '../cms/api';
import SiteHeader from '../components/SiteHeader';
import EditableImage from '../components/cms/EditableImage';
import EditableText from '../components/cms/EditableText';
import { useCms } from '../context/CmsProvider';
import { useIsEditing } from '../context/EditMode';
import { useSiteAsset } from '../context/SiteAssetsProvider';

const Hero = ({ section }: { section?: CmsSection }) => {
  const editing = useIsEditing();
  const { patchContent } = useCms();
  const content = (section?.content ?? {}) as Record<string, string>;
  const decodeText = content.decodeText ?? heroConfig.decodeText;
  const subtitle = content.subtitle ?? heroConfig.subtitle;
  const ctaPrimary = content.ctaPrimary ?? heroConfig.ctaPrimary;
  const ctaSecondary = content.ctaSecondary ?? heroConfig.ctaSecondary;
  const cornerLabel = content.cornerLabel ?? heroConfig.cornerLabel;
  const cornerDetail = content.cornerDetail ?? heroConfig.cornerDetail;
  const bgFallback = useSiteAsset('hero.background', heroConfig.backgroundImage);
  const heroBackground = content.backgroundImage || bgFallback;
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [photoBusy, setPhotoBusy] = useState(false);
  const TARGET_TEXT = decodeText;
  const CHARS = content.decodeChars || heroConfig.decodeChars || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
  const [displayText, setDisplayText] = useState(editing ? TARGET_TEXT : ' '.repeat(TARGET_TEXT.length));
  const [isDecoding, setIsDecoding] = useState(!editing);

  useEffect(() => {
    if (editing) return;
    let iteration = 0;
    const maxIterations = TARGET_TEXT.length * 8;

    const interval = setInterval(() => {
      setDisplayText(() => {
        return TARGET_TEXT.split('')
          .map((_, index) => {
            if (index < iteration / 8) {
              return TARGET_TEXT[index];
            }
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join('');
      });

      iteration += 1;

      if (iteration >= maxIterations) {
        clearInterval(interval);
        setDisplayText(TARGET_TEXT);
        setIsDecoding(false);
      }
    }, 40);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        subtitleRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 1.5 }
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  async function replaceHeroPhoto(file: File) {
    if (!section) return;
    setPhotoBusy(true);
    try {
      const url = await uploadCmsImage(file);
      patchContent(section.id, { backgroundImage: url });
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Errore nel caricamento');
    } finally {
      setPhotoBusy(false);
    }
  }

  if (!decodeText && !heroConfig.brandName && heroConfig.navItems.length === 0) {
    return null;
  }

  return (
    <section
      ref={heroRef}
      className="relative w-full min-h-[100dvh] h-[100dvh] overflow-hidden bg-void-black"
    >
      <SiteHeader variant="home" />

      {editing && section ? (
        <div className="absolute top-36 sm:top-40 left-1/2 -translate-x-1/2 z-[60] w-[min(92vw,28rem)]">
          <input
            ref={photoInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void replaceHeroPhoto(file);
              e.target.value = '';
            }}
          />
          <button
            type="button"
            onClick={() => photoInputRef.current?.click()}
            className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-neon-cyan px-5 py-3 text-void-black text-xs sm:text-sm font-medium uppercase tracking-wider shadow-lg hover:bg-white"
          >
            {photoBusy ? <Loader2 size={16} className="animate-spin" /> : <ImagePlus size={16} />}
            Cambia foto azienda
          </button>
        </div>
      ) : null}

      <div className="absolute inset-0 z-0">
        <EditableImage
          asBackground
          src={heroBackground}
          className="absolute inset-0"
          onChange={(backgroundImage) => section && patchContent(section.id, { backgroundImage })}
        >
          <div className="absolute inset-0 video-overlay" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-void-black/30 to-void-black" />
        </EditableImage>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-end h-full pb-8 sm:pb-16 md:pb-20 px-4 sm:px-6 pt-24">
        <h1
          ref={titleRef}
          className="decode-text text-[8vw] sm:text-[9vw] md:text-[10vw] lg:text-[8vw] font-bold text-white leading-[0.95] tracking-tighter mb-3 sm:mb-4 text-center max-w-[100vw] px-1 break-words"
        >
          <span className={`${isDecoding ? 'text-glow-cyan' : ''} transition-all duration-300`}>
            {editing && section ? (
              <EditableText
                value={decodeText}
                onChange={(next) => patchContent(section.id, { decodeText: next })}
              />
            ) : (
              displayText
            )}
          </span>
        </h1>

        <p
          ref={subtitleRef}
          className="font-mono-custom text-[10px] sm:text-xs md:text-sm text-neon-soft/70 uppercase tracking-[0.15em] sm:tracking-[0.25em] md:tracking-[0.3em] mb-6 sm:mb-8 text-center max-w-xl leading-relaxed px-2"
        >
          {section ? (
            <EditableText
              multiline
              value={subtitle}
              onChange={(next) => patchContent(section.id, { subtitle: next })}
            />
          ) : (
            subtitle
          )}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto max-w-sm sm:max-w-none">
          <button
            type="button"
            onClick={() => scrollToSection(content.ctaPrimaryTarget || heroConfig.ctaPrimaryTarget)}
            className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-white text-void-black font-display text-xs sm:text-sm uppercase tracking-wider rounded-full hover:bg-neon-soft transition-colors duration-300"
          >
            {section ? (
              <EditableText value={ctaPrimary} onChange={(next) => patchContent(section.id, { ctaPrimary: next })} />
            ) : (
              ctaPrimary
            )}
          </button>
          <button
            type="button"
            onClick={() => scrollToSection(content.ctaSecondaryTarget || heroConfig.ctaSecondaryTarget)}
            className="w-full sm:w-auto px-6 sm:px-8 py-3 border border-white/30 text-white font-display text-xs sm:text-sm uppercase tracking-wider rounded-full hover:border-neon-cyan hover:text-neon-cyan transition-colors duration-300"
          >
            {section ? (
              <EditableText value={ctaSecondary} onChange={(next) => patchContent(section.id, { ctaSecondary: next })} />
            ) : (
              ctaSecondary
            )}
          </button>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neon-cyan/30 to-transparent" />

      <div className="hidden sm:block absolute top-24 right-4 sm:right-8 text-right z-10">
        <p className="font-mono-custom text-xs text-white/40 uppercase tracking-wider">
          {section ? (
            <EditableText value={cornerLabel} onChange={(next) => patchContent(section.id, { cornerLabel: next })} />
          ) : (
            cornerLabel
          )}
        </p>
        <p className="font-mono-custom text-xs text-neon-soft/60">
          {section ? (
            <EditableText value={cornerDetail} onChange={(next) => patchContent(section.id, { cornerDetail: next })} />
          ) : (
            cornerDetail
          )}
        </p>
      </div>
    </section>
  );
};

export default Hero;
