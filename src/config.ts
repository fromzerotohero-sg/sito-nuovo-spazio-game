// =============================================================================
// Site Configuration - SPAZIOGAME
// Edit ONLY this file to customize all content across the site.
// =============================================================================

// -- Site-wide settings -------------------------------------------------------
export interface SiteConfig {
  title: string;
  description: string;
  language: string;
}

export const siteConfig: SiteConfig = {
  title: "SpazioGame - Games, Cabinet, Assistance",
  description: "Spazio Game è un'azienda dinamica e giovane con sede a Soncino (CR). Offriamo un servizio a 360°: schede di gioco comma 6a, cabinet, monitor, accessori e assistenza tecnica.",
  language: "it",
};

// -- Hero Section -------------------------------------------------------------
export interface HeroNavItem {
  label: string;
  sectionId: string;
  icon: "disc" | "play" | "calendar" | "music";
  href?: string;
}

export interface HeroConfig {
  backgroundImage: string;
  brandName: string;
  decodeText: string;
  decodeChars: string;
  subtitle: string;
  ctaPrimary: string;
  ctaPrimaryTarget: string;
  ctaSecondary: string;
  ctaSecondaryTarget: string;
  cornerLabel: string;
  cornerDetail: string;
  navItems: HeroNavItem[];
}

export const heroConfig: HeroConfig = {
  backgroundImage: "/hero-sede.jpg",
  brandName: "SPAZIOGAME",
  decodeText: "GAMES - CABINET - ASSISTANCE",
  decodeChars: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  subtitle: "Vendita schede di gioco comma 6a, cabinet, monitor e assistenza tecnica per il gaming terrestre. Servizio a 360° per sale slot e noleggiatori.",
  ctaPrimary: "Scopri i Prodotti",
  ctaPrimaryTarget: "features",
  ctaSecondary: "Contattaci",
  ctaSecondaryTarget: "contact",
  cornerLabel: "ISO 9001",
  cornerDetail: "Certified",
  navItems: [
    { label: "Games", sectionId: "features", icon: "disc", href: "/games" },
    { label: "Giochi", sectionId: "gallery", icon: "play", href: "/games" },
    { label: "Assistenza", sectionId: "pricing", icon: "calendar", href: "/assistenza" },
    { label: "Contatti", sectionId: "contact", icon: "music" },
  ],
};

// -- Album Cube Section (Games, Cabinet, Monitor, Accessori) ------------------
export interface Album {
  id: number;
  title: string;
  subtitle: string;
  image: string;
}

export interface AlbumCubeConfig {
  albums: Album[];
  cubeTextures: string[];
  scrollHint: string;
}

export const albumCubeConfig: AlbumCubeConfig = {
  albums: [
    {
      id: 1,
      title: "GAMES",
      subtitle: "SCHEDE DI GIOCO COMMA 6A",
      image: "/games-scheda.jpg",
    },
    {
      id: 2,
      title: "CABINET",
      subtitle: "APPARECCHI E MOBILI",
      image: "/cabinet-earth.jpg",
    },
    {
      id: 3,
      title: "MONITOR",
      subtitle: "OPEN-FRAME 17/19/22",
      image: "/monitor-open.jpg",
    },
    {
      id: 4,
      title: "ACCESSORI",
      subtitle: "DIVISORI E SGABELLI",
      image: "/accessori-divisori.jpg",
    },
  ],
  cubeTextures: [
    "/games-scheda.jpg",
    "/cabinet-earth.jpg",
    "/monitor-open.jpg",
    "/accessori-divisori.jpg",
    "/assistenza-tech.jpg",
    "/hero-sede.jpg",
  ],
  scrollHint: "Scorri per esplorare",
};

// -- Parallax Gallery Section -------------------------------------------------
export interface ParallaxImage {
  id: number;
  src: string;
  alt: string;
}

export interface GalleryImage {
  id: number;
  src: string;
  title: string;
  date: string;
}

export interface ParallaxGalleryConfig {
  sectionLabel: string;
  sectionTitle: string;
  galleryLabel: string;
  galleryTitle: string;
  marqueeTexts: string[];
  endCtaText: string;
  parallaxImagesTop: ParallaxImage[];
  parallaxImagesBottom: ParallaxImage[];
  galleryImages: GalleryImage[];
}

