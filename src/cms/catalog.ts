import type { SectionLayout, SectionType } from './types';

export type AddableSection = {
  type: SectionType;
  label: string;
  hint: string;
  layout: SectionLayout;
  content: Record<string, unknown>;
};

export const ADDABLE_SECTIONS: AddableSection[] = [
  {
    type: 'intro',
    label: 'Testo',
    hint: 'Paragrafo di introduzione',
    layout: {},
    content: { text: 'Scrivi qui il testo…' },
  },
  {
    type: 'split',
    label: 'Foto e testo',
    hint: 'Immagine a fianco del contenuto',
    layout: { imageSide: 'left', imageRatio: 'video', imageFit: 'contain' },
    content: {
      eyebrow: 'Novità',
      title: 'Titolo',
      body: 'Descrivi il prodotto o il servizio.',
      image: '/hero-sede.jpg',
      imageAlt: 'Immagine',
      imageHref: '',
      listTitle: '',
      list: [],
      specs: [],
      ctaText: '',
      ctaHref: 'mailto:info@spaziogame.net',
    },
  },
  {
    type: 'feature_grid',
    label: 'Griglia card',
    hint: 'Card in 2, 3 o 4 colonne',
    layout: { columns: 3 },
    content: {
      title: 'Caratteristiche',
      items: [
        { title: 'Card 1', desc: 'Testo della card' },
        { title: 'Card 2', desc: 'Testo della card' },
        { title: 'Card 3', desc: 'Testo della card' },
      ],
    },
  },
  {
    type: 'image_cards',
    label: 'Galleria foto',
    hint: 'Card con immagine, titolo e testo',
    layout: { columns: 3, imageFit: 'contain' },
    content: {
      title: 'Galleria',
      items: [
        { image: '/hero-sede.jpg', title: 'Foto 1', desc: 'Descrizione', href: '' },
        { image: '/games-scheda.jpg', title: 'Foto 2', desc: 'Descrizione', href: '' },
      ],
    },
  },
  {
    type: 'provider_groups',
    label: 'Giochi per marchio',
    hint: 'Logo del provider e giochi in riga',
    layout: { columns: 4, imageFit: 'contain' },
    content: {
      title: 'Giochi per marchio',
      items: [
        {
          name: 'Octavian',
          logo: '/games-scheda.jpg',
          href: 'https://',
          games: [{ title: 'Gioco', image: '/games-scheda.jpg', href: '' }],
        },
      ],
    },
  },
  {
    type: 'table',
    label: 'Tabella',
    hint: 'Confronto o specifiche',
    layout: {},
    content: {
      title: 'Tabella',
      headers: ['Colonna 1', 'Colonna 2', 'Colonna 3'],
      rows: [
        ['Valore', 'Valore', 'Valore'],
        ['Valore', 'Valore', 'Valore'],
      ],
    },
  },
  {
    type: 'cta',
    label: 'Richiamo contatto',
    hint: 'Titolo, testo e pulsante',
    layout: {},
    content: {
      title: 'Contattaci',
      text: 'Siamo a disposizione per un preventivo.',
      buttonText: 'Scrivici',
      buttonHref: 'mailto:info@spaziogame.net',
    },
  },
  {
    type: 'brands',
    label: 'Marchi',
    hint: 'Elenco di etichette',
    layout: {},
    content: {
      title: 'Marchi',
      text: '',
      items: ['Marchio 1', 'Marchio 2'],
    },
  },
  {
    type: 'contact_banner',
    label: 'Banner contatto',
    hint: 'Telefono ed email in evidenza',
    layout: {},
    content: {
      title: 'Centro Assistenza',
      text: 'Tel: +39 0374 871615 | Email: info@spaziogame.net',
      buttonText: 'Chiama ora',
      buttonHref: 'tel:+390374871615',
    },
  },
];

export const SECTION_LABELS: Record<SectionType, string> = {
  hero: 'Copertina',
  album_cube: 'Cubo prodotti',
  parallax_gallery: 'Galleria',
  tour_schedule: 'Assistenza in evidenza',
  footer: 'Piè di pagina',
  intro: 'Testo',
  split: 'Foto e testo',
  split_list: 'Elenco prodotti',
  feature_grid: 'Griglia card',
  image_cards: 'Galleria foto',
  table: 'Tabella',
  cta: 'Richiamo contatto',
  brands: 'Marchi',
  contact_banner: 'Banner contatto',
  provider_groups: 'Giochi per marchio',
};
