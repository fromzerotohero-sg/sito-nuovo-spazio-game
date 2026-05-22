import { useRef, useEffect, useMemo } from 'react';
import { Link } from 'react-router';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Ticket, ArrowRight } from 'lucide-react';
import { parallaxGalleryConfig, type GalleryImage, type ParallaxImage } from '../config';
import { useIsMobile } from '../hooks/use-mobile';
import { useSiteAssets } from '../context/SiteAssetsProvider';

gsap.registerPlugin(ScrollTrigger);

function ParallaxStripCard({ image, className }: { image: ParallaxImage; className: string }) {
  const inner = (
    <>
      <img src={image.src} alt={image.alt} className="w-full h-full object-cover" loading="lazy" />
      <div className="absolute inset-0 bg-gradient-to-t from-void-black/50 to-transparent" />
      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-[10px] font-mono-custom uppercase text-white/90">{image.alt}</span>
        <ArrowRight className="w-3 h-3 text-neon-cyan" />
      </div>
    </>
  );

  if (image.href) {
    return (
      <Link to={image.href} className={`${className} group block`}>
        {inner}
      </Link>
    );
  }

  return <div className={className}>{inner}</div>;
}

function GalleryCard({
  image,
  className,
  style,
}: {
  image: GalleryImage;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <Link
      to={image.href}
      className={`relative flex-shrink-0 group cursor-pointer block ${className ?? ''}`}
      style={style}
    >
      <div className="relative w-full sm:w-[450px] aspect-[3/2] sm:h-[300px] overflow-hidden rounded-xl">
        <img
          src={image.src}
          alt={image.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-void-black/80 via-transparent to-transparent" />
        <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4">
          <p className="font-mono-custom text-xs text-neon-soft/80 mb-1">{image.date}</p>
          <h3 className="font-display text-xl sm:text-2xl text-white group-hover:text-neon-soft transition-colors">
            {image.title}
          </h3>
        </div>
        <div className="absolute inset-0 bg-neon-cyan/0 group-hover:bg-neon-cyan/10 transition-colors duration-300" />
      </div>
    </Link>
  );
}

const ParallaxGallery = () => {
  if (
    parallaxGalleryConfig.parallaxImagesTop.length === 0 &&
    parallaxGalleryConfig.galleryImages.length === 0 &&
    !parallaxGalleryConfig.sectionTitle
  ) {
    return null;
  }

  const isMobile = useIsMobile();
  const { resolve } = useSiteAssets();
  const gallery = useMemo(
    () => ({
      parallaxImagesTop: parallaxGalleryConfig.parallaxImagesTop.map((img) => ({
        ...img,
        src: resolve(`parallax.top.${img.id}`, img.src),
      })),
      parallaxImagesBottom: parallaxGalleryConfig.parallaxImagesBottom.map((img) => ({
        ...img,
        src: resolve(`parallax.bottom.${img.id}`, img.src),
      })),
      galleryImages: parallaxGalleryConfig.galleryImages.map((img) => ({
        ...img,
        src: resolve(`gallery.main.${img.id}`, img.src),
      })),
    }),
    [resolve],
  );
  const sectionRef = useRef<HTMLDivElement>(null);
  const parallaxContainerRef = useRef<HTMLDivElement>(null);
  const topRowRef = useRef<HTMLDivElement>(null);
  const bottomRowRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const galleryTrackRef = useRef<HTMLDivElement>(null);
  const scrollTriggerRefs = useRef<ScrollTrigger[]>([]);

  const imageCardClass =
    'relative flex-shrink-0 w-[72vw] max-w-[280px] sm:w-[320px] md:w-[400px] h-[180px] sm:h-[220px] md:h-[250px] overflow-hidden rounded-lg image-hover-scale snap-start';

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      if (topRowRef.current && bottomRowRef.current) {
        const parallaxAmount = isMobile ? 80 : 300;
        const st1 = ScrollTrigger.create({
          trigger: parallaxContainerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
          onUpdate: (self) => {
            const progress = self.progress;
            if (topRowRef.current) {
              gsap.set(topRowRef.current, { x: -progress * parallaxAmount });
            }
            if (bottomRowRef.current) {
              gsap.set(bottomRowRef.current, {
                x: progress * parallaxAmount - parallaxAmount / 2,
              });
            }
          },
        });
        scrollTriggerRefs.current.push(st1);
      }

      if (!isMobile && galleryRef.current && galleryTrackRef.current) {
        const trackWidth = galleryTrackRef.current.scrollWidth;
        const viewportWidth = window.innerWidth;

        const st2 = ScrollTrigger.create({
          trigger: galleryRef.current,
          start: 'top top',
          end: () => `+=${Math.max(trackWidth - viewportWidth, 0)}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (galleryTrackRef.current) {
              const x = -self.progress * (trackWidth - viewportWidth);
              gsap.set(galleryTrackRef.current, { x });
            }
          },
        });
        scrollTriggerRefs.current.push(st2);
      }
    }, sectionRef);

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      ctx.revert();
      scrollTriggerRefs.current.forEach((st) => st.kill());
      scrollTriggerRefs.current = [];
    };
  }, [isMobile]);

  const scrollToTour = () => {
    const tourSection = document.getElementById('tour');
    if (tourSection) {
      tourSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="gallery"
      ref={sectionRef}
      className="relative w-full bg-void-black"
    >
      <div ref={parallaxContainerRef} className="relative py-12 sm:py-20 overflow-hidden">
        <div className="px-4 sm:px-6 md:px-12 mb-8 sm:mb-12">
          <p className="font-mono-custom text-xs text-neon-soft/60 uppercase tracking-wider mb-2">
            {parallaxGalleryConfig.sectionLabel}
          </p>
          <h2 className="font-display text-2xl sm:text-4xl md:text-5xl text-white leading-tight">
            {parallaxGalleryConfig.sectionTitle}
          </h2>
        </div>

        <div
          ref={topRowRef}
          className="flex gap-3 sm:gap-4 mb-3 sm:mb-4 pl-4 sm:pl-6 will-change-transform"
        >
          {gallery.parallaxImagesTop.map((image) => (
            <ParallaxStripCard key={image.id} image={image} className={imageCardClass} />
          ))}
        </div>

        <div
          ref={bottomRowRef}
          className="flex gap-3 sm:gap-4 pl-4 sm:pl-6 will-change-transform"
          style={{ transform: isMobile ? 'translateX(-40px)' : 'translateX(-150px)' }}
        >
          {gallery.parallaxImagesBottom.map((image) => (
            <ParallaxStripCard key={image.id} image={image} className={imageCardClass} />
          ))}
        </div>
      </div>

      <div className="relative py-6 sm:py-8 bg-void-dark overflow-hidden border-y border-white/5">
        <div className="animate-marquee flex whitespace-nowrap">
          {[...Array(8)].map((_, i) => (
            <span
              key={i}
              className="flex items-center gap-4 sm:gap-8 mx-4 sm:mx-8 text-lg sm:text-2xl font-display text-white/20"
            >
              {parallaxGalleryConfig.marqueeTexts.map((text, j) => (
                <span key={j}>{text}</span>
              ))}
              <Ticket className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
              <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
            </span>
          ))}
        </div>
      </div>

      {isMobile ? (
        <div className="py-12 px-4 sm:px-6">
          <p className="font-mono-custom text-xs text-neon-soft/60 uppercase tracking-wider mb-2">
            {parallaxGalleryConfig.galleryLabel}
          </p>
          <h2 className="font-display text-2xl sm:text-4xl text-white mb-8">
            {parallaxGalleryConfig.galleryTitle}
          </h2>
          <div className="space-y-6">
            {gallery.galleryImages.map((image) => (
              <GalleryCard key={image.id} image={image} />
            ))}
            <button
              type="button"
              onClick={scrollToTour}
              className="w-full flex items-center justify-center gap-3 py-4 border border-white/20 rounded-xl text-white font-display text-sm uppercase tracking-wider hover:border-neon-cyan hover:text-neon-cyan transition-colors"
            >
              {parallaxGalleryConfig.endCtaText}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        <div ref={galleryRef} className="relative h-screen overflow-hidden">
          <div className="absolute top-12 left-12 z-20">
            <p className="font-mono-custom text-xs text-neon-soft/60 uppercase tracking-wider mb-2">
              {parallaxGalleryConfig.galleryLabel}
            </p>
            <h2 className="font-display text-4xl md:text-5xl text-white">
              {parallaxGalleryConfig.galleryTitle}
            </h2>
          </div>

          <div
            ref={galleryTrackRef}
            className="flex items-center gap-8 h-full px-12 pt-24 will-change-transform"
          >
            {gallery.galleryImages.map((image, index) => (
              <div
                key={image.id}
                className="relative"
                style={{ marginTop: index % 2 === 0 ? '0' : '60px' }}
              >
                <GalleryCard image={image} />
                <div className="absolute -top-8 -left-4 font-mono-custom text-7xl text-white/5 font-bold pointer-events-none">
                  {String(index + 1).padStart(2, '0')}
                </div>
              </div>
            ))}

            <div className="flex-shrink-0 flex flex-col items-center justify-center w-[300px] h-[300px]">
              <button
                type="button"
                onClick={scrollToTour}
                className="group flex flex-col items-center gap-4 text-white hover:text-neon-cyan transition-colors"
              >
                <div className="w-20 h-20 rounded-full border border-white/20 group-hover:border-neon-cyan flex items-center justify-center transition-colors">
                  <ArrowRight className="w-8 h-8 group-hover:translate-x-1 transition-transform" />
                </div>
                <span className="font-display text-lg uppercase tracking-wider">
                  {parallaxGalleryConfig.endCtaText}
                </span>
              </button>
            </div>
          </div>

          <div className="absolute bottom-12 left-12 right-12 h-px bg-white/10">
            <div className="h-full bg-neon-cyan/50 w-0" id="gallery-progress" />
          </div>
        </div>
      )}
    </section>
  );
};

export default ParallaxGallery;