export const parallaxGalleryConfig: ParallaxGalleryConfig = {
  sectionLabel: "I NOSTRI PRODOTTI",
  sectionTitle: "GAMES - CABINET - MONITOR",
  galleryLabel: "I NOSTRI GIOCHI",
  galleryTitle: "MASTER 5 & SUPER 7",
  marqueeTexts: [
    "GAMES",
    "CABINET",
    "MONITOR",
    "ASSISTENZA",
    "SPAZIOGAME",
    "COMMA 6A",
    "MULTIGAME",
  ],
  endCtaText: "Scopri tutti i prodotti",
  parallaxImagesTop: [
    { id: 1, src: "/games-scheda.jpg", alt: "Scheda di gioco" },
    { id: 2, src: "/cabinet-earth.jpg", alt: "Cabinet" },
    { id: 3, src: "/monitor-open.jpg", alt: "Monitor" },
    { id: 4, src: "/accessori-divisori.jpg", alt: "Accessori" },
    { id: 5, src: "/assistenza-tech.jpg", alt: "Assistenza" },
    { id: 6, src: "/hero-sede.jpg", alt: "Sede" },
  ],
  parallaxImagesBottom: [
    { id: 1, src: "/master5-game.jpg", alt: "Master 5" },
    { id: 2, src: "/super7-game.jpg", alt: "Super 7" },
    { id: 3, src: "/gallery-sala.jpg", alt: "Sala Giochi" },
    { id: 4, src: "/games-scheda.jpg", alt: "Games" },
    { id: 5, src: "/sgabelli.jpg", alt: "Sgabelli" },
    { id: 6, src: "/separatore.jpg", alt: "Separatore" },
  ],
  galleryImages: [
    { id: 1, src: "/master5-game.jpg", title: "Master 5", date: "PAYOUT 65% - ASTX-R1" },
    { id: 2, src: "/super7-game.jpg", title: "Super 7", date: "PAYOUT 65% - G_640S" },
    { id: 3, src: "/games-scheda.jpg", title: "Schede di Gioco", date: "COMMA 6A" },
    { id: 4, src: "/cabinet-earth.jpg", title: "Cabinet Earth", date: "MOBILE" },
    { id: 5, src: "/monitor-open.jpg", title: "Monitor Open-Frame", date: "17/19/22" },
    { id: 6, src: "/accessori-divisori.jpg", title: "Accessori", date: "DIVISORI" },
  ],
};

// -- Tour Schedule Section (Assistenza Tecnica) -------------------------------
export interface TourDate {
  id: number;
  date: string;
  time: string;
  city: string;
  venue: string;
  status: "on-sale" | "sold-out" | "coming-soon";
  image: string;
}

export interface TourStatusLabels {
  onSale: string;
  soldOut: string;
  comingSoon: string;
  default: string;
}

export interface TourScheduleConfig {
  sectionLabel: string;
  sectionTitle: string;
  vinylImage: string;
  buyButtonText: string;
  detailsButtonText: string;
  bottomNote: string;
  bottomCtaText: string;
  statusLabels: TourStatusLabels;
  tourDates: TourDate[];
}

export const tourScheduleConfig: TourScheduleConfig = {
  sectionLabel: "ASSISTENZA TECNICA",
  sectionTitle: "CENTRO ASSISTENZA",
  vinylImage: "/assistenza-tech.jpg",
  buyButtonText: "Richiedi Info",
  detailsButtonText: "Dettagli",
  bottomNote: "Supporto professionale per noleggiatori e concessionari",
  bottomCtaText: "Contattaci ora",
  statusLabels: {
    onSale: "DISPONIBILE",
    soldOut: "ESCLUSIVO",
    comingSoon: "PROSSIMAMENTE",
    default: "INFO",
  },
  tourDates: [
    {
      id: 1,
      date: "SERVIZIO",
      time: "RIPARAZIONE",
      city: "SCHEDE",
      venue: "Riparazione e manutenzione di schede e apparecchi da intrattenimento",
      status: "on-sale",
      image: "/games-scheda.jpg",
    },
    {
      id: 2,
      date: "SERVIZIO",
      time: "PERIFERICHE",
      city: "RICAMBI",
      venue: "Monitor, pulsanti, hopper, lettori di banconote, schede CPU - ricambi originali",
      status: "on-sale",
      image: "/monitor-open.jpg",
    },
    {
      id: 3,
      date: "SERVIZIO",
      time: "SUPPORTO",
      city: "TECNICO",
      venue: "Supporto tecnico personalizzato per esigenze specifiche dei noleggiatori",
      status: "on-sale",
      image: "/assistenza-tech.jpg",
    },
    {
      id: 4,
      date: "SERVIZIO",
      time: "CONSULENZA",
      city: "HARDWARE",
      venue: "Consulenza sulla compatibilità e aggiornamenti hardware",
      status: "on-sale",
      image: "/cabinet-earth.jpg",
    },
  ],
};

