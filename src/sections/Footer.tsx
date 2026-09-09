import { useRef, useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Instagram, Twitter, Youtube, Music2, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';
import { footerConfig } from '../config';
import type { CmsSection } from '../cms/types';
import Logo from '../components/Logo';
import EditableImage from '../components/cms/EditableImage';
import { useAppPath, useIsEditing } from '../context/EditMode';
import { useCms } from '../context/CmsProvider';
import { useSiteAssets } from '../context/SiteAssetsProvider';

gsap.registerPlugin(ScrollTrigger);

const SOCIAL_ICON_MAP = {
  instagram: Instagram,
  twitter: Twitter,
  youtube: Youtube,
  music: Music2,
};

const Footer = ({ section }: { section?: CmsSection }) => {
  const cfg = {
    ...footerConfig,
    ...(section?.content as Partial<typeof footerConfig>),
  };

  const { resolve } = useSiteAssets();
  const { patchContent } = useCms();
  const editing = useIsEditing();
  const to = useAppPath();
  const isoLogo = cfg.isoLogo || '';
  const isoHref = cfg.isoHref || '';
  const portraitImage = useMemo(
    () =>
      cfg.portraitImage.startsWith('http')
        ? cfg.portraitImage
        : resolve('footer.portrait', cfg.portraitImage),
    [resolve, cfg.portraitImage],
  );
  const galleryImages = useMemo(
    () =>
      cfg.galleryImages.map((image) => ({
        ...image,
        src: image.src.startsWith('http') ? image.src : resolve(`footer.gallery.${image.id}`, image.src),
      })),
    [resolve, cfg.galleryImages],
  );
  const sectionRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const [hoveredImage, setHoveredImage] = useState<number | null>(null);
  const scrollTriggerRefs = useRef<ScrollTrigger[]>([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Parallax title effect
      if (titleRef.current && portraitRef.current) {
        const st = ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
          onUpdate: (self) => {
            if (titleRef.current) {
              // Title moves faster than portrait
              gsap.set(titleRef.current, {
                y: -self.progress * 100,
              });
            }
          },
        });
        scrollTriggerRefs.current.push(st);
      }
    }, sectionRef);

    return () => {
      ctx.revert();
      scrollTriggerRefs.current.forEach(st => st.kill());
      scrollTriggerRefs.current = [];
    };
  }, []);

  const handleContactClick = () => {
    if (cfg.subscribeAlertMessage) {
      alert(cfg.subscribeAlertMessage);
    }
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative w-full bg-void-black overflow-hidden"
    >
      {/* Artist portrait section */}
      <div className="relative min-h-[70vh] sm:min-h-screen flex items-center justify-center overflow-hidden py-16 sm:py-0">
        {/* Background portrait */}
        <div
          ref={portraitRef}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="relative w-full max-w-xs sm:max-w-md md:max-w-2xl aspect-[2/3] mx-auto px-6 sm:px-0">
            {section?.id ? (
              <EditableImage
                src={portraitImage}
                alt={cfg.portraitAlt}
                fit="cover"
                className="w-full h-full"
                onChange={(next) => patchContent(section.id, { portraitImage: next })}
              />
            ) : (
              <img
                src={portraitImage}
                alt={cfg.portraitAlt}
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-void-black via-void-black/30 to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-void-black via-transparent to-transparent opacity-50 pointer-events-none" />
          </div>
        </div>

        {/* Parallax title overlay */}
        <div
          ref={titleRef}
          className={`relative z-10 text-center will-change-transform ${editing ? 'pointer-events-none' : ''}`}
        >
          <h2 className="font-display text-[18vw] sm:text-[15vw] text-white leading-none tracking-tighter px-2">
            {cfg.heroTitle}
          </h2>
          <p className="font-mono-custom text-sm sm:text-lg text-neon-soft/60 uppercase tracking-[0.3em] sm:tracking-[0.5em] mt-3 sm:mt-4">
            {cfg.heroSubtitle}
          </p>
        </div>

        {/* Artist name */}
        <div className="absolute bottom-6 left-4 right-4 sm:bottom-20 sm:left-12 sm:right-auto z-20 text-center sm:text-left pointer-events-none">
          <p className="font-mono-custom text-xs text-white/40 uppercase tracking-wider mb-2">
            {cfg.artistLabel}
          </p>
          <h3 className="font-display text-2xl sm:text-4xl text-white">{cfg.artistName}</h3>
          <p className="font-mono-custom text-xs sm:text-sm text-neon-soft/60">{cfg.artistSubtitle}</p>
        </div>
      </div>

      {/* Footer content */}
      <div className="relative bg-void-black py-12 sm:py-20 px-4 sm:px-6 md:px-12">
        {/* Top divider */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <div className="max-w-7xl mx-auto">
          {/* Footer grid - Main content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
            {/* Brand */}
            <div>
              <div className="mb-6">
                <Logo size="lg" linkTo="/" className="max-w-[240px]" />
              </div>
              <p className="text-sm text-white/50 leading-relaxed mb-6">
                {cfg.brandDescription}
              </p>
              {(isoLogo || editing) && section?.id ? (
                <div className="mb-6 h-40 w-72 max-w-full">
                  <EditableImage
                    src={isoLogo || '/favicon.png'}
                    alt="ISO 9001"
                    fit="contain"
                    className="h-full w-full"
                    href={isoHref}
                    onChange={(next) => patchContent(section.id, { isoLogo: next })}
                    onHrefChange={(next) => patchContent(section.id, { isoHref: next })}
                  />
                </div>
              ) : isoLogo ? (
                <a
                  href={isoHref || undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mb-6 inline-block h-40 max-w-full"
                >
                  <img src={isoLogo} alt="ISO 9001" className="h-40 w-auto max-w-[18rem] object-contain" />
                </a>
              ) : null}
              {/* Social links */}
              <div className="flex gap-4">
                {cfg.socialLinks.map((social) => {
                  const IconComponent = SOCIAL_ICON_MAP[social.icon];
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/60 hover:text-neon-cyan hover:border-neon-cyan/50 transition-colors"
                      aria-label={social.label}
                    >
                      <IconComponent className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-display text-sm uppercase tracking-wider text-white mb-6">
                {cfg.quickLinksTitle}
              </h4>
              <ul className="space-y-3">
                {cfg.quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={to(link.href)}
                      className="text-sm text-white/50 hover:text-neon-soft transition-colors flex items-center gap-2 group"
                    >
                      <span>{link.label}</span>
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-display text-sm uppercase tracking-wider text-white mb-6">
                {cfg.contactTitle}
              </h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-neon-soft/60 mt-0.5" />
                  <div>
                    <p className="text-sm text-white/50">{cfg.emailLabel}</p>
                    <a href={`mailto:${cfg.email}`} className="text-sm text-white hover:text-neon-soft transition-colors">
                      {cfg.email}
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-neon-soft/60 mt-0.5" />
                  <div>
                    <p className="text-sm text-white/50">{cfg.phoneLabel}</p>
                    <span className="text-sm text-white">{cfg.phone}</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-neon-soft/60 mt-0.5" />
                  <div>
                    <p className="text-sm text-white/50">{cfg.addressLabel}</p>
                    <span className="text-sm text-white">{cfg.address}</span>
                  </div>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="font-display text-sm uppercase tracking-wider text-white mb-6">
                {cfg.newsletterTitle}
              </h4>
              <p className="text-sm text-white/50 mb-4">
                {cfg.newsletterDescription}
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full min-w-0 flex-grow px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-neon-cyan/50"
                />
                <button
                  type="button"
                  onClick={handleContactClick}
                  className="w-full sm:w-auto shrink-0 px-4 py-3 bg-neon-cyan/20 text-neon-cyan rounded-lg text-sm font-medium hover:bg-neon-cyan/30 transition-colors"
                >
                  {cfg.newsletterButtonText}
                </button>
              </div>
            </div>
          </div>

          {/* Footer image grid */}
          {(galleryImages.length > 0 || editing) && (
            <div className="mb-12">
              <p className="font-mono-custom text-xs text-white/30 uppercase tracking-wider mb-4">
                Gallery
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2">
                {galleryImages.map((image, index) => (
                  <div
                    key={image.id}
                    className="relative aspect-square overflow-hidden rounded-lg footer-grid-item"
                    onMouseEnter={() => setHoveredImage(index)}
                    onMouseLeave={() => setHoveredImage(null)}
                  >
                    {section?.id ? (
                      <EditableImage
                        src={image.src}
                        alt=""
                        fit="cover"
                        className={`w-full h-full transition-all duration-300 ${
                          hoveredImage === index ? 'scale-110 brightness-110' : 'brightness-75'
                        }`}
                        onChange={(src) => {
                          const next = galleryImages.map((g, i) => (i === index ? { ...g, src } : g));
                          patchContent(section.id, { galleryImages: next });
                        }}
                      />
                    ) : (
                      <img
                        src={image.src}
                        alt=""
                        className={`w-full h-full object-cover transition-all duration-300 ${
                          hoveredImage === index ? 'scale-110 brightness-110' : 'brightness-75'
                        }`}
                      />
                    )}
                    {editing && section?.id ? (
                      <button
                        type="button"
                        className="absolute top-1 right-1 z-30 text-[10px] bg-void-black/80 px-1.5 py-0.5 rounded text-white/80"
                        onClick={() =>
                          patchContent(section.id, {
                            galleryImages: galleryImages.filter((_, i) => i !== index),
                          })
                        }
                      >
                        Rimuovi
                      </button>
                    ) : null}
                  </div>
                ))}
              </div>
              {editing && section?.id ? (
                <button
                  type="button"
                  className="mt-4 text-sm text-neon-cyan"
                  onClick={() =>
                    patchContent(section.id, {
                      galleryImages: [
                        ...galleryImages,
                        { id: Date.now(), src: '/hero-sede.jpg' },
                      ],
                    })
                  }
                >
                  + Aggiungi foto in galleria
                </button>
              ) : null}
            </div>
          )}

          {/* Bottom bar */}
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-white/30 font-mono-custom">
              {cfg.copyrightText}
            </p>
            <div className="flex flex-wrap justify-center md:justify-end gap-4 sm:gap-6">
              {cfg.bottomLinks.map((link) => (
                <a key={link} href="#" className="text-xs text-white/30 hover:text-white/60 transition-colors">
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Footer;
