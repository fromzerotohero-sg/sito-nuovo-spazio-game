import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { gsap } from 'gsap';
import { Play, Music, Disc, Calendar } from 'lucide-react';
import { heroConfig } from '../config';
import MobileNav from '../components/MobileNav';
import Logo from '../components/Logo';

const ICON_MAP = {
  disc: Disc,
  play: Play,
  calendar: Calendar,
  music: Music,
};

const Hero = () => {
  if (!heroConfig.decodeText && !heroConfig.brandName && heroConfig.navItems.length === 0) {
    return null;
  }

  const heroRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const TARGET_TEXT = heroConfig.decodeText;
  const CHARS = heroConfig.decodeChars || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
  const [displayText, setDisplayText] = useState(' '.repeat(TARGET_TEXT.length));
  const [isDecoding, setIsDecoding] = useState(true);

  useEffect(() => {
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
        navRef.current,
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.3 }
      );

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
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const mobileNavLinks = [
    ...heroConfig.navItems.map((item) =>
      item.href
        ? { label: item.label, to: item.href }
        : { label: item.label, onClick: () => scrollToSection(item.sectionId) }
    ),
    { label: heroConfig.ctaPrimary, onClick: () => scrollToSection(heroConfig.ctaPrimaryTarget) },
    { label: heroConfig.ctaSecondary, onClick: () => scrollToSection(heroConfig.ctaSecondaryTarget) },
  ];

  const NavItem = ({ item }: { item: typeof heroConfig.navItems[0] }) => {
    const IconComponent = ICON_MAP[item.icon];

    if (item.href) {
      return (
        <Link
          to={item.href}
          className="flex items-center gap-1.5 px-3 py-2 text-[10px] sm:text-xs font-mono-custom uppercase tracking-wider text-white/80 hover:text-white transition-colors rounded-full hover:bg-white/5 whitespace-nowrap"
        >
          <IconComponent className="w-3.5 h-3.5 shrink-0" />
          <span>{item.label}</span>
        </Link>
      );
    }

    return (
      <button
        type="button"
        onClick={() => scrollToSection(item.sectionId)}
        className="flex items-center gap-1.5 px-3 py-2 text-[10px] sm:text-xs font-mono-custom uppercase tracking-wider text-white/80 hover:text-white transition-colors rounded-full hover:bg-white/5 whitespace-nowrap"
      >
        <IconComponent className="w-3.5 h-3.5 shrink-0" />
        <span>{item.label}</span>
      </button>
    );
  };

  return (
    <section
      ref={heroRef}
      className="relative w-full min-h-[100dvh] h-[100dvh] overflow-hidden bg-void-black"
    >
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroConfig.backgroundImage})` }}
        />
        <div className="absolute inset-0 video-overlay" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-void-black/30 to-void-black" />
      </div>

      {/* Top bar: brand + mobile menu */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-6 pt-4 sm:pt-6 safe-area-top">
        <Logo size="md" />
        <MobileNav links={mobileNavLinks} />
      </div>

      {/* Desktop nav pill */}
      <nav
        ref={navRef}
        className="hidden md:block fixed top-6 left-1/2 -translate-x-1/2 z-50 nav-pill rounded-full px-2 py-2 max-w-[calc(100vw-2rem)]"
      >
        <div className="flex items-center gap-0.5 overflow-x-auto scrollbar-none">
          {heroConfig.navItems.map((item) => (
            <NavItem key={item.sectionId + (item.href || '')} item={item} />
          ))}
        </div>
      </nav>

      <div className="relative z-10 flex flex-col items-center justify-end h-full pb-8 sm:pb-16 md:pb-20 px-4 sm:px-6">
        <h1
          ref={titleRef}
          className="decode-text text-[8vw] sm:text-[9vw] md:text-[10vw] lg:text-[8vw] font-bold text-white leading-[0.95] tracking-tighter mb-3 sm:mb-4 text-center max-w-[100vw] px-1 break-words"
        >
          <span className={`${isDecoding ? 'text-glow-cyan' : ''} transition-all duration-300`}>
            {displayText}
          </span>
        </h1>

        <p
          ref={subtitleRef}
          className="font-mono-custom text-[10px] sm:text-xs md:text-sm text-neon-soft/70 uppercase tracking-[0.15em] sm:tracking-[0.25em] md:tracking-[0.3em] mb-6 sm:mb-8 text-center max-w-xl leading-relaxed px-2"
        >
          {heroConfig.subtitle}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto max-w-sm sm:max-w-none">
          <button
            type="button"
            onClick={() => scrollToSection(heroConfig.ctaPrimaryTarget)}
            className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-white text-void-black font-display text-xs sm:text-sm uppercase tracking-wider rounded-full hover:bg-neon-soft transition-colors duration-300"
          >
            {heroConfig.ctaPrimary}
          </button>
          <button
            type="button"
            onClick={() => scrollToSection(heroConfig.ctaSecondaryTarget)}
            className="w-full sm:w-auto px-6 sm:px-8 py-3 border border-white/30 text-white font-display text-xs sm:text-sm uppercase tracking-wider rounded-full hover:border-neon-cyan hover:text-neon-cyan transition-colors duration-300"
          >
            {heroConfig.ctaSecondary}
          </button>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neon-cyan/30 to-transparent" />

      <div className="hidden sm:block absolute top-20 sm:top-8 right-4 sm:right-8 text-right">
        <p className="font-mono-custom text-xs text-white/40 uppercase tracking-wider">{heroConfig.cornerLabel}</p>
        <p className="font-mono-custom text-xs text-neon-soft/60">{heroConfig.cornerDetail}</p>
      </div>
    </section>
  );
};

export default Hero;