// -- Footer Section -----------------------------------------------------------
export interface FooterImage {
  id: number;
  src: string;
}

export interface SocialLink {
  icon: "instagram" | "twitter" | "youtube" | "music";
  label: string;
  href: string;
}

export interface QuickLink {
  label: string;
  href: string;
}

export interface FooterConfig {
  portraitImage: string;
  portraitAlt: string;
  heroTitle: string;
  heroSubtitle: string;
  artistLabel: string;
  artistName: string;
  artistSubtitle: string;
  brandName: string;
  brandDescription: string;
  quickLinksTitle: string;
  quickLinks: QuickLink[];
  contactTitle: string;
  emailLabel: string;
  email: string;
  phoneLabel: string;
  phone: string;
  addressLabel: string;
  address: string;
  newsletterTitle: string;
  newsletterDescription: string;
  newsletterButtonText: string;
  subscribeAlertMessage: string;
  copyrightText: string;
  bottomLinks: string[];
  socialLinks: SocialLink[];
  galleryImages: FooterImage[];
}

export const footerConfig: FooterConfig = {
  portraitImage: "/hero-sede.jpg",
  portraitAlt: "Sede SpazioGame",
  heroTitle: "SPAZIO",
  heroSubtitle: "GAME",
  artistLabel: "LET'S",
  artistName: "PLAY IT",
  artistSubtitle: "Games - Cabinet - Assistance",
  brandName: "SPAZIOGAME",
  brandDescription: "Spazio Game è un'azienda dinamica e giovane con sede a Soncino (CR). Offriamo un servizio a 360° per i nostri clienti: schede di gioco comma 6a, cabinet, monitor, accessori e assistenza tecnica. Certificati ISO 9001.",
  quickLinksTitle: "Link Rapidi",
  quickLinks: [
    { label: "Games", href: "/games" },
    { label: "Cabinet", href: "/cabinet" },
    { label: "Monitor", href: "/monitor" },
    { label: "Accessori", href: "/accessori" },
    { label: "Assistenza", href: "/assistenza" },
  ],
  contactTitle: "Contatti",
  emailLabel: "Email",
  email: "info@spaziogame.net",
  phoneLabel: "Telefono",
  phone: "+39 0374 871615",
  addressLabel: "Sede Principale",
  address: "Via Caduti sul Lavoro, snc, 26029 Soncino (CR)",
  newsletterTitle: "Resta Aggiornato",
  newsletterDescription: "Iscriviti per ricevere novità sui nostri prodotti e servizi.",
  newsletterButtonText: "Iscriviti",
  subscribeAlertMessage: "Grazie per l'iscrizione!",
  copyrightText: "© 2024 Spazio Game srls - P.iva 01625480197. Tutti i diritti riservati.",
  bottomLinks: ["Privacy Policy", "Termini di Servizio", "Cookie Policy"],
  socialLinks: [
    { icon: "instagram", label: "Instagram", href: "#" },
    { icon: "twitter", label: "Twitter", href: "#" },
    { icon: "youtube", label: "YouTube", href: "#" },
    { icon: "music", label: "TikTok", href: "#" },
  ],
  galleryImages: [
    { id: 1, src: "/master5-game.jpg" },
    { id: 2, src: "/super7-game.jpg" },
    { id: 3, src: "/games-scheda.jpg" },
    { id: 4, src: "/cabinet-earth.jpg" },
  ],
};
