export type SectionType =
  | 'hero'
  | 'album_cube'
  | 'parallax_gallery'
  | 'tour_schedule'
  | 'footer'
  | 'intro'
  | 'split'
  | 'split_list'
  | 'feature_grid'
  | 'image_cards'
  | 'table'
  | 'cta'
  | 'brands'
  | 'contact_banner';

export type SectionLayout = {
  imageSide?: 'left' | 'right';
  columns?: 2 | 3 | 4;
  imageRatio?: 'video' | 'portrait' | 'square';
};

export type CmsPage = {
  slug: string;
  title: string;
  path: string;
};

export type CmsSection = {
  id: string;
  page_slug: string;
  type: SectionType;
  label: string;
  sort_order: number;
  visible: boolean;
  layout: SectionLayout;
  content: Record<string, unknown>;
};

export type SpecItem = { label: string; value: string };
export type TextBlock = { type: 'text'; title: string; body: string };
export type ListBlock = { type: 'list'; title: string; items: string[] };
export type CalloutBlock = { type: 'callout'; title: string; body: string };
export type SplitBlock = TextBlock | ListBlock | CalloutBlock;

export type SplitContent = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  body?: string;
  image?: string;
  imageAlt?: string;
  badge?: string;
  specs?: SpecItem[];
  listTitle?: string;
  list?: string[];
  features?: string[];
  blocks?: SplitBlock[];
  ctaText?: string;
  ctaHref?: string;
};

export type SplitListItem = SplitContent & {
  id?: string;
  subtitle?: string;
};

export const PAGE_ORDER = [
  { slug: 'home', title: 'Home', path: '/' },
  { slug: 'games', title: 'Games', path: '/games' },
  { slug: 'cabinet', title: 'Cabinet', path: '/cabinet' },
  { slug: 'monitor', title: 'Monitor', path: '/monitor' },
  { slug: 'accessori', title: 'Accessori', path: '/accessori' },
  { slug: 'assistenza', title: 'Assistenza', path: '/assistenza' },
] as const;
