import { useEffect } from 'react';
import { siteConfig } from '../../config';
import { useCms } from '../../context/CmsProvider';
import { useIsEditing } from '../../context/EditMode';
import PageLayout from '../PageLayout';
import { AddFirstSection } from './SectionFrame';
import EditableText from './EditableText';
import { SectionRenderer } from './renderSection';

export default function CmsPage({ slug }: { slug: string }) {
  const { ready, getPage, getSections, updatePageTitle } = useCms();
  const editing = useIsEditing();
  const page = getPage(slug);
  const sections = getSections(slug);

  useEffect(() => {
    if (page?.title) {
      document.title = slug === 'home' ? siteConfig.title : `${page.title} — SpazioGame`;
    }
  }, [page?.title, slug]);

  if (!ready) {
    return (
      <div className="min-h-screen bg-void-black flex items-center justify-center text-white/50">
        Caricamento…
      </div>
    );
  }

  const blocks = (
    <>
      <AddFirstSection pageSlug={slug} />
      {sections.map((section) => (
        <SectionRenderer key={section.id} section={section} />
      ))}
    </>
  );

  if (slug === 'home') {
    return <main className="relative w-full min-h-screen bg-void-black overflow-x-hidden">{blocks}</main>;
  }

  return (
    <PageLayout
      title={
        editing ? (
          <EditableText
            as="span"
            className="text-inherit"
            value={page?.title || slug}
            onChange={(title) => updatePageTitle(slug, title)}
          />
        ) : (
          page?.title || slug
        )
      }
    >
      {blocks}
    </PageLayout>
  );
}
