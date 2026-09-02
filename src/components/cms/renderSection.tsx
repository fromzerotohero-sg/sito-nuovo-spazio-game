import type { CmsSection } from '../../cms/types';
import { useCms } from '../../context/CmsProvider';
import { useIsEditing } from '../../context/EditMode';
import AlbumCube from '../../sections/AlbumCube';
import Footer from '../../sections/Footer';
import Hero from '../../sections/Hero';
import ParallaxGallery from '../../sections/ParallaxGallery';
import TourSchedule from '../../sections/TourSchedule';
import EditableImage from './EditableImage';
import EditableText from './EditableText';
import {
  BrandsSection,
  ContactBannerSection,
  CtaSection,
  FeatureGridSection,
  ImageCardsSection,
  IntroSection,
  SplitListSection,
  SplitSection,
  TableSection,
} from './GenericSections';
import ProviderGroupsSection from './ProviderGroups';
import SectionFrame from './SectionFrame';

function HomeImagesEditor({ section }: { section: CmsSection }) {
  const editing = useIsEditing();
  const { patchContent } = useCms();
  if (!editing) return null;

  if (section.type === 'album_cube') {
    const albums = (section.content.albums as { title: string; subtitle: string; image: string; href: string }[]) ?? [];
    const cubeTextures = (section.content.cubeTextures as string[]) ?? [];
    return (
      <div className="px-4 pb-6 max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {albums.map((album, i) => (
          <div key={album.title} className="border border-white/10 rounded-lg p-2 bg-void-dark/60">
            <EditableImage
              src={album.image}
              alt={album.title}
              className="w-full aspect-video object-cover rounded"
              onChange={(image) => {
                const next = albums.map((a, idx) => (idx === i ? { ...a, image } : a));
                const textures = [...cubeTextures];
                if (textures[i]) textures[i] = image;
                patchContent(section.id, { albums: next, cubeTextures: textures });
              }}
            />
            <EditableText
              className="mt-2 text-sm text-white"
              value={album.title}
              onChange={(title) => {
                const next = albums.map((a, idx) => (idx === i ? { ...a, title } : a));
                patchContent(section.id, { albums: next });
              }}
            />
            <EditableText
              className="text-xs text-white/50"
              value={album.subtitle}
              onChange={(subtitle) => {
                const next = albums.map((a, idx) => (idx === i ? { ...a, subtitle } : a));
                patchContent(section.id, { albums: next });
              }}
            />
          </div>
        ))}
      </div>
    );
  }

  if (section.type === 'parallax_gallery') {
    const galleryImages = (section.content.galleryImages as { src: string; title: string; date: string; href: string }[]) ?? [];
    return (
      <div className="px-4 pb-6 max-w-6xl mx-auto grid sm:grid-cols-3 gap-3">
        {galleryImages.map((img, i) => (
          <div key={`${img.title}-${i}`} className="border border-white/10 rounded-lg overflow-hidden">
            <EditableImage
              src={img.src}
              alt={img.title}
              className="w-full aspect-video object-cover"
              onChange={(src) => {
                const next = galleryImages.map((g, idx) => (idx === i ? { ...g, src } : g));
                patchContent(section.id, { galleryImages: next });
              }}
            />
            <div className="p-2">
              <EditableText
                className="text-sm text-white"
                value={img.title}
                onChange={(title) => {
                  const next = galleryImages.map((g, idx) => (idx === i ? { ...g, title } : g));
                  patchContent(section.id, { galleryImages: next });
                }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (section.type === 'tour_schedule') {
    const tourDates = (section.content.tourDates as { city: string; venue: string; image: string }[]) ?? [];
    return (
      <div className="px-4 pb-6 max-w-6xl mx-auto space-y-3">
        <EditableImage
          src={(section.content.vinylImage as string) || '/assistenza-tech.jpg'}
          alt="Assistenza"
          className="w-40 h-40 object-cover rounded-lg"
          onChange={(vinylImage) => patchContent(section.id, { vinylImage })}
        />
        {tourDates.map((tour, i) => (
          <div key={i} className="flex gap-3 items-center border border-white/10 rounded-lg p-2">
            <EditableImage
              src={tour.image}
              alt={tour.city}
              className="w-20 h-20 object-cover rounded"
              onChange={(image) => {
                const next = tourDates.map((t, idx) => (idx === i ? { ...t, image } : t));
                patchContent(section.id, { tourDates: next });
              }}
            />
            <div className="flex-1">
              <EditableText
                className="text-white text-sm"
                value={tour.city}
                onChange={(city) => {
                  const next = tourDates.map((t, idx) => (idx === i ? { ...t, city } : t));
                  patchContent(section.id, { tourDates: next });
                }}
              />
              <EditableText
                className="text-white/50 text-xs"
                value={tour.venue}
                onChange={(venue) => {
                  const next = tourDates.map((t, idx) => (idx === i ? { ...t, venue } : t));
                  patchContent(section.id, { tourDates: next });
                }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (section.type === 'footer') {
    return (
      <div className="px-4 pb-6 max-w-6xl mx-auto grid sm:grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-white/40 mb-2">Foto sede</p>
          <EditableImage
            src={(section.content.portraitImage as string) || '/hero-sede.jpg'}
            alt="Sede"
            className="w-full aspect-video object-cover rounded-lg"
            onChange={(portraitImage) => patchContent(section.id, { portraitImage })}
          />
        </div>
        <div className="space-y-2">
          <EditableText
            className="text-white"
            value={(section.content.email as string) || ''}
            onChange={(email) => patchContent(section.id, { email })}
          />
          <EditableText
            className="text-white"
            value={(section.content.phone as string) || ''}
            onChange={(phone) => patchContent(section.id, { phone })}
          />
          <EditableText
            className="text-white/70"
            value={(section.content.address as string) || ''}
            onChange={(address) => patchContent(section.id, { address })}
          />
          <EditableText
            multiline
            className="text-white/50 text-sm"
            value={(section.content.brandDescription as string) || ''}
            onChange={(brandDescription) => patchContent(section.id, { brandDescription })}
          />
          <p className="text-xs text-white/40 mt-4 mb-2">Logo ISO 9001 (cliccabile)</p>
          <div className="h-40 w-72 max-w-full">
            <EditableImage
              src={(section.content.isoLogo as string) || '/favicon.png'}
              alt="ISO 9001"
              fit="contain"
              className="h-full w-full"
              href={(section.content.isoHref as string) || ''}
              onChange={(isoLogo) => patchContent(section.id, { isoLogo })}
              onHrefChange={(isoHref) => patchContent(section.id, { isoHref })}
            />
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export function SectionRenderer({ section }: { section: CmsSection }) {
  const editing = useIsEditing();
  if (!section.visible && !editing) return null;

  let body: React.ReactNode;
  switch (section.type) {
    case 'hero':
      body = <Hero section={section} />;
      break;
    case 'album_cube':
      body = (
        <>
          <AlbumCube section={section} />
          <HomeImagesEditor section={section} />
        </>
      );
      break;
    case 'parallax_gallery':
      body = (
        <>
          <ParallaxGallery section={section} />
          <HomeImagesEditor section={section} />
        </>
      );
      break;
    case 'tour_schedule':
      body = (
        <>
          <TourSchedule section={section} />
          <HomeImagesEditor section={section} />
        </>
      );
      break;
    case 'footer':
      body = (
        <>
          <HomeImagesEditor section={section} />
          <Footer section={section} />
        </>
      );
      break;
    case 'intro':
      body = <IntroSection section={section} />;
      break;
    case 'split':
      body = <SplitSection section={section} />;
      break;
    case 'split_list':
      body = <SplitListSection section={section} />;
      break;
    case 'feature_grid':
      body = <FeatureGridSection section={section} />;
      break;
    case 'image_cards':
      body = <ImageCardsSection section={section} />;
      break;
    case 'table':
      body = <TableSection section={section} />;
      break;
    case 'cta':
      body = <CtaSection section={section} />;
      break;
    case 'brands':
      body = <BrandsSection section={section} />;
      break;
    case 'contact_banner':
      body = <ContactBannerSection section={section} />;
      break;
    case 'provider_groups':
      body = <ProviderGroupsSection section={section} />;
      break;
    default:
      body = null;
  }

  return (
    <SectionFrame key={section.id} section={section}>
      {body}
    </SectionFrame>
  );
}
